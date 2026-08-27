import React, { useCallback, useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import erpApi, { hasErpSession } from "@/lib/erpApi";
import PlatformToggle from "../Online Print/OnlinePrintComponent/PlatformToggle";
import LoadingSpinner from "../Online Print/OnlinePrintComponent/LoadingSpinner";

const ITEMS_PER_PAGE = 20;

const platformLabels = {
  all: "All",
  tiktok: "TikTok",
  shopee: "Shopee",
};

const emptyPagination = {
  page: 1,
  limit: ITEMS_PER_PAGE,
  total: 0,
  totalPages: 1,
};

const emptySummary = {
  totalTransactions: 0,
  totalAmount: 0,
  currencyBreakdown: [],
  platforms: {
    tiktok: { transactions: 0, amount: 0, currencyBreakdown: [] },
    shopee: { transactions: 0, amount: 0, currencyBreakdown: [] },
  },
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const formatAmount = (amount) => {
  const number = Number(amount);
  if (Number.isNaN(number)) return "0";
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatCurrencyBreakdown = (breakdown = [], fallbackAmount = 0) => {
  if (Array.isArray(breakdown) && breakdown.length > 0) {
    return breakdown
      .map((item) => `${item.currency || "-"} ${formatAmount(item.amount)}`)
      .join(" + ");
  }

  return formatAmount(fallbackAmount);
};

const getStatusClasses = (status) => {
  const value = String(status || "").toLowerCase();
  if (value.includes("succeed") || value === "paid") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (value.includes("pending") || value.includes("process")) {
    return "bg-amber-100 text-amber-700";
  }
  if (value.includes("fail") || value.includes("cancel") || value.includes("decline")) {
    return "bg-red-100 text-red-700";
  }
  return "bg-gray-100 text-gray-700";
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
      status,
    )}`}
  >
    {formatValue(status)}
  </span>
);

const PlatformBadge = ({ platform }) => (
  <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-[#004368]">
    {platformLabels[String(platform || "").toLowerCase()] || formatValue(platform)}
  </span>
);

const normalizeTransaction = (row) => ({
  id: row?.id ?? "-",
  paymentUid: row?.paymentUid ?? row?.payment_uid ?? "-",
  paymentGroupUid: row?.paymentGroupUid ?? row?.payment_group_uid ?? "-",
  platform: row?.platform ?? "-",
  storeId: row?.storeId ?? row?.store_id ?? row?.platformStoreId ?? row?.platform_store_id ?? "-",
  storeName:
    row?.storeName ??
    row?.store_name ??
    row?.externalStoreName ??
    row?.external_store_name ??
    "-",
  externalStoreId:
    row?.externalStoreId ??
    row?.external_store_id ??
    row?.externalShopId ??
    row?.external_shop_id ??
    "-",
  country: row?.country ?? row?.region ?? row?.marketplaceCountry ?? row?.marketplace_country ?? "-",
  companyId: row?.companyId ?? row?.company_id ?? row?.purchaserCompanyId ?? row?.purchaser_company_id ?? "-",
  companyName: row?.companyName ?? row?.company_name ?? "-",
  purchaserEmail: row?.purchaserEmail ?? row?.purchaser_email ?? row?.email ?? "-",
  purchaserUserName:
    row?.purchaserUserName ??
    row?.purchaser_user_name ??
    row?.userName ??
    row?.user_name ??
    row?.name ??
    "-",
  planName: row?.planName ?? row?.plan_name ?? "-",
  planCode: row?.planCode ?? row?.plan_code ?? "-",
  amount: row?.amount ?? 0,
  currency: row?.currency ?? "-",
  paymentProvider: row?.paymentProvider ?? row?.payment_provider ?? "-",
  paymentStatus: row?.paymentStatus ?? row?.payment_status ?? "-",
  paidAt: row?.paidAt ?? row?.paid_at ?? row?.createdAt ?? row?.created_at ?? null,
  previousExpiry: row?.previousExpiry ?? row?.previous_expiry ?? null,
  newExpiry: row?.newExpiry ?? row?.new_expiry ?? null,
  couponCode: row?.couponCode ?? row?.coupon_code ?? "-",
  redeemedCouponCode:
    row?.redeemedCouponCode ??
    row?.redeemed_coupon_code ??
    row?.metadata?.redeemedCouponCode ??
    row?.metadata?.redeemed_coupon_code ??
    "-",
});

const normalizeSummary = (summary) => ({
  ...emptySummary,
  ...(summary || {}),
  platforms: {
    ...emptySummary.platforms,
    ...(summary?.platforms || {}),
    tiktok: {
      ...emptySummary.platforms.tiktok,
      ...(summary?.platforms?.tiktok || {}),
    },
    shopee: {
      ...emptySummary.platforms.shopee,
      ...(summary?.platforms?.shopee || {}),
    },
  },
});

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.rows)) return payload.data.rows;
  if (Array.isArray(payload?.data?.data?.rows)) return payload.data.data.rows;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const extractSummary = (payload) =>
  normalizeSummary(payload?.data?.summary || payload?.summary || payload?.data?.data?.summary);

const extractPagination = (payload, params, rowCount) =>
  payload?.pagination ||
  payload?.data?.pagination ||
  payload?.data?.data?.pagination || {
    ...emptyPagination,
    page: params.page,
    limit: params.limit,
    total: rowCount,
    totalPages: Math.max(1, Math.ceil(rowCount / (params.limit || ITEMS_PER_PAGE))),
  };

const buildQuery = ({ platform, search, startDate, endDate, page, limit, exportData }) => ({
  platform,
  ...(page ? { page } : {}),
  ...(limit ? { limit } : {}),
  ...(search ? { search } : {}),
  ...(startDate ? { startDate } : {}),
  ...(endDate ? { endDate } : {}),
  ...(exportData ? { export: true } : {}),
});

const fetchPlatformTransactions = async (params) => {
  const response = await erpApi.get("/admin/platform-transactions", {
    params: buildQuery(params),
  });
  const payload = response.data || {};
  const rows = extractRows(payload).map(normalizeTransaction);

  return {
    rows,
    summary: extractSummary(payload),
    pagination: extractPagination(payload, params, rows.length),
  };
};

const fetchExportTransactions = async (params) => {
  const response = await erpApi.get("/admin/platform-transactions", {
    params: buildQuery({ ...params, exportData: true }),
  });

  return extractRows(response.data || {}).map(normalizeTransaction);
};

const exportTransactionsToExcel = async (rows, platform, startDate, endDate, type) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${platformLabels[platform]} Transactions`);

  worksheet.columns = [
    { header: "Sr", key: "serialNumber", width: 10 },
    { header: "Platform", key: "platform", width: 14 },
    { header: "Store Name", key: "storeName", width: 28 },
    { header: "Country", key: "country", width: 12 },
    { header: "Company ID", key: "companyId", width: 14 },
    { header: "Purchaser Email", key: "purchaserEmail", width: 34 },
    { header: "Plan Name", key: "planName", width: 22 },
    { header: "Amount", key: "amount", width: 14 },
    { header: "Currency", key: "currency", width: 12 },
    { header: "Payment Status", key: "paymentStatus", width: 18 },
    { header: "Paid At", key: "paidAt", width: 24 },
    { header: "New Expiry", key: "newExpiry", width: 24 },
    { header: "Coupon Code", key: "couponCode", width: 20 },
  ];

  worksheet.insertRow(1, [`${platformLabels[platform]} Platform Transactions`]);
  worksheet.mergeCells("A1:M1");
  worksheet.getRow(1).height = 28;
  worksheet.getRow(1).getCell(1).font = { bold: true, size: 16 };
  worksheet.getRow(1).getCell(1).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(2).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF004368" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  rows.forEach((row, index) => {
    worksheet.addRow({
      serialNumber: index + 1,
      storeName: row.storeName,
      country: row.country,
      companyId: row.companyId,
      purchaserEmail: row.purchaserEmail,
      planName: row.planName,
      amount: row.amount,
      currency: row.currency,
      paymentStatus: row.paymentStatus,
      newExpiry: formatDateTime(row.newExpiry),
      couponCode: row.couponCode,
      platform: platformLabels[String(row.platform).toLowerCase()] || row.platform,
      paidAt: formatDateTime(row.paidAt),
    });
  });

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
    });
  });

  const today = new Date().toISOString().slice(0, 10);
  const platformPrefix =
    platform === "all" ? "all-platform-transactions" : `${platform}-transactions`;
  const filename =
    type === "datewise" && startDate && endDate
      ? `${platformPrefix}-${startDate}-to-${endDate}.xlsx`
      : `${platformPrefix}-${today}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const SummaryLine = ({ label, value, highlight }) => (
  <div
    className={`flex items-center justify-between border-b border-slate-100 py-2 last:border-b-0 ${
      highlight ? "text-[#004368]" : "text-slate-700"
    }`}
  >
    <span className="text-sm font-semibold">{label}</span>
    <span className="text-base font-bold">{value}</span>
  </div>
);

const TransactionSummaryPanel = ({ activePlatform, summary }) => {
  const tiktokSummary = summary.platforms.tiktok;
  const shopeeSummary = summary.platforms.shopee;

  if (activePlatform === "tiktok") {
    return (
      <div className="mb-6 rounded-xl border border-[#004368] bg-white p-5 shadow ring-2 ring-blue-100">
        <h3 className="mb-3 text-lg font-bold text-gray-800">TikTok Summary</h3>
        <SummaryLine label="TikTok Transactions" value={tiktokSummary.transactions || 0} highlight />
        <SummaryLine
          label="TikTok Amount"
          value={formatCurrencyBreakdown(tiktokSummary.currencyBreakdown, tiktokSummary.amount)}
          highlight
        />
      </div>
    );
  }

  if (activePlatform === "shopee") {
    return (
      <div className="mb-6 rounded-xl border border-[#004368] bg-white p-5 shadow ring-2 ring-blue-100">
        <h3 className="mb-3 text-lg font-bold text-gray-800">Shopee Summary</h3>
        <SummaryLine label="Shopee Transactions" value={shopeeSummary.transactions || 0} highlight />
        <SummaryLine
          label="Shopee Amount"
          value={formatCurrencyBreakdown(shopeeSummary.currencyBreakdown, shopeeSummary.amount)}
          highlight
        />
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-bold text-gray-800">Transaction Summary</h3>
          <SummaryLine label="Total Transactions" value={summary.totalTransactions || 0} highlight />
          <SummaryLine label="TikTok Transactions" value={tiktokSummary.transactions || 0} />
          <SummaryLine label="Shopee Transactions" value={shopeeSummary.transactions || 0} />
        </div>
        <div>
          <h3 className="mb-3 text-lg font-bold text-gray-800">Amount Summary</h3>
          <SummaryLine
            label="Total Amount"
            value={formatCurrencyBreakdown(summary.currencyBreakdown, summary.totalAmount)}
            highlight
          />
          <SummaryLine
            label="TikTok Amount"
            value={formatCurrencyBreakdown(tiktokSummary.currencyBreakdown, tiktokSummary.amount)}
          />
          <SummaryLine
            label="Shopee Amount"
            value={formatCurrencyBreakdown(shopeeSummary.currencyBreakdown, shopeeSummary.amount)}
          />
        </div>
      </div>
    </div>
  );
};

const PlatformTransactions = () => {
  const [activePlatform, setActivePlatform] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [pagination, setPagination] = useState(emptyPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [erpSessionConnected, setErpSessionConnected] = useState(hasErpSession());
  const [exportLoading, setExportLoading] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const loadRows = useCallback(async () => {
    if (!hasErpSession()) {
      setErpSessionConnected(false);
      setRows([]);
      setSummary(emptySummary);
      setPagination(emptyPagination);
      setError("");
      return;
    }

    setErpSessionConnected(true);
    setLoading(true);
    setError("");

    try {
      const result = await fetchPlatformTransactions({
        platform: activePlatform,
        search: debouncedSearch,
        startDate,
        endDate,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      setRows(result.rows);
      setSummary(result.summary);
      setPagination(result.pagination);
    } catch (err) {
      console.error("Error fetching ERP platform transactions:", err);
      setRows([]);
      setSummary(emptySummary);
      setPagination(emptyPagination);

      if (err?.response?.status === 401) {
        setErpSessionConnected(false);
        setError("");
      } else if (err?.response?.status === 403) {
        setError("You do not have ERP admin permission.");
      } else if (err?.response?.status === 404) {
        setError("Platform transactions API is not available yet. Backend needs GET /api/v1/admin/platform-transactions.");
      } else {
        setError("Failed to load platform transactions. Please check ERP API access.");
      }
    } finally {
      setLoading(false);
    }
  }, [activePlatform, debouncedSearch, endDate, currentPage, startDate]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const totalPages = useMemo(() => {
    const total = Number(pagination?.total || 0);
    const limit = Number(pagination?.limit || ITEMS_PER_PAGE);
    return Math.max(1, Number(pagination?.totalPages || Math.ceil(total / limit)));
  }, [pagination]);

  const handlePlatformChange = (platform) => {
    setActivePlatform(platform);
    setSearch("");
    setDebouncedSearch("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const validateDateRange = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be later than end date");
      return false;
    }
    return true;
  };

  const getExportRows = async (type) => {
    if (!hasErpSession()) {
      setErpSessionConnected(false);
      throw new Error("ERP session required");
    }

    if (!validateDateRange()) return [];

    const params = {
      platform: activePlatform,
      search: type === "current" ? debouncedSearch : "",
      startDate: type === "current" || type === "datewise" ? startDate : "",
      endDate: type === "current" || type === "datewise" ? endDate : "",
    };

    return fetchExportTransactions(params);
  };

  const handleExport = async (type) => {
    if (type === "datewise" && (!startDate || !endDate)) {
      alert("Please select both start and end dates");
      return;
    }

    setExportLoading(type);

    try {
      const exportRows = await getExportRows(type);
      if (exportRows.length === 0) {
        alert("No data available to export");
        return;
      }

      await exportTransactionsToExcel(exportRows, activePlatform, startDate, endDate, type);
    } catch (err) {
      console.error("Export ERP platform transactions error:", err);
      if (err?.response?.status === 404) {
        alert("Platform transactions export API is not available yet.");
      } else if (err?.response?.status === 403) {
        alert("You do not have ERP admin permission.");
      } else {
        alert("Failed to export transactions");
      }
    } finally {
      setExportLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto mb-20 max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Platform Transactions
          </h1>
          <p className="text-gray-600">
            Monitor subscription and payment transactions by marketplace platform.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex rounded-full bg-slate-200 p-1 shadow-inner">
            {["all", "tiktok", "shopee"].map((platform) => (
              <PlatformToggle
                key={platform}
                platform={platform}
                label={platformLabels[platform]}
                isActive={activePlatform === platform}
                onClick={handlePlatformChange}
                loading={loading && activePlatform === platform}
              />
            ))}
          </div>
        </div>

        {!erpSessionConnected ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-12 text-center shadow">
            <h3 className="mb-2 text-lg font-semibold text-amber-800">
              ERP session required
            </h3>
            <p className="mx-auto max-w-2xl text-sm text-amber-700">
              ERP admin session is not connected. Please login again with an ERP admin email.
            </p>
          </div>
        ) : (
          <>
            <TransactionSummaryPanel activePlatform={activePlatform} summary={summary} />

            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow">
              <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_auto] xl:items-end">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Search
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search email, company, store, payment ID, coupon, or plan"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Start date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(event) => {
                        setStartDate(event.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      End date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(event) => {
                        setEndDate(event.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleExport("current")}
                    disabled={Boolean(exportLoading)}
                    className="rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    {exportLoading === "current" ? "Exporting..." : "Export Current Filter"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("all")}
                    disabled={Boolean(exportLoading)}
                    className="rounded-lg bg-[#004368] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#003450] disabled:opacity-50"
                  >
                    {exportLoading === "all" ? "Exporting..." : "Export All Platform Data"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("datewise")}
                    disabled={Boolean(exportLoading)}
                    className="rounded-lg bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
                  >
                    {exportLoading === "datewise" ? "Exporting..." : "Export Date Wise"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-5 shadow">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {platformLabels[activePlatform]} Transactions
                </h2>
                <p className="text-sm text-gray-600">
                  Total transactions: {pagination?.total || 0}
                </p>
              </div>
              <button
                type="button"
                onClick={loadRows}
                disabled={loading}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <LoadingSpinner />
            ) : rows.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white py-16 text-center shadow">
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  No transactions found.
                </h3>
                <p className="text-gray-500">
                  Try another platform, search term, or paid date range.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow">
                  <table className="min-w-[1500px] text-left text-sm">
                    <thead className="border-b bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-3">Sr</th>
                        <th className="px-4 py-3">Platform</th>
                        <th className="px-4 py-3">Store Name</th>
                        <th className="px-4 py-3">Country</th>
                        <th className="px-4 py-3">Company ID</th>
                        <th className="px-4 py-3">Purchaser Email</th>
                        <th className="px-4 py-3">Plan Name</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Currency</th>
                        <th className="px-4 py-3">Payment Status</th>
                        <th className="px-4 py-3">Paid At</th>
                        <th className="px-4 py-3">New Expiry</th>
                        <th className="px-4 py-3">Coupon Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rows.map((row, index) => (
                        <tr key={`${row.id}-${row.paymentUid}`} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <PlatformBadge platform={row.platform} />
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">{formatValue(row.storeName)}</td>
                          <td className="px-4 py-3 text-slate-600">{formatValue(row.country)}</td>
                          <td className="px-4 py-3 text-slate-600">{formatValue(row.companyId)}</td>
                          <td className="px-4 py-3 text-slate-600">{formatValue(row.purchaserEmail)}</td>
                          <td className="px-4 py-3 text-slate-600">{formatValue(row.planName)}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{formatAmount(row.amount)}</td>
                          <td className="px-4 py-3 text-slate-600">{formatValue(row.currency)}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={row.paymentStatus} />
                          </td>
                          <td className="px-4 py-3 text-slate-600">{formatDateTime(row.paidAt)}</td>
                          <td className="px-4 py-3 text-slate-600">{formatDateTime(row.newExpiry)}</td>
                          <td className="px-4 py-3 text-slate-600">{formatValue(row.couponCode)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg bg-gray-200 px-4 py-2 transition hover:bg-gray-300 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-lg bg-gray-200 px-4 py-2 transition hover:bg-gray-300 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlatformTransactions;
