import React, { useCallback, useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { ChevronDown, ChevronRight } from "lucide-react";
import erpApi, { hasErpSession } from "@/lib/erpApi";
import PlatformToggle from "../Online Print/OnlinePrintComponent/PlatformToggle";
import LoadingSpinner from "../Online Print/OnlinePrintComponent/LoadingSpinner";

const ITEMS_PER_PAGE = 20;

const platformLabels = {
  tiktok: "TikTok",
  shopee: "Shopee",
};

const emptyPagination = {
  page: 1,
  limit: ITEMS_PER_PAGE,
  total: 0,
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const uniqueList = (items) =>
  [...new Set(items.filter((item) => item !== null && item !== undefined && item !== ""))];

const getStoreName = (store) =>
  store?.storeName || store?.store_name || store?.externalStoreName || store?.external_store_name || "-";

const getStoreId = (store) =>
  store?.externalStoreId ||
  store?.external_store_id ||
  store?.storeShopId ||
  store?.store_shop_id ||
  store?.id ||
  "-";

const getStoreCountry = (store) =>
  store?.country || store?.region || store?.marketplaceCountry || store?.marketplace_country || "-";

const getStoreCreatedAt = (store) => store?.createdAt || store?.created_at;

const getSubscriptionStatus = (store) =>
  store?.subscriptionStatus || store?.subscription_status || store?.subscription?.status || "-";

const getExpiresAt = (store) =>
  store?.expiresAt || store?.expires_at || store?.subscription?.expiresAt || store?.subscription?.expires_at;

const getRemainingDays = (store) => {
  const value =
    store?.remainingDays ??
    store?.remaining_days ??
    store?.subscription?.remainingDays ??
    store?.subscription?.remaining_days;
  return value === null || value === undefined || value === "" ? "-" : value;
};

const normalizeRow = (row) => {
  const stores = Array.isArray(row?.stores) ? row.stores : [];
  return {
    ...row,
    companyId: row?.companyId ?? row?.company_id ?? "-",
    companyName: row?.companyName ?? row?.company_name ?? "-",
    userId: row?.userId ?? row?.user_id ?? "-",
    email: row?.email ?? row?.userEmail ?? row?.user_email ?? "-",
    name: row?.name ?? row?.userName ?? row?.user_name ?? "-",
    platform: row?.platform || "-",
    storeCount: row?.storeCount ?? row?.store_count ?? stores.length,
    stores,
  };
};

const joinStoreValues = (stores, getter) => uniqueList(stores.map(getter)).join(", ") || "-";

const getStatusClasses = (status) => {
  const value = String(status || "").toLowerCase();
  if (value.includes("active") && !value.includes("inactive")) {
    return "bg-emerald-100 text-emerald-700";
  }
  if (value.includes("expired") || value.includes("cancel")) {
    return "bg-red-100 text-red-700";
  }
  if (value.includes("trial") || value.includes("soon") || value.includes("pending")) {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-gray-100 text-gray-700";
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
      status,
    )}`}
  >
    {formatValue(status)}
  </span>
);

const CompactList = ({ items, limit = 3 }) => {
  const values = uniqueList(items);
  if (values.length === 0) return <span>-</span>;

  return (
    <span>
      {values.slice(0, limit).join(", ")}
      {values.length > limit && (
        <span className="ml-1 font-semibold text-[#004368]">+ {values.length - limit} more</span>
      )}
    </span>
  );
};

const buildQuery = ({ platform, search, startDate, endDate, page, limit, exportData }) => ({
  platform,
  page,
  limit,
  includeDeleted: false,
  ...(search ? { search } : {}),
  ...(startDate ? { startDate } : {}),
  ...(endDate ? { endDate } : {}),
  ...(exportData ? { export: true } : {}),
});

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.rows)) return payload.data.rows;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const extractPagination = (payload, params, dataLength) =>
  payload?.pagination ||
  payload?.data?.pagination || {
    ...emptyPagination,
    page: params.page,
    limit: params.limit,
    total: dataLength,
  };

const fetchPlatformStoreUsers = async (params) => {
  const response = await erpApi.get("/admin/platform-store-users", {
    params: buildQuery(params),
  });

  const payload = response.data || {};
  const data = extractRows(payload);

  return {
    data: data.map(normalizeRow),
    pagination: extractPagination(payload, params, data.length),
  };
};

const fetchAllPlatformStoreUsers = async ({ platform, search, startDate, endDate }) => {
  const limit = 100;
  let page = 1;
  let allRows = [];
  let total = 0;
  let totalPages = 1;

  do {
    const result = await fetchPlatformStoreUsers({
      platform,
      search,
      startDate,
      endDate,
      page,
      limit,
    });

    allRows = [...allRows, ...result.data];
    total = Number(result.pagination?.total || allRows.length);
    totalPages = Math.max(1, Math.ceil(total / limit));
    page += 1;
  } while (page <= totalPages);

  return allRows;
};

const fetchExportPlatformStoreUsers = async ({ platform, search, startDate, endDate }) => {
  const response = await erpApi.get("/admin/platform-store-users", {
    params: buildQuery({
      platform,
      search,
      startDate,
      endDate,
      exportData: true,
    }),
  });

  return extractRows(response.data || {}).map(normalizeRow);
};

const exportRowsToExcel = async (rows, platform, filePrefix, dateText) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${platformLabels[platform]} Store Users`);

  worksheet.columns = [
    { header: "User Email", key: "email", width: 34 },
    { header: "Company Name", key: "companyName", width: 28 },
    { header: "Platform", key: "platform", width: 14 },
    { header: "Total Stores", key: "storeCount", width: 14 },
    { header: "Store Names", key: "storeNames", width: 44 },
    { header: "Countries/Regions", key: "countries", width: 22 },
    { header: "Store Created Date", key: "createdDate", width: 28 },
    { header: "Subscription Status", key: "subscriptionStatus", width: 24 },
    { header: "Subscription Expiry Date", key: "expiresAt", width: 28 },
    { header: "Remaining Days", key: "remainingDays", width: 18 },
  ];

  worksheet.insertRow(1, [`${platformLabels[platform]} ERP Store Users`]);
  worksheet.mergeCells("A1:J1");
  worksheet.getRow(1).height = 28;
  worksheet.getRow(1).getCell(1).font = { bold: true, size: 16 };
  worksheet.getRow(1).getCell(1).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  const headerRow = worksheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: platform === "tiktok" ? "FF004368" : "FFEA580C" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  rows.forEach((row) => {
    worksheet.addRow({
      email: row.email,
      companyName: row.companyName,
      platform: platformLabels[row.platform] || row.platform,
      storeCount: row.storeCount,
      storeNames: joinStoreValues(row.stores, getStoreName),
      countries: joinStoreValues(row.stores, getStoreCountry),
      createdDate: joinStoreValues(row.stores, (store) => formatDate(getStoreCreatedAt(store))),
      subscriptionStatus: joinStoreValues(row.stores, getSubscriptionStatus),
      expiresAt: joinStoreValues(row.stores, (store) => formatDate(getExpiresAt(store))),
      remainingDays: joinStoreValues(row.stores, getRemainingDays),
    });
  });

  worksheet.addRow([]);
  worksheet.addRow(["Total Companies", rows.length]);
  worksheet.addRow(["Platform", platformLabels[platform]]);
  if (dateText) worksheet.addRow(["Date Range", dateText]);

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
    });
  });

  const today = new Date().toISOString().slice(0, 10);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filePrefix}-${today}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const StoreDetails = ({ stores }) => (
  <div className="bg-slate-50 px-4 py-4">
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-xs">
        <thead className="bg-slate-100 text-left text-slate-600">
          <tr>
            <th className="px-3 py-2">Store name</th>
            <th className="px-3 py-2">Country/region</th>
            <th className="px-3 py-2">Created date</th>
            <th className="px-3 py-2">Subscription</th>
            <th className="px-3 py-2">Expiry</th>
            <th className="px-3 py-2">Remaining days</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {stores.map((store, index) => (
            <tr key={`${getStoreName(store)}-${index}`}>
              <td className="px-3 py-2 font-medium text-slate-800">{getStoreName(store)}</td>
              <td className="px-3 py-2 text-slate-600">{getStoreCountry(store)}</td>
              <td className="px-3 py-2 text-slate-600">{formatDate(getStoreCreatedAt(store))}</td>
              <td className="px-3 py-2">
                <StatusBadge status={getSubscriptionStatus(store)} />
              </td>
              <td className="px-3 py-2 text-slate-600">{formatDate(getExpiresAt(store))}</td>
              <td className="px-3 py-2 text-slate-600">{getRemainingDays(store)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const StoreUserRow = ({ row, serialNumber, expanded, onToggle }) => {
  const storeNames = row.stores.map(getStoreName);
  const countries = row.stores.map(getStoreCountry);
  const createdDates = row.stores.map((store) => formatDate(getStoreCreatedAt(store)));
  const subscriptionStatuses = row.stores.map(getSubscriptionStatus);
  const expiresAt = row.stores.map((store) => formatDate(getExpiresAt(store)));
  const remainingDays = row.stores.map(getRemainingDays);

  return (
    <>
      <tr className="align-top hover:bg-slate-50">
        <td className="w-16 px-3 py-3">
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center gap-1 rounded px-1 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-[#004368]"
              aria-label={expanded ? "Collapse store list" : "Expand store list"}
            >
              <span>{serialNumber}</span>
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-[#004368]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#004368]" />
              )}
            </button>
        </td>
        <td className="px-4 py-3 font-medium text-slate-800">{formatValue(row.email)}</td>
        <td className="px-4 py-3 font-medium text-slate-800">{formatValue(row.companyName)}</td>
        <td className="px-4 py-3">
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-[#004368]">
            {platformLabels[row.platform] || row.platform}
          </span>
        </td>
        <td className="px-4 py-3 text-center font-semibold text-slate-800">{row.storeCount}</td>
        <td className="px-4 py-3 text-slate-600">
          <CompactList items={storeNames} />
        </td>
        <td className="px-4 py-3 text-slate-600">
          <CompactList items={countries} />
        </td>
        <td className="px-4 py-3 text-slate-600">
          <CompactList items={createdDates} />
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1.5">
            {uniqueList(subscriptionStatuses).map((status) => (
              <StatusBadge key={status} status={status} />
            ))}
          </div>
        </td>
        <td className="px-4 py-3 text-slate-600">
          <CompactList items={expiresAt} />
        </td>
        <td className="px-4 py-3 text-slate-600">
          <CompactList items={remainingDays} />
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={11} className="p-0">
            <StoreDetails stores={row.stores} />
          </td>
        </tr>
      )}
    </>
  );
};

const PlatformStoreManagement = () => {
  const [activePlatform, setActivePlatform] = useState("tiktok");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [exportLoading, setExportLoading] = useState("");
  const [erpSessionConnected, setErpSessionConnected] = useState(hasErpSession());

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
      setPagination(emptyPagination);
      setError("");
      return;
    }

    setErpSessionConnected(true);
    setLoading(true);
    setError("");

    try {
      const result = await fetchPlatformStoreUsers({
        platform: activePlatform,
        search: debouncedSearch,
        startDate,
        endDate,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      setRows(result.data);
      setPagination(result.pagination);
      setExpandedRows({});
    } catch (err) {
      console.error("Error fetching ERP store users:", err);
      if (err?.response?.status === 401) {
        setErpSessionConnected(false);
      }
      setRows([]);
      setPagination(emptyPagination);
      setError("Failed to load ERP store users. Please check ERP API access.");
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
    return Math.max(1, Math.ceil(total / limit));
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

    const includeSearch = type === "current";
    const includeDate = type === "current" || type === "datewise";
    const params = {
      platform: activePlatform,
      search: includeSearch ? debouncedSearch : "",
      startDate: includeDate ? startDate : "",
      endDate: includeDate ? endDate : "",
    };

    try {
      const exportRows = await fetchExportPlatformStoreUsers(params);
      if (exportRows.length > 0) return exportRows;
    } catch (error) {
      console.error("ERP export API request failed:", error);
    }

    return fetchAllPlatformStoreUsers(params);
  };

  const handleExport = async (type) => {
    if (type === "datewise" && (!startDate || !endDate)) {
      alert("Please select both start and end dates");
      return;
    }

    setExportLoading(type);
    try {
      const exportRows = await getExportRows(type);
      const label = activePlatform;
      const dateText = startDate || endDate ? `${startDate || "Start"} to ${endDate || "End"}` : "";
      const filePrefix =
        type === "datewise"
          ? `${label}-store-users-date-wise`
          : `${label}-store-users`;

      if (exportRows.length === 0) {
        alert("No data available to export");
        return;
      }

      await exportRowsToExcel(exportRows, activePlatform, filePrefix, dateText);
    } catch (err) {
      console.error("Export ERP store users error:", err);
      alert("Failed to export data");
    } finally {
      setExportLoading("");
    }
  };

  const toggleRow = (rowKey) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto mb-20 max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Platform Store Management / ERP Store Users
          </h1>
          <p className="text-gray-600">
            Monitor ERP companies and their connected marketplace stores.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex rounded-full bg-slate-200 p-1 shadow-inner">
            <PlatformToggle
              platform="tiktok"
              label="TikTok"
              isActive={activePlatform === "tiktok"}
              onClick={handlePlatformChange}
              loading={loading && activePlatform === "tiktok"}
            />
            <PlatformToggle
              platform="shopee"
              label="Shopee"
              isActive={activePlatform === "shopee"}
              onClick={handlePlatformChange}
              loading={loading && activePlatform === "shopee"}
            />
          </div>
        </div>

        {!erpSessionConnected ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-12 text-center shadow">
            <h3 className="mb-2 text-lg font-semibold text-amber-800">
              ERP session required
            </h3>
            <p className="mx-auto max-w-2xl text-sm text-amber-700">
              ERP admin session is not connected. Please login again with an
              ERP admin email that has owner or admin permission.
            </p>
          </div>
        ) : (
          <>

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
                placeholder="Search email, company, store name, or store ID"
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
                {exportLoading === "all" ? "Exporting..." : "Export All"}
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
              {platformLabels[activePlatform]} Store Users
            </h2>
            <p className="text-sm text-gray-600">
              Total companies/users: {pagination?.total || 0}
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
              No stores found for this platform.
            </h3>
            <p className="text-gray-500">
              Try another platform, search term, or date range.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow">
              <table className="min-w-[1400px] text-left text-sm">
                <thead className="border-b bg-gray-50 text-gray-600">
                  <tr>
                    <th className="w-16 px-3 py-3">Sr</th>
                    <th className="px-4 py-3">User email</th>
                    <th className="px-4 py-3">Company name</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Total stores</th>
                    <th className="px-4 py-3">Store names</th>
                    <th className="px-4 py-3">Countries/regions</th>
                    <th className="px-4 py-3">Store created date</th>
                    <th className="px-4 py-3">Subscription status</th>
                    <th className="px-4 py-3">Subscription expiry</th>
                    <th className="px-4 py-3">Remaining days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row, index) => {
                    const rowKey = `${row.companyId}-${row.userId}-${row.platform}`;
                    const serialNumber =
                      (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    return (
                      <StoreUserRow
                        key={rowKey}
                        row={row}
                        serialNumber={serialNumber}
                        expanded={Boolean(expandedRows[rowKey])}
                        onToggle={() => toggleRow(rowKey)}
                      />
                    );
                  })}
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

export default PlatformStoreManagement;
