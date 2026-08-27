import React, { useCallback, useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import toast from "react-hot-toast";
import { Download, Edit3, Eye, PackageCheck, RefreshCw, Save, X } from "lucide-react";
import erpApi, { hasErpSession } from "@/lib/erpApi";
import LoadingSpinner from "../Online Print/OnlinePrintComponent/LoadingSpinner";

const ITEMS_PER_PAGE = 20;

const STATUS_OPTIONS = [
  "all",
  "pending_address",
  "address_submitted",
  "processing",
  "shipped",
  "delivered",
  "received",
  "declined",
  "cancelled",
];

const ADMIN_STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"];

const SUMMARY_KEYS = [
  { key: "total", label: "Total Gifts" },
  { key: "pending_address", label: "Pending Address" },
  { key: "address_submitted", label: "Address Submitted" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "received", label: "Received" },
  { key: "cancelledGroup", label: "Declined / Cancelled" },
];

const emptySummary = {
  total: 0,
  pending_address: 0,
  address_submitted: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
  received: 0,
  declined: 0,
  cancelled: 0,
};

const emptyPagination = {
  page: 1,
  limit: ITEMS_PER_PAGE,
  total: 0,
  totalPages: 1,
};

const formatStatusLabel = (status) =>
  String(status || "-")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const toLocalDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return startDate <= endDate;
};

const isGiftInDateRange = (gift, startDate, endDate) => {
  const createdDate = toLocalDateInputValue(gift.createdAt);
  if (!createdDate) return true;
  if (startDate && createdDate < startDate) return false;
  if (endDate && createdDate > endDate) return false;
  return true;
};

const applyClientFilters = (rows, params) =>
  rows.filter((gift) => isGiftInDateRange(gift, params.startDate, params.endDate));

const buildSummaryFromRows = (rows) =>
  rows.reduce(
    (nextSummary, gift) => {
      const giftStatus = String(gift.status || "").toLowerCase();
      nextSummary.total += 1;
      if (Object.prototype.hasOwnProperty.call(nextSummary, giftStatus)) {
        nextSummary[giftStatus] += 1;
      }
      return nextSummary;
    },
    { ...emptySummary },
  );

const formatAmount = (amount) => {
  const number = Number(amount);
  if (Number.isNaN(number)) return formatValue(amount);
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const getStatusClasses = (status) => {
  const value = String(status || "").toLowerCase();
  if (value === "pending_address") return "bg-amber-100 text-amber-700";
  if (value === "address_submitted") return "bg-blue-100 text-blue-700";
  if (value === "processing") return "bg-purple-100 text-purple-700";
  if (value === "shipped") return "bg-indigo-100 text-indigo-700";
  if (value === "delivered") return "bg-green-100 text-green-700";
  if (value === "received") return "bg-emerald-100 text-emerald-700";
  if (value === "cancelled") return "bg-red-100 text-red-700";
  if (value === "declined") return "bg-gray-200 text-gray-700";
  return "bg-gray-100 text-gray-700";
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
      status,
    )}`}
  >
    {formatStatusLabel(status)}
  </span>
);

const normalizeGift = (row) => ({
  id: row?.id ?? row?.giftId ?? row?.gift_id ?? "-",
  status: row?.status ?? "-",
  ownerUserId: row?.ownerUserId ?? row?.owner_user_id ?? row?.owner?.userId ?? "-",
  ownerEmail: row?.ownerEmail ?? row?.owner_email ?? row?.owner?.email ?? "-",
  ownerName: row?.ownerName ?? row?.owner_name ?? row?.owner?.name ?? "-",
  ownerCompanyId: row?.ownerCompanyId ?? row?.owner_company_id ?? row?.owner?.companyId ?? "-",
  ownerCompanyName:
    row?.ownerCompanyName ?? row?.owner_company_name ?? row?.owner?.companyName ?? "-",
  couponCode: row?.couponCode ?? row?.coupon_code ?? row?.coupon?.code ?? "-",
  redemptionId: row?.redemptionId ?? row?.redemption_id ?? row?.redemption?.id ?? "-",
  redeemedByEmail:
    row?.redeemedByEmail ??
    row?.redeemed_by_email ??
    row?.redemption?.redeemedByEmail ??
    row?.redemption?.redeemed_by_email ??
    "-",
  sourcePaymentId:
    row?.sourcePaymentId ?? row?.source_payment_id ?? row?.sourcePayment?.id ?? "-",
  sourcePaymentUid:
    row?.sourcePaymentUid ??
    row?.source_payment_uid ??
    row?.sourcePayment?.paymentUid ??
    row?.sourcePayment?.payment_uid ??
    "-",
  sourcePlanName:
    row?.sourcePlanName ?? row?.source_plan_name ?? row?.sourcePayment?.planName ?? "-",
  sourceAmount: row?.sourceAmount ?? row?.source_amount ?? row?.sourcePayment?.amount ?? "-",
  sourceCurrency:
    row?.sourceCurrency ?? row?.source_currency ?? row?.sourcePayment?.currency ?? "-",
  recipientName:
    row?.recipientName ?? row?.recipient_name ?? row?.delivery?.recipientName ?? "-",
  recipientPhone:
    row?.recipientPhone ?? row?.recipient_phone ?? row?.delivery?.recipientPhone ?? "-",
  address: row?.address ?? row?.deliveryAddress ?? row?.delivery_address ?? row?.delivery?.address ?? "-",
  city: row?.city ?? row?.delivery?.city ?? "-",
  country: row?.country ?? row?.delivery?.country ?? "-",
  zipCode: row?.zipCode ?? row?.zip_code ?? row?.delivery?.zipCode ?? row?.delivery?.zip_code ?? "-",
  trackingNumber:
    row?.trackingNumber ?? row?.tracking_number ?? row?.delivery?.trackingNumber ?? "-",
  modalSeenAt: row?.modalSeenAt ?? row?.modal_seen_at ?? null,
  createdAt: row?.createdAt ?? row?.created_at ?? null,
  updatedAt: row?.updatedAt ?? row?.updated_at ?? null,
  history: Array.isArray(row?.history) ? row.history : [],
  raw: row,
});

const normalizeDetail = (payload) => normalizeGift(payload?.data?.data || payload?.data || payload);

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.rows)) return payload.data.rows;
  if (Array.isArray(payload?.data?.data?.rows)) return payload.data.data.rows;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

const extractSummary = (payload) => ({
  ...emptySummary,
  ...(payload?.data?.summary || payload?.data?.data?.summary || payload?.summary || {}),
});

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

const getErrorMessage = (error, fallback) => {
  const status = error?.response?.status;
  if (status === 401) return "ERP session required. Please login again.";
  if (status === 403) return "You do not have ERP admin permission.";
  if (status === 404) {
    return "Gift admin API is not available yet. Backend needs GET /api/v1/admin/gifts.";
  }
  return error?.response?.data?.message || error?.message || fallback;
};

const buildQuery = ({ status, search, startDate, endDate, country, page, limit, exportData }) => {
  const query = {
    status,
    page,
    limit,
    ...(search ? { search } : {}),
    ...(country ? { country } : {}),
    ...(exportData ? { export: true } : {}),
  };

  if (startDate) {
    query.startDate = startDate;
    query.start_date = startDate;
  }

  if (endDate) {
    query.endDate = endDate;
    query.end_date = endDate;
  }

  return query;
};

const fetchGifts = async (params) => {
  const response = await erpApi.get("/admin/gifts", {
    params: buildQuery(params),
  });
  const payload = response.data || {};
  const rows = applyClientFilters(extractRows(payload).map(normalizeGift), params);
  const shouldUseClientSummary = Boolean(params.startDate || params.endDate);

  return {
    rows,
    summary: shouldUseClientSummary ? buildSummaryFromRows(rows) : extractSummary(payload),
    pagination: {
      ...extractPagination(payload, params, rows.length),
      ...(shouldUseClientSummary ? { total: rows.length, totalPages: 1 } : {}),
    },
  };
};

const fetchExportGifts = async (params) => {
  const response = await erpApi.get("/admin/gifts", {
    params: buildQuery({ ...params, exportData: true }),
  });
  return applyClientFilters(extractRows(response.data || {}).map(normalizeGift), params);
};

const getTodayString = () => new Date().toISOString().slice(0, 10);

const buildExportFileName = ({ status, startDate, endDate }) => {
  if (startDate && endDate) {
    return `gift-management-${startDate}-to-${endDate}.xlsx`;
  }
  const statusPart = status && status !== "all" ? status : "all";
  return `gift-management-${statusPart}-${getTodayString()}.xlsx`;
};

const exportGiftsToExcel = async (rows, filters) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Gift Management");

  worksheet.columns = [
    { header: "Sr", key: "serialNumber", width: 10 },
    { header: "Owner Email", key: "ownerEmail", width: 32 },
    { header: "Owner Company", key: "ownerCompanyName", width: 24 },
    { header: "Coupon Code", key: "couponCode", width: 16 },
    { header: "Status", key: "status", width: 18 },
    { header: "Recipient Name", key: "recipientName", width: 24 },
    { header: "Phone", key: "recipientPhone", width: 18 },
    { header: "Address", key: "address", width: 38 },
    { header: "City", key: "city", width: 18 },
    { header: "Country", key: "country", width: 18 },
    { header: "Zip Code", key: "zipCode", width: 14 },
    { header: "Tracking Number", key: "trackingNumber", width: 24 },
    { header: "Created At", key: "createdAt", width: 22 },
    { header: "Modal Seen At", key: "modalSeenAt", width: 22 },
  ];

  rows.forEach((row, index) => {
    worksheet.addRow({
      ...row,
      serialNumber: index + 1,
      status: formatStatusLabel(row.status),
      createdAt: formatDate(row.createdAt),
      modalSeenAt: formatDate(row.modalSeenAt),
    });
  });

  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = buildExportFileName(filters);
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};

const SummaryCard = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm">
    <div className="text-sm font-semibold text-gray-500">{label}</div>
    <div className="mt-2 text-2xl font-bold text-gray-900">{value || 0}</div>
  </div>
);

const DetailLine = ({ label, value }) => (
  <div>
    <div className="text-xs font-semibold uppercase text-gray-500">{label}</div>
    <div className="mt-1 break-words text-sm text-gray-900">{formatValue(value)}</div>
  </div>
);

const GiftManagement = () => {
  const [gifts, setGifts] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [pagination, setPagination] = useState(emptyPagination);
  const [status, setStatus] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [erpConnected, setErpConnected] = useState(hasErpSession());
  const [detailGift, setDetailGift] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: "processing",
    trackingNumber: "",
    note: "",
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const queryParams = useMemo(
    () => ({
      status,
      search,
      startDate,
      endDate,
      country: country.trim(),
      page,
      limit: ITEMS_PER_PAGE,
    }),
    [country, endDate, page, search, startDate, status],
  );

  const dateRangeError = useMemo(() => {
    if (!isValidDateRange(startDate, endDate)) {
      return "Start date cannot be after end date.";
    }
    return "";
  }, [endDate, startDate]);

  const loadGifts = useCallback(async () => {
    if (!hasErpSession()) {
      setErpConnected(false);
      setError("ERP session required. Please login again.");
      setLoading(false);
      return;
    }

    if (dateRangeError) {
      setError(dateRangeError);
      setLoading(false);
      return;
    }

    setErpConnected(true);
    setLoading(true);
    setError("");

    try {
      const result = await fetchGifts(queryParams);
      setGifts(result.rows);
      setSummary(result.summary);
      setPagination(result.pagination);
    } catch (fetchError) {
      const message = getErrorMessage(fetchError, "Failed to load gifts.");
      setError(message);
      setGifts([]);
      setSummary(emptySummary);
      setPagination(emptyPagination);
      if (fetchError?.response?.status === 401) setErpConnected(false);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [dateRangeError, queryParams]);

  useEffect(() => {
    loadGifts();
  }, [loadGifts]);

  const openDetail = async (gift) => {
    setDetailGift(gift);
    setDetailLoading(true);

    try {
      const response = await erpApi.get(`/admin/gifts/${gift.id}`);
      setDetailGift(normalizeDetail(response.data || {}));
    } catch (detailError) {
      toast.error(getErrorMessage(detailError, "Failed to load gift details."));
    } finally {
      setDetailLoading(false);
    }
  };

  const openStatusModal = (gift, preferTracking = false) => {
    const currentStatus = ADMIN_STATUS_OPTIONS.includes(gift.status) ? gift.status : "processing";
    setStatusTarget(gift);
    setStatusForm({
      status: preferTracking ? "shipped" : currentStatus,
      trackingNumber: gift.trackingNumber === "-" ? "" : gift.trackingNumber || "",
      note: "",
    });
  };

  const updateGiftStatus = async (event) => {
    event.preventDefault();
    if (!statusTarget) return;

    setSaving(true);
    try {
      await erpApi.patch(`/admin/gifts/${statusTarget.id}/status`, {
        status: statusForm.status,
        trackingNumber: statusForm.trackingNumber.trim() || null,
        note: statusForm.note.trim() || undefined,
      });
      toast.success("Gift status updated successfully.");
      setStatusTarget(null);
      await loadGifts();
    } catch (updateError) {
      toast.error(getErrorMessage(updateError, "Failed to update gift status."));
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    if (dateRangeError) {
      toast.error(dateRangeError);
      return;
    }

    setExporting(true);
    try {
      const rows = await fetchExportGifts({
        ...queryParams,
        page: 1,
        limit: ITEMS_PER_PAGE,
      });
      await exportGiftsToExcel(rows, { status, startDate, endDate });
      toast.success("Gift export downloaded.");
    } catch (exportError) {
      toast.error(getErrorMessage(exportError, "Failed to export gifts."));
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.max(1, pagination.totalPages || Math.ceil((pagination.total || 0) / ITEMS_PER_PAGE));
  const summaryWithGroup = {
    ...summary,
    cancelledGroup: Number(summary.declined || 0) + Number(summary.cancelled || 0),
  };

  const clearDateRange = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  if (!erpConnected) {
    return (
      <div className="min-h-[420px] bg-[#f7f9fb] p-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-800">
          ERP session required. Please login again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] p-4 text-left md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-900">Gift Management</h1>
          <p className="text-sm text-gray-500">
            Manage referral gift rewards, delivery details, and fulfillment status.
          </p>
        </div>
        <button
          type="button"
          onClick={loadGifts}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_KEYS.map((item) => (
          <SummaryCard key={item.key} label={item.label} value={summaryWithGroup[item.key]} />
        ))}
      </div>

      <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.8fr_auto_auto]">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Search</label>
            <input
              className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]"
              placeholder="Search gift, owner, coupon, payment, tracking, recipient"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Status</label>
            <select
              className="h-11 w-full rounded-md border border-gray-300 px-3 pr-10 text-sm outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {formatStatusLabel(option)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Start date</label>
            <input
              className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => {
                setStartDate(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">End date</label>
            <input
              className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => {
                setEndDate(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearDateRange}
              disabled={!startDate && !endDate}
              className="h-11 w-full rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Date
            </button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Country</label>
            <input
              className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]"
              placeholder="Country"
              value={country}
              onChange={(event) => {
                setCountry(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || loading || Boolean(dateRangeError)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Download size={16} />
              {exporting ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>
        {dateRangeError && (
          <div className="mt-3 text-sm font-semibold text-red-600">{dateRangeError}</div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white text-left shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-4">
          <div className="text-left">
            <h2 className="text-lg font-bold text-gray-900">Referral Gifts</h2>
            <p className="text-sm text-gray-500">Total gifts: {pagination.total || gifts.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1350px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-700">
                  <th className="px-4 py-3 font-semibold">Sr</th>
                  <th className="px-4 py-3 font-semibold">Owner Email</th>
                  <th className="px-4 py-3 font-semibold">Owner Company</th>
                  <th className="px-4 py-3 font-semibold">Coupon Code</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Recipient Name</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Address</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Country</th>
                  <th className="px-4 py-3 font-semibold">Zip Code</th>
                  <th className="px-4 py-3 font-semibold">Tracking Number</th>
                  <th className="px-4 py-3 font-semibold">Created At</th>
                  <th className="px-4 py-3 font-semibold">Modal Seen At</th>
                  <th className="sticky right-0 bg-gray-50 px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gifts.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-10 text-center text-gray-500">
                      No gifts found.
                    </td>
                  </tr>
                ) : (
                  gifts.map((gift, index) => (
                    <tr key={gift.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-semibold text-[#004368]">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-4 py-3">{formatValue(gift.ownerEmail)}</td>
                      <td className="px-4 py-3">{formatValue(gift.ownerCompanyName)}</td>
                      <td className="px-4 py-3">{formatValue(gift.couponCode)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={gift.status} />
                      </td>
                      <td className="px-4 py-3">{formatValue(gift.recipientName)}</td>
                      <td className="px-4 py-3">{formatValue(gift.recipientPhone)}</td>
                      <td className="max-w-[280px] px-4 py-3">{formatValue(gift.address)}</td>
                      <td className="px-4 py-3">{formatValue(gift.city)}</td>
                      <td className="px-4 py-3">{formatValue(gift.country)}</td>
                      <td className="px-4 py-3">{formatValue(gift.zipCode)}</td>
                      <td className="px-4 py-3">{formatValue(gift.trackingNumber)}</td>
                      <td className="px-4 py-3">{formatDate(gift.createdAt)}</td>
                      <td className="px-4 py-3">{formatDate(gift.modalSeenAt)}</td>
                      <td className="sticky right-0 bg-white px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openDetail(gift)}
                            className="inline-flex h-9 items-center gap-1 rounded-md border border-gray-300 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => openStatusModal(gift)}
                            className="inline-flex h-9 items-center gap-1 rounded-md border border-blue-200 px-3 text-xs font-semibold text-[#004368] hover:bg-blue-50"
                          >
                            <Edit3 size={14} />
                            Status
                          </button>
                          <button
                            type="button"
                            onClick={() => openStatusModal(gift, true)}
                            className="inline-flex h-9 items-center gap-1 rounded-md border border-indigo-200 px-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                          >
                            <PackageCheck size={14} />
                            Tracking
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t px-4 py-4 md:flex-row md:items-center md:justify-between">
          <span className="text-sm text-gray-600">
            Page {pagination.page || page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {detailGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Gift Details</h2>
                <p className="text-sm text-gray-500">Gift ID: {formatValue(detailGift.id)}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailGift(null)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            {detailLoading ? (
              <div className="flex min-h-[260px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-5 p-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <DetailLine label="Status" value={formatStatusLabel(detailGift.status)} />
                  <DetailLine label="Created At" value={formatDate(detailGift.createdAt)} />
                  <DetailLine label="Updated At" value={formatDate(detailGift.updatedAt)} />
                </div>

                <div className="grid gap-4 rounded-lg border border-gray-200 p-4 md:grid-cols-3">
                  <DetailLine label="Owner Email" value={detailGift.ownerEmail} />
                  <DetailLine label="Owner Name" value={detailGift.ownerName} />
                  <DetailLine label="Owner Company" value={detailGift.ownerCompanyName} />
                  <DetailLine label="Coupon Code" value={detailGift.couponCode} />
                  <DetailLine label="Redemption ID" value={detailGift.redemptionId} />
                  <DetailLine label="Redeemed By Email" value={detailGift.redeemedByEmail} />
                  <DetailLine label="Source Payment UID" value={detailGift.sourcePaymentUid} />
                  <DetailLine label="Source Plan" value={detailGift.sourcePlanName} />
                  <DetailLine label="Source Amount" value={formatAmount(detailGift.sourceAmount)} />
                  <DetailLine label="Source Currency" value={detailGift.sourceCurrency} />
                  <DetailLine label="Modal Seen At" value={formatDate(detailGift.modalSeenAt)} />
                </div>

                <div className="grid gap-4 rounded-lg border border-gray-200 p-4 md:grid-cols-3">
                  <DetailLine label="Recipient Name" value={detailGift.recipientName} />
                  <DetailLine label="Phone" value={detailGift.recipientPhone} />
                  <DetailLine label="Tracking Number" value={detailGift.trackingNumber} />
                  <DetailLine label="Address" value={detailGift.address} />
                  <DetailLine label="City" value={detailGift.city} />
                  <DetailLine label="Country" value={detailGift.country} />
                  <DetailLine label="Zip Code" value={detailGift.zipCode} />
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">Status History</h3>
                  {detailGift.history.length === 0 ? (
                    <p className="text-sm text-gray-500">No status history found.</p>
                  ) : (
                    <div className="space-y-3">
                      {detailGift.history.map((item, index) => (
                        <div key={`${item.status}-${item.createdAt}-${index}`} className="border-l-2 border-[#004368] pl-4">
                          <div className="font-semibold text-gray-900">{formatStatusLabel(item.status)}</div>
                          <div className="text-sm text-gray-600">{formatValue(item.note)}</div>
                          <div className="text-xs text-gray-500">{formatDate(item.createdAt || item.created_at)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={updateGiftStatus}
            className="w-full max-w-xl rounded-lg bg-white p-5 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Update Gift Status</h2>
                <p className="text-sm text-gray-500">Gift ID: {formatValue(statusTarget.id)}</p>
              </div>
              <button
                type="button"
                onClick={() => setStatusTarget(null)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">New status</label>
                <select
                  className="h-11 w-full rounded-md border border-gray-300 px-3 pr-10 text-sm outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]"
                  value={statusForm.status}
                  onChange={(event) =>
                    setStatusForm((current) => ({ ...current, status: event.target.value }))
                  }
                >
                  {ADMIN_STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {formatStatusLabel(option)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Tracking number
                </label>
                <input
                  className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]"
                  value={statusForm.trackingNumber}
                  onChange={(event) =>
                    setStatusForm((current) => ({ ...current, trackingNumber: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Admin note</label>
                <textarea
                  className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#004368] focus:ring-1 focus:ring-[#004368]"
                  value={statusForm.note}
                  onChange={(event) =>
                    setStatusForm((current) => ({ ...current, note: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStatusTarget(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-[#004368] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GiftManagement;
