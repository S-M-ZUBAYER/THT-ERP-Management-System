import React, { useState, useEffect, useCallback } from "react";
import { fetchAllTransactions } from "../TransactionPaymentUtils/transactionApiService";
import {
  exportAllTransactionsToExcel,
  exportDatewiseTransactionsToExcel,
} from "../TransactionPaymentUtils/transactionExcelExport";
import { filterTransactionsByDateRange } from "../TransactionPaymentUtils/transactionHelpers";
import { getPaginationData } from "../OnlinePrintUtils/pagination";
import ExportButtons from "../OnlinePrintComponent/ExportButtons";
import LoadingSpinner from "../OnlinePrintComponent/LoadingSpinner";
import NoTransactionMessage from "./NoTransactionMessage";
import TransactionFilterBar from "./TransactionFilterBar";
import TransactionStats from "./TransactionStats";
import TransactionTable from "./TransactionTable";
import Pagination from "../OnlinePrintComponent/Pagination";
import DateRangePicker from "../OnlinePrintComponent/DateRangePicker";

// NOTE: Make sure all imports above are DEFAULT exports, not named exports
// If you get import errors, check that each component file has:
// export default ComponentName;

const TransactionManager = ({ platform }) => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState({
    all: false,
    selected: false,
    datewise: false,
  });
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setCurrentPage(1);
    setSelectedIds([]);
    try {
      const data = await fetchAllTransactions();
      setAllTransactions(data[platform] || []);
    } catch (error) {
      console.error(`Error fetching ${platform} transactions:`, error);
      setAllTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [platform]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Apply filter whenever allTransactions or filterType changes
  useEffect(() => {
    let filtered = [...allTransactions];

    if (filterType === "paid") {
      filtered = filtered.filter((t) => parseFloat(t.amount) > 0);
    } else if (filterType === "free") {
      filtered = filtered.filter((t) => parseFloat(t.amount) === 0);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
    setSelectedIds([]);
  }, [allTransactions, filterType]);

  const handleFilterChange = (newFilter) => {
    setFilterType(newFilter);
  };

  const handleSelectAll = (currentPageTransactions) => {
    const currentPageIds = currentPageTransactions.map((t) => t.id);
    const allCurrentSelected = currentPageIds.every((id) =>
      selectedIds.includes(id),
    );

    if (allCurrentSelected) {
      // Deselect all on current page
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
      // Select all on current page
      const newIds = [...new Set([...selectedIds, ...currentPageIds])];
      setSelectedIds(newIds);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleExportAll = async () => {
    setExportLoading((prev) => ({ ...prev, all: true }));
    try {
      await exportAllTransactionsToExcel(filteredTransactions, platform);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setExportLoading((prev) => ({ ...prev, all: false }));
    }
  };

  const handleExportSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Please select transactions to export");
      return;
    }

    setExportLoading((prev) => ({ ...prev, selected: true }));
    try {
      const selectedTransactions = filteredTransactions.filter((t) =>
        selectedIds.includes(t.id),
      );

      await exportAllTransactionsToExcel(selectedTransactions, platform);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export selected data");
    } finally {
      setExportLoading((prev) => ({ ...prev, selected: false }));
    }
  };

  const handleExportDatewise = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be later than end date");
      return;
    }

    setExportLoading((prev) => ({ ...prev, datewise: true }));
    try {
      const dateFilteredTransactions = filterTransactionsByDateRange(
        filteredTransactions,
        startDate,
        endDate,
      );

      if (dateFilteredTransactions.length === 0) {
        alert("No transactions found in the selected date range");
        setExportLoading((prev) => ({ ...prev, datewise: false }));
        return;
      }
      await exportDatewiseTransactionsToExcel(
        dateFilteredTransactions,
        platform,
        startDate,
        endDate,
      );

      setShowDateRange(false);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setExportLoading((prev) => ({ ...prev, datewise: false }));
    }
  };

  const { totalPages, currentItems: currentTransactions } = getPaginationData(
    filteredTransactions,
    currentPage,
    12,
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {platform.toUpperCase()} Transactions
            </h2>
            <p className="text-gray-600">Payment history and records</p>
          </div>
          <div>
            <ExportButtons
              onExportAll={handleExportAll}
              onExportSelected={handleExportSelected}
              onToggleDateRange={() => setShowDateRange(true)}
              dateWise={false}
              exportAllLoading={exportLoading.all}
              exportSelectedLoading={exportLoading.selected}
              dateRangeLoading={exportLoading.datewise}
              selectedCount={selectedIds.length}
              hasSelection={selectedIds.length > 0}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : allTransactions.length === 0 ? (
          <NoTransactionMessage platform={platform} />
        ) : (
          <>
            <TransactionFilterBar
              filterType={filterType}
              onFilterChange={handleFilterChange}
              selectedCount={selectedIds.length}
              totalCount={filteredTransactions.length}
            />

            <TransactionStats
              transactions={filteredTransactions}
              platform={platform}
            />

            <TransactionTable
              transactions={currentTransactions}
              selectedIds={selectedIds}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <DateRangePicker
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onExport={handleExportDatewise}
        onCancel={() => {
          setShowDateRange(false);
          setStartDate("");
          setEndDate("");
        }}
        loading={exportLoading.datewise}
        showDateRange={showDateRange}
      />
    </>
  );
};

export default TransactionManager;
