import React, { useCallback, useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import erpApi, { hasErpSession } from "@/lib/erpApi";
import LoadingSpinner from "../Online Print/OnlinePrintComponent/LoadingSpinner";

const ITEMS_PER_PAGE = 20;
const PERMISSION_MESSAGE =
  "You do not have permission to view shipping wallet payments.";

const emptySummary = {
  totalTopUps: 0,
  totalPaidOriginal: 0,
  originalCurrencyBreakdown: [],
  totalGrossMyr: 0,
  totalCreditedMyr: 0,
  totalFeeOrReserveMyr: 0,
  statusBreakdown: [],
};

const emptyPagination = {
  total: 0,
  page: 1,
  limit: ITEMS_PER_PAGE,
  totalPages: 1,
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

const formatAmount = (amount, currency = "") => {
  const number = Number(amount);
  if (Number.isNaN(number)) return currency ? `0 ${currency}` : "0";

  const formatted = number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currency ? `${formatted} ${currency}` : formatted;
};

const formatBreakdown = (breakdown) => {
  if (Array.isArray(breakdown)) {
    return breakdown
      .map((item) =>
        typeof item === "string"
          ? item
          : `${item.currency || "-"} ${formatAmount(item.amount || item.total || 0)}`,
      )
      .join(" + ");
  }

  if (breakdown && typeof breakdown === "object") {
    return Object.entries(breakdown)
      .map(([currency, amount]) => `${currency} ${formatAmount(amount)}`)
      .join(" + ");
  }

  return "-";
};

const getStatusClasses = (status) => {
  const value = String(status || "").toLowerCase();
  if (value === "paid" || value === "succeeded") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (value.includes("pending") || value.includes("process")) {
    return "bg-amber-100 text-amber-700";
  }
  if (value.includes("fail") || value.includes("cancel") || value.includes("refund")) {
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

const normalizePayment = (row) => ({
  ledgerId: row?.ledgerId ?? row?.ledger_id ?? "-",
  companyId: row?.companyId ?? row?.company_id ?? "-",
  companyName: row?.companyName ?? row?.company_name ?? "-",
  companyEmail: row?.companyEmail ?? row?.company_email ?? "-",
  ownerName: row?.ownerName ?? row?.owner_name ?? "-",
  ownerEmail: row?.ownerEmail ?? row?.owner_email ?? "-",
  customerName: row?.customerName ?? row?.customer_name ?? "-",
  customerEmail: row?.customerEmail ?? row?.customer_email ?? "-",
  paidAmount: row?.paidAmount ?? row?.paid_amount ?? 0,
  paidCurrency: row?.paidCurrency ?? row?.paid_currency ?? "-",
  creditedMyrAmount: row?.creditedMyrAmount ?? row?.credited_myr_amount ?? 0,
  grossMyrAmount: row?.grossMyrAmount ?? row?.gross_myr_amount ?? 0,
  feeOrReserveMyr: row?.feeOrReserveMyr ?? row?.fee_or_reserve_myr ?? 0,
  walletBalanceMyr: row?.walletBalanceMyr ?? row?.wallet_balance_myr ?? 0,
  status: row?.status ?? "-",
  provider: row?.provider ?? "-",
  stripeSessionId: row?.stripeSessionId ?? row?.stripe_session_id ?? "-",
  stripePaymentIntentId:
    row?.stripePaymentIntentId ?? row?.stripe_payment_intent_id ?? "-",
  createdAt: row?.createdAt ?? row?.created_at ?? null,
  paidAt: row?.paidAt ?? row?.paid_at ?? null,
});

const normalizeSummary = (summary) => ({
  ...emptySummary,
  ...(summary || {}),
});

const extractRows = (payload) => {
  if (Array.isArray(payload?.data?.rows)) return payload.data.rows;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.data?.data?.rows)) return payload.data.data.rows;
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

const buildQuery = ({
  search,
  email,
  companyId,
  currency,
  status,
  startDate,
  endDate,
  page,
  limit,
  exportData,
}) => ({
  ...(search ? { search } : {}),
  ...(email ? { email } : {}),
  ...(companyId ? { companyId } : {}),
  ...(currency && currency !== "all" ? { currency } : {}),
  ...(status && status !== "all" ? { status } : {}),
  ...(startDate ? { startDate } : {}),
  ...(endDate ? { endDate } : {}),
  ...(page ? { page } : {}),
  ...(limit ? { limit } : {}),
  ...(exportData ? { export: true } : {}),
});

const fetchPayments = async (params) => {
  const response = await erpApi.get("/admin/manual-order-shipping-wallet/payments", {
    params: buildQuery(params),
  });
  const payload = response.data || {};
  const rows = extractRows(payload).map(normalizePayment);

  return {
    rows,
    summary: extractSummary(payload),
    pagination: extractPagination(payload, params, rows.length),
  };
};

const fetchExportPayments = async (params) => {
  const response = await erpApi.get("/admin/manual-order-shipping-wallet/payments", {
    params: buildQuery({ ...params, exportData: true }),
  });

  return extractRows(response.data || {}).map(normalizePayment);
};

const exportPaymentsToExcel = async (rows) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Shipping Wallet Payments");

  worksheet.columns = [
    { header: "Date", key: "date", width: 24 },
    { header: "Ledger ID", key: "ledgerId", width: 24 },
    { header: "Company ID", key: "companyId", width: 18 },
    { header: "Company", key: "companyName", width: 28 },
    { header: "Company Email", key: "companyEmail", width: 34 },
    { header: "Owner Name", key: "ownerName", width: 24 },
    { header: "Owner Email", key: "ownerEmail", width: 34 },
    { header: "Customer Name", key: "customerName", width: 24 },
    { header: "Customer Email", key: "customerEmail", width: 34 },
    { header: "Paid Amount", key: "paidAmount", width: 16 },
    { header: "Paid Currency", key: "paidCurrency", width: 14 },
    { header: "Gross MYR", key: "grossMyrAmount", width: 16 },
    { header: "Credited MYR", key: "creditedMyrAmount", width: 16 },
    { header: "Fee/Reserve MYR", key: "feeOrReserveMyr", width: 18 },
    { header: "Wallet Balance MYR", key: "walletBalanceMyr", width: 20 },
    { header: "Status", key: "status", width: 14 },
    { header: "Provider", key: "provider", width: 16 },
    { header: "Stripe Session ID", key: "stripeSessionId", width: 34 },
    { header: "Stripe Payment Intent ID", key: "stripePaymentIntentId", width: 34 },
    { header: "Created At", key: "createdAt", width: 24 },
  ];

  worksheet.insertRow(1, ["Manual Order Shipping Wallet Payments"]);
  worksheet.mergeCells("A1:T1");
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
  });

  rows.forEach((row) => {
    worksheet.addRow({
      ...row,
      date: formatDateTime(row.paidAt || row.createdAt),
      createdAt: formatDateTime(row.createdAt),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `shipping-wallet-payments-${new Date().toISOString().split("T")[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const SummaryCard = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-[#004368]">{value}</p>
  </div>
);

const ManualOrderShippingWalletPayments = () => {
  const [filters, setFilters] = useState({
    search: "",
    email: "",
    companyId: "",
    currency: "all",
    status: "all",
    startDate: "",
    endDate: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [pagination, setPagination] = useState(emptyPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [erpSessionConnected, setErpSessionConnected] = useState(hasErpSession());
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(filters.search.trim());
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
      email: filters.email.trim(),
      companyId: filters.companyId.trim(),
    }),
    [debouncedSearch, filters],
  );

  const loadPayments = useCallback(async () => {
    if (!hasErpSession()) {
      setErpSessionConnected(false);
      setRows([]);
      setSummary(emptySummary);
      setPagination(emptyPagination);
      return;
    }

    setErpSessionConnected(true);
    setPermissionDenied(false);
    setLoading(true);
    setError("");

    try {
      const result = await fetchPayments({
        ...queryFilters,
        page: currentPage,
        limit,
      });

      setRows(result.rows);
      setSummary(result.summary);
      setPagination(result.pagination);
    } catch (err) {
      console.error("Error fetching shipping wallet payments:", err);
      setRows([]);
      setSummary(emptySummary);
      setPagination(emptyPagination);

      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setPermissionDenied(true);
      } else if (err?.response?.status === 404) {
        setError(
          "Shipping wallet payments API is not available yet. Backend needs GET /api/v1/admin/manual-order-shipping-wallet/payments.",
        );
      } else {
        setError("Failed to load shipping wallet payments. Please check ERP API access.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, queryFilters]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const totalPages = useMemo(() => {
    const total = Number(pagination?.total || 0);
    const pageLimit = Number(pagination?.limit || limit);
    return Math.max(1, Number(pagination?.totalPages || Math.ceil(total / pageLimit)));
  }, [limit, pagination]);

  const handleExport = async () => {
    if (!hasErpSession()) {
      setErpSessionConnected(false);
      return;
    }

    setExportLoading(true);

    try {
      const exportRows = await fetchExportPayments(queryFilters);
      if (exportRows.length === 0) {
        alert("No shipping wallet payment data available to export");
        return;
      }

      await exportPaymentsToExcel(exportRows);
    } catch (err) {
      console.error("Export shipping wallet payments error:", err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setPermissionDenied(true);
      } else {
        alert("Failed to export shipping wallet payments");
      }
    } finally {
      setExportLoading(false);
    }
  };

  if (permissionDenied) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center shadow">
          <h1 className="text-xl font-bold text-red-700">{PERMISSION_MESSAGE}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto mb-20 max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Manual Order Shipping Wallet Payments
          </h1>
          <p className="text-gray-600">
            Read-only payment history for manual order shipping wallet top-ups.
          </p>
        </div>

        {!erpSessionConnected ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-12 text-center shadow">
            <h3 className="mb-2 text-lg font-semibold text-amber-800">
              ERP session required
            </h3>
            <p className="mx-auto max-w-2xl text-sm text-amber-700">
              Please login again with an ERP admin email.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <SummaryCard label="Total top-ups" value={summary.totalTopUps || 0} />
              <SummaryCard
                label="Total credited MYR"
                value={formatAmount(summary.totalCreditedMyr)}
              />
              <SummaryCard label="Total gross MYR" value={formatAmount(summary.totalGrossMyr)} />
              <SummaryCard
                label="Total fee/reserve MYR"
                value={formatAmount(summary.totalFeeOrReserveMyr)}
              />
              <SummaryCard
                label="Currency breakdown"
                value={formatBreakdown(summary.originalCurrencyBreakdown)}
              />
            </div>

            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow">
              <div className="grid gap-4 xl:grid-cols-4">
                <div className="xl:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(event) => updateFilter("search", event.target.value)}
                    placeholder="Search company, email/name, Stripe ID, provider, ledger ID"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email alias
                  </label>
                  <input
                    type="text"
                    value={filters.email}
                    onChange={(event) => updateFilter("email", event.target.value)}
                    placeholder="Owner or customer email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Company ID
                  </label>
                  <input
                    type="text"
                    value={filters.companyId}
                    onChange={(event) => updateFilter("companyId", event.target.value)}
                    placeholder="Company ID"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Currency
                  </label>
                  <select
                    value={filters.currency}
                    onChange={(event) => updateFilter("currency", event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">All</option>
                    <option value="MYR">MYR</option>
                    <option value="USD">USD</option>
                    <option value="SGD">SGD</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(event) => updateFilter("status", event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">All</option>
                    <option value="paid">Paid</option>
                    <option value="succeeded">Succeeded</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(event) => updateFilter("startDate", event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    End date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(event) => updateFilter("endDate", event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Limit
                  </label>
                  <select
                    value={limit}
                    onChange={(event) => {
                      setLimit(Number(event.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#004368] focus:ring-2 focus:ring-blue-100"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={exportLoading}
                    className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    {exportLoading ? "Exporting..." : "Export Excel"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-5 shadow">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Shipping Wallet Payment History
                </h2>
                <p className="text-sm text-gray-600">
                  Total payments: {pagination?.total || 0}
                </p>
              </div>
              <button
                type="button"
                onClick={loadPayments}
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
                  No shipping wallet payments found.
                </h3>
                <p className="text-gray-500">Try another filter or date range.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow">
                  <table className="min-w-[1750px] text-left text-sm">
                    <thead className="border-b bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Company</th>
                        <th className="px-4 py-3">Owner email</th>
                        <th className="px-4 py-3">Customer/payer email</th>
                        <th className="px-4 py-3">Paid amount</th>
                        <th className="px-4 py-3">Credited MYR</th>
                        <th className="px-4 py-3">Fee/reserve MYR</th>
                        <th className="px-4 py-3">Wallet balance after payment</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Stripe session/payment intent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rows.map((row) => (
                        <tr key={`${row.ledgerId}-${row.stripeSessionId}`} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-600">
                            {formatDateTime(row.paidAt || row.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-800">
                              {formatValue(row.companyName)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatValue(row.companyEmail)}
                            </p>
                            <p className="text-xs text-slate-500">
                              Company ID: {formatValue(row.companyId)}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            <p>{formatValue(row.ownerEmail)}</p>
                            <p className="text-xs text-slate-500">{formatValue(row.ownerName)}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            <p>{formatValue(row.customerEmail)}</p>
                            <p className="text-xs text-slate-500">
                              {formatValue(row.customerName)}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            {formatAmount(row.paidAmount, row.paidCurrency)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-emerald-700">
                            {formatAmount(row.creditedMyrAmount)}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {formatAmount(row.feeOrReserveMyr)}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {formatAmount(row.walletBalanceMyr)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            <p className="font-medium">{formatValue(row.provider)}</p>
                            <p className="max-w-[320px] truncate text-xs">
                              Session: {formatValue(row.stripeSessionId)}
                            </p>
                            <p className="max-w-[320px] truncate text-xs">
                              PI: {formatValue(row.stripePaymentIntentId)}
                            </p>
                            <p className="text-xs text-slate-500">
                              Ledger: {formatValue(row.ledgerId)}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManualOrderShippingWalletPayments;
