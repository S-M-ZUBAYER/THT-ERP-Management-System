import React, { useCallback, useEffect, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { FAQ_DRAFT_BASE_URL, UNKNOWN_QUESTIONS_PAGE_LIMIT, exportQuestionsToExcel, getQuestionAnswer } from "./chatbotManagementUtils";
import { ConfirmActionModal, EmptyState, ErrorMessage, LoadingSpinner, PaginationControls } from "./SharedChatbotComponents";

const EXPORT_FETCH_LIMIT = 500;
const PAGE_SIZE_OPTIONS = [20, 50, 100, 120,200,300,500,1000];
const DATE_FILTER_PRESETS = {
  YESTERDAY: "yesterday",
  LAST_7_DAYS: "last7",
  LAST_30_DAYS: "last30",
  LAST_90_DAYS: "last90",
  CUSTOM: "custom",
};

const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDaysRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));

  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(end),
  };
};

const getLastSevenDaysRange = () => getDaysRange(7);

const getYesterdayRange = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = formatDateInput(yesterday);

  return {
    startDate: formattedYesterday,
    endDate: formattedYesterday,
  };
};

const getDateListInRange = (startDate, endDate) => {
  if (!startDate || !endDate || startDate > endDate) return [];

  const dates = [];
  const currentDate = new Date(`${startDate}T00:00:00`);
  const lastDate = new Date(`${endDate}T00:00:00`);

  while (currentDate <= lastDate) {
    dates.push(formatDateInput(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const getQuestionDate = (question) => {
  const value = question?.created_at || question?.createdAt || question?.created;

  return String(value || "").slice(0, 10);
};

const normalizeProductName = (product) =>
  String(product || "General").trim().toLowerCase();

const formatNumber = (value) => Number(value || 0).toLocaleString();

const getDayProductKey = (date, product) =>
  `${date || ""}__${normalizeProductName(product)}`;

const calculateAnsweredQuestions = (totalAsk, totalUnknown) => {
  const askCount = Number(totalAsk || 0);
  const unknownCount = Number(totalUnknown || 0);

  if (askCount <= 0) return 0;

  return Math.max(askCount - unknownCount, 0);
};

const isQuestionInDateRange = (question, startDate, endDate) => {
  const questionDate = getQuestionDate(question);

  if (!questionDate) return false;
  if (startDate && questionDate < startDate) return false;
  if (endDate && questionDate > endDate) return false;

  return true;
};

const buildPagination = (total, page, limit) => {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);

  return {
    total,
    page: safePage,
    limit,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };
};

const QuestionsListPanel = ({ allowDelete }) => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionStats, setQuestionStats] = useState(null);
  const [questionStatsLoading, setQuestionStatsLoading] = useState(false);
  const [questionStatsError, setQuestionStatsError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(UNKNOWN_QUESTIONS_PAGE_LIMIT);
  const [datePreset, setDatePreset] = useState(DATE_FILTER_PRESETS.LAST_7_DAYS);
  const [dateRange, setDateRange] = useState(getLastSevenDaysRange);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteFilters, setDeleteFilters] = useState({
    product: "",
    lang: "",
    days: "",
  });

  useEffect(() => {
    if (allQuestions.length > 0) {
      const uniqueProducts = [
        ...new Set(allQuestions.map((q) => q.product).filter(Boolean)),
      ];
      setProducts(uniqueProducts);
    } else {
      setProducts([]);
    }
  }, [allQuestions]);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const collectedQuestions = [];
      let pageToFetch = 1;
      let hasNextPage = true;

      while (hasNextPage && pageToFetch <= 200) {
        const response = await fetch(
          `${FAQ_DRAFT_BASE_URL}/tht/chatBot/unknown-questions-paginated?page=${pageToFetch}&limit=${EXPORT_FETCH_LIMIT}`,
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("API returned error");
        }

        collectedQuestions.push(...(data.data || []));
        hasNextPage = Boolean(data.hasNextPage);
        pageToFetch += 1;
      }

      const uniqueQuestions = Array.from(
        new Map(collectedQuestions.map((question) => [question.id, question])).values(),
      );

      setAllQuestions(uniqueQuestions);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const fetchQuestionStats = useCallback(async () => {
    try {
      setQuestionStatsLoading(true);
      setQuestionStatsError(null);

      const dates = getDateListInRange(dateRange.startDate, dateRange.endDate);

      if (!dates.length) {
        setQuestionStats({ success: true, totalHits: 0, data: [], dailyStats: [] });
        return;
      }

      const dailyStats = await Promise.all(
        dates.map(async (date) => {
          const params = new URLSearchParams({ date });
          const response = await fetch(
            `${FAQ_DRAFT_BASE_URL}/tht/chatBot/chat-stats?${params.toString()}`,
            {
              headers: { accept: "application/json" },
            },
          );

          if (!response.ok) {
            throw new Error("Failed to fetch chat question stats");
          }

          const data = await response.json();

          if (!data.success) {
            throw new Error("Stats API returned error");
          }

          return { ...data, date };
        }),
      );

      const productTotals = dailyStats.reduce((result, dayStats) => {
        (dayStats.data || []).forEach((item) => {
          const key = normalizeProductName(item.product);
          const current = result.get(key) || {
            product: item.product || "General",
            totalHits: 0,
          };

          current.totalHits += Number(item.totalHits || 0);
          result.set(key, current);
        });

        return result;
      }, new Map());

      setQuestionStats({
        success: true,
        totalHits: dailyStats.reduce(
          (total, dayStats) => total + Number(dayStats.totalHits || 0),
          0,
        ),
        data: Array.from(productTotals.values()),
        dailyStats,
      });
    } catch (err) {
      console.error(err);
      setQuestionStats(null);
      setQuestionStatsError("Failed to fetch question stats");
    } finally {
      setQuestionStatsLoading(false);
    }
  }, [dateRange.endDate, dateRange.startDate]);

  useEffect(() => {
    fetchQuestionStats();
  }, [fetchQuestionStats]);

  const dateFilteredQuestions = allQuestions.filter((question) =>
    isQuestionInDateRange(
      question,
      dateRange.startDate,
      dateRange.endDate,
    ),
  );
  const filteredQuestions = dateFilteredQuestions.filter((question) => {
    const matchesProduct =
      selectedProduct === "all" || question.product === selectedProduct;

    return matchesProduct;
  });

  const paginationState = buildPagination(
    filteredQuestions.length,
    currentPage,
    pageSize,
  );
  const startIndex = (paginationState.page - 1) * pageSize;
  const currentQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + pageSize,
  );
  const unknownQuestionsByDayProduct = dateFilteredQuestions.reduce((result, question) => {
    const date = getQuestionDate(question);
    const key = getDayProductKey(date, question.product);
    const current = result.get(key) || {
      date,
      product: question.product || "General",
      total: 0,
    };

    current.total += 1;
    result.set(key, current);

    return result;
  }, new Map());
  const askQuestionsByDayProduct = (questionStats?.dailyStats || []).reduce((result, dayStats) => {
    (dayStats.data || []).forEach((item) => {
      const date = item.date || dayStats.date;
      const key = getDayProductKey(date, item.product);
      const current = result.get(key) || {
        date,
        product: item.product || "General",
        totalHits: 0,
      };

      current.totalHits += Number(item.totalHits || 0);
      result.set(key, current);
    });

    return result;
  }, new Map());
  const productQuestionStatsMap = Array.from(
    new Set([...askQuestionsByDayProduct.keys(), ...unknownQuestionsByDayProduct.keys()]),
  ).reduce((result, key) => {
    const askStats = askQuestionsByDayProduct.get(key);
    const unknownStats = unknownQuestionsByDayProduct.get(key);
    const product = askStats?.product || unknownStats?.product || "General";
    const productKey = normalizeProductName(product);
    const current = result.get(productKey) || {
      product,
      totalHits: 0,
      unknownQuestions: 0,
      answeredQuestions: 0,
    };

    current.totalHits += askStats?.totalHits || 0;
    current.unknownQuestions += unknownStats?.total || 0;
    current.answeredQuestions += calculateAnsweredQuestions(
      askStats?.totalHits,
      unknownStats?.total,
    );
    result.set(productKey, current);

    return result;
  }, new Map());
  const productQuestionStats = Array.from(productQuestionStatsMap.values());
  const totalAnsweredQuestions = productQuestionStats.reduce(
    (total, item) => total + item.answeredQuestions,
    0,
  );
  const totalUnknownQuestions = productQuestionStats.reduce(
    (total, item) => total + item.unknownQuestions,
    0,
  );
  const displayStats = {
    overview: {
      total_answered: totalAnsweredQuestions,
      total_unknown: totalUnknownQuestions,
      unique_products: productQuestionStats.length,
    },
  };

  useEffect(() => {
    if (currentPage !== paginationState.page) {
      setCurrentPage(paginationState.page);
    }
  }, [currentPage, paginationState.page]);

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(Number(nextPageSize));
    setCurrentPage(1);
  };

  const handleProductChange = (product) => {
    setSelectedProduct(product);
    setCurrentPage(1);
  };

  const handleDateRangeApply = (preset, range) => {
    setDatePreset(preset);
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        "https://grozziie.zjweiting.com:8035/tht/chatBot/unknown-questions/delete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setAllQuestions((prev) => prev.filter((q) => q.id !== id));
        fetchQuestions();
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete question");
    }
  };

  const handleDeleteSelected = async (ids) => {
    if (!ids.length) return;

    try {
      await Promise.all(
        ids.map((id) =>
          fetch(
            "https://grozziie.zjweiting.com:8035/tht/chatBot/unknown-questions/delete",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
            },
          ).then((response) => response.json()),
        ),
      );

      setAllQuestions((prev) => prev.filter((q) => !ids.includes(q.id)));
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected questions");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch(
        "https://grozziie.zjweiting.com:8035/tht/chatBot/unknown-questions/delete-all",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deleteFilters),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setShowDeleteAllModal(false);
        fetchQuestions();
        setDeleteFilters({ product: "", lang: "", days: "" });
      }
    } catch (err) {
      alert("Failed to delete questions");
      console.error(err);
    }
  };

  return (
    <>
      <Header
        stats={displayStats}
        title="Available Unknown Question"
        productQuestionStats={productQuestionStats}
        questionStatsLoading={questionStatsLoading}
        questionStatsError={questionStatsError}
      />
      <Controls
        products={products}
        selectedProduct={selectedProduct}
        onProductChange={handleProductChange}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageSizeChange={handlePageSizeChange}
        datePreset={datePreset}
        dateRange={dateRange}
        onDateRangeApply={handleDateRangeApply}
        onRefresh={() => {
          fetchQuestions();
          fetchQuestionStats();
        }}
        onShowDeleteAll={() => setShowDeleteAllModal(true)}
        allowDelete={allowDelete}
      />
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <QuestionsTable
          questions={currentQuestions}
          allFilteredQuestions={filteredQuestions}
          serialOffset={startIndex}
          onDelete={handleDelete}
          onDeleteSelected={handleDeleteSelected}
          allowDelete={allowDelete}
        />
      )}
      <PaginationControls pagination={paginationState} onPageChange={setCurrentPage} />
      {allowDelete && showDeleteAllModal && (
        <DeleteAllModal
          filters={deleteFilters}
          onFilterChange={setDeleteFilters}
          onConfirm={handleDeleteAll}
          onCancel={() => setShowDeleteAllModal(false)}
        />
      )}
    </>
  );
};

// Header Component
const Header = ({
  stats,
  title,
  productQuestionStats,
  questionStatsLoading,
  questionStatsError,
}) => (
  <div className="bg-gradient-to-r from-[#004368] via-[#0b638f] to-[#14a88b] p-6 rounded-xl shadow-lg mb-6 text-white">
    <h1 className="text-3xl font-bold mb-5">{title}</h1>
    {stats && (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Answer"
          value={
            questionStatsLoading
              ? "..."
              : formatNumber(stats.overview?.total_answered)
          }
        />
        <StatCard
          label="Total Unknown"
          value={formatNumber(stats.overview?.total_unknown)}
        />
        <StatCard
          label="Products"
          value={formatNumber(stats.overview?.unique_products)}
        />
      </div>
    )}
    <div className="mt-5">
      <div className="rounded-lg bg-white bg-opacity-20 p-4 backdrop-blur-lg">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
            Product Wise Questions
          </p>
          <span className="text-xs opacity-80">
            Answer / Unknown
          </span>
        </div>
        {questionStatsError ? (
          <p className="rounded-md bg-red-500 bg-opacity-30 px-3 py-2 text-sm">
            {questionStatsError}
          </p>
        ) : questionStatsLoading ? (
          <p className="rounded-md bg-white bg-opacity-10 px-3 py-2 text-sm">
            Loading product stats...
          </p>
        ) : productQuestionStats.length > 0 ? (
          <div className="grid max-h-52 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {productQuestionStats.map((item) => (
              <div
                key={item.product}
                className="flex items-center justify-between gap-3 rounded-md bg-white bg-opacity-15 px-3 py-2 text-sm"
              >
                <span className="min-w-0 truncate font-medium">{item.product}</span>
                <span className="shrink-0 font-bold">
                  {formatNumber(item.answeredQuestions)} / {formatNumber(item.unknownQuestions)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-md bg-white bg-opacity-10 px-3 py-2 text-sm">
            No product stats found.
          </p>
        )}
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-lg text-center">
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm opacity-90">{label}</div>
  </div>
);

// Controls Component
const Controls = ({
  products,
  selectedProduct,
  onProductChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  datePreset,
  dateRange,
  onDateRangeApply,
  onRefresh,
  onShowDeleteAll,
  allowDelete,
}) => (
  <div className="mb-6 rounded-lg bg-white p-4 shadow">
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <label className="shrink-0 font-semibold text-gray-900">Category:</label>
        <select
          value={selectedProduct}
          onChange={(e) => onProductChange(e.target.value)}
          className="h-10 w-full min-w-[220px] rounded-lg border border-gray-300 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 md:w-[280px]"
        >
          <option value="all">All Products</option>
          {products.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <label className="shrink-0 font-semibold text-gray-900">Show:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(e.target.value)}
          className="h-10 w-full min-w-[140px] rounded-lg border border-gray-300 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 md:w-[150px]"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}/page
            </option>
          ))}
        </select>
      </div>

      <DateRangePicker
        appliedPreset={datePreset}
        appliedRange={dateRange}
        onApply={onDateRangeApply}
      />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 font-semibold text-white transition-colors hover:bg-purple-700"
          onClick={onRefresh}
        >
        <span>🔄</span> Refresh
        </button>
        {allowDelete && (
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 font-semibold text-white transition-colors hover:bg-red-600"
            onClick={onShowDeleteAll}
          >
        <span>🗑️</span> Delete All
          </button>
        )}
      </div>
    </div>

  </div>
);

const DateRangePicker = ({ appliedPreset, appliedRange, onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draftPreset, setDraftPreset] = useState(appliedPreset);
  const [draftRange, setDraftRange] = useState(appliedRange);

  const presetOptions = [
    {
      label: "Yesterday",
      value: DATE_FILTER_PRESETS.YESTERDAY,
      range: getYesterdayRange,
    },
    {
      label: "Last 7 days",
      value: DATE_FILTER_PRESETS.LAST_7_DAYS,
      range: () => getDaysRange(7),
    },
    {
      label: "Last 30 days",
      value: DATE_FILTER_PRESETS.LAST_30_DAYS,
      range: () => getDaysRange(30),
    },
    {
      label: "Last 90 days",
      value: DATE_FILTER_PRESETS.LAST_90_DAYS,
      range: () => getDaysRange(90),
    },
  ];

  const handlePresetClick = (option) => {
    setDraftPreset(option.value);
    setDraftRange(option.range());
  };

  const handleDateChange = (field, value) => {
    setDraftPreset(DATE_FILTER_PRESETS.CUSTOM);
    setDraftRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(draftPreset, draftRange);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setDraftPreset(appliedPreset);
    setDraftRange(appliedRange);
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative w-full md:w-[290px]">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-[#8bb5cc] bg-white px-3 text-sm font-medium text-[#365673] shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#004368]"
        onClick={handleToggle}
      >
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#8aa4b8]" />
          {appliedRange.startDate} &rarr; {appliedRange.endDate}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#6b879a] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-2 w-[280px] rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {presetOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  draftPreset === option.value
                    ? "border-[#004368] bg-[#e8f3f8] text-[#004368]"
                    : "border-gray-200 bg-white text-[#365673] hover:border-[#8bb5cc]"
                }`}
                onClick={() => handlePresetClick(option)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm font-medium text-[#61758a]">
            Start date
            <input
              type="date"
              value={draftRange.startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#004368] focus:outline-none focus:ring-1 focus:ring-[#004368]"
            />
          </label>

          <label className="mt-3 block text-sm font-medium text-[#61758a]">
            End date
            <input
              type="date"
              value={draftRange.endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#004368] focus:outline-none focus:ring-1 focus:ring-[#004368]"
            />
          </label>

          <button
            type="button"
            className="mt-5 w-full rounded-lg bg-[#004d73] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#003f5f]"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};


// Questions Table Component
const QuestionsTable = ({
  questions,
  allFilteredQuestions,
  serialOffset,
  onDelete,
  onDeleteSelected,
  allowDelete,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    setSelectedQuestionIds((prev) =>
      prev.filter((id) => questions.some((question) => question.id === id)),
    );
  }, [questions]);

  const isAllSelected =
    questions.length > 0 && selectedQuestionIds.length === questions.length;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedQuestionIds(questions.map((question) => question.id));
      return;
    }

    setSelectedQuestionIds([]);
  };

  const handleSelectQuestion = (id) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  };

  const closeConfirmAction = () => setConfirmAction(null);

  const handleExportAll = async () => {
    try {
      await exportQuestionsToExcel(
        allFilteredQuestions,
        `all_unknown_questions_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Failed to export all questions:", error);
      alert("Failed to export all questions");
    }
  };

  const confirmExportAll = () => {
    setConfirmAction({
      title: "Export All Questions",
      message: `Export ${allFilteredQuestions.length} unknown question${
        allFilteredQuestions.length > 1 ? "s" : ""
      } to an XLSX file?`,
      confirmLabel: "Export All",
      confirmClassName: "bg-green-600 hover:bg-green-700",
      onConfirm: handleExportAll,
    });
  };

  const handleExportSelected = async () => {
    const selectedQuestions = questions.filter((question) =>
      selectedQuestionIds.includes(question.id),
    );

    try {
      await exportQuestionsToExcel(
        selectedQuestions,
        `selected_unknown_questions_${
          new Date().toISOString().split("T")[0]
        }.xlsx`,
      );
    } catch (error) {
      console.error("Failed to export selected questions:", error);
      alert("Failed to export selected questions");
    }
  };

  const confirmExportSelected = () => {
    setConfirmAction({
      title: "Export Selected Questions",
      message: `Export ${selectedQuestionIds.length} selected unknown question${
        selectedQuestionIds.length > 1 ? "s" : ""
      } to an XLSX file?`,
      confirmLabel: "Export Selected",
      confirmClassName: "bg-blue-600 hover:bg-blue-700",
      onConfirm: handleExportSelected,
    });
  };

  const confirmDeleteQuestion = (id) => {
    setConfirmAction({
      title: "Delete Question",
      message: "Are you sure you want to delete this question?",
      confirmLabel: "Delete",
      confirmClassName: "bg-red-500 hover:bg-red-600",
      onConfirm: () => onDelete(id),
    });
  };

  const confirmDeleteSelected = () => {
    setConfirmAction({
      title: "Delete Selected Questions",
      message: `Are you sure you want to delete ${
        selectedQuestionIds.length
      } selected question${selectedQuestionIds.length > 1 ? "s" : ""}?`,
      confirmLabel: "Delete Selected",
      confirmClassName: "bg-red-500 hover:bg-red-600",
      onConfirm: async () => {
        await onDeleteSelected(selectedQuestionIds);
        setSelectedQuestionIds([]);
      },
    });
  };

  if (questions.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="mb-3 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-end">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={confirmExportAll}
          disabled={allFilteredQuestions.length === 0}
        >
          Export All XLSX
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={confirmExportSelected}
          disabled={selectedQuestionIds.length === 0}
        >
          Export Selected XLSX
        </button>
      </div>

      {allowDelete && selectedQuestionIds.length > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 px-4 py-3">
          <p className="text-sm font-medium text-purple-700">
            {selectedQuestionIds.length} question
            {selectedQuestionIds.length > 1 ? "s" : ""} selected
          </p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={confirmDeleteSelected}
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  aria-label="Select all questions"
                />
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial No
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question, index) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    checked={selectedQuestionIds.includes(question.id)}
                    onChange={() => handleSelectQuestion(question.id)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    aria-label={`Select question ${index + 1}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {serialOffset + index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <span
                    className="text-purple-600 hover:text-purple-800 cursor-pointer underline decoration-dotted"
                    onClick={() => setSelectedQuestion(question)}
                  >
                    {String(question.question || "").length > 50
                      ? `${String(question.question || "").substring(0, 50)}...`
                      : question.question}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {question.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {question.created_at}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => setSelectedQuestion(question)}
                  >
                    View
                  </button>
                  {allowDelete && (
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => confirmDeleteQuestion(question.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onDelete={
            allowDelete
              ? () => {
                  confirmDeleteQuestion(selectedQuestion.id);
                  setSelectedQuestion(null);
                }
              : null
          }
          allowDelete={allowDelete}
        />
      )}

      {confirmAction && (
        <ConfirmActionModal
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          confirmClassName={confirmAction.confirmClassName}
          onConfirm={async () => {
            await confirmAction.onConfirm();
            closeConfirmAction();
          }}
          onCancel={closeConfirmAction}
        />
      )}
    </>
  );
};


// Question Detail Modal Component
const QuestionDetailModal = ({
  question,
  onClose,
  onDelete,
  allowDelete,
}) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Question Details</h2>
          <button
            className="text-white hover:text-gray-200 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="flex">
            <label className="font-semibold text-gray-700 w-24">ID:</label>
            <span className="text-gray-900">{question.id}</span>
          </div>
          <div className="flex">
            <label className="font-semibold text-gray-700 w-24">
              Question:
            </label>
            <div className="flex-1 bg-gray-50 p-3 rounded-lg text-gray-900 whitespace-pre-wrap">
              {question.question}
            </div>
          </div>

          <div className="flex">
            <label className="font-semibold text-gray-700 w-24">Answer:</label>
            <div className="flex-1 bg-green-50 p-3 rounded-lg text-gray-900 whitespace-pre-wrap">
              {getQuestionAnswer(question)}
            </div>
          </div>

          <div className="flex">
            <label className="font-semibold text-gray-700 w-24">Product:</label>
            <span className="text-gray-900">{question.product}</span>
          </div>
          <div className="flex">
            <label className="font-semibold text-gray-700 w-24">
              Created At:
            </label>
            <span className="text-gray-900">{question.created_at}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
        {allowDelete && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);


// Delete All Modal Component
const DeleteAllModal = ({ filters, onFilterChange, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-xl max-w-md w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-xl">
        <h2 className="text-xl font-bold text-white">
          Delete Multiple Questions
        </h2>
      </div>

      <div className="p-6">
        <p className="text-red-600 font-semibold mb-4 p-3 bg-red-50 rounded-lg">
          ⚠️ This action cannot be undone!
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Product:
            </label>
            <input
              type="text"
              placeholder="Product name (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={filters.product}
              onChange={(e) =>
                onFilterChange({ ...filters, product: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Older than (days):
            </label>
            <input
              type="number"
              placeholder="Days (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={filters.days}
              onChange={(e) =>
                onFilterChange({ ...filters, days: e.target.value })
              }
              min="1"
            />
          </div>

          <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
            Leave filters empty to delete ALL questions
          </p>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          onClick={onConfirm}
        >
          Confirm Delete All
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);



export default QuestionsListPanel;
