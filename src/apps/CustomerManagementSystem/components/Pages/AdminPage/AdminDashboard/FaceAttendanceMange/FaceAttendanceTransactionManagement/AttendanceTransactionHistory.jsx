// ============================================================
// FILE: src/AttendanceTransactionHistory.jsx (Main Component)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import AttendanceTable from "./AttendanceTransactionHistoryComponents/AttendanceTable";
import AttendanceStats from "./AttendanceTransactionHistoryComponents/AttendanceStats";
import AttendanceFilterBar from "./AttendanceTransactionHistoryComponents/AttendanceFilterBar";
import AttendanceExportButtons from "./AttendanceTransactionHistoryComponents/AttendanceExportButtons";
// import DateRangePicker from "./AttendanceTransactionHistoryComponents/DateRangePicker";
import NoAttendanceMessage from "./AttendanceTransactionHistoryComponents/NoAttendanceMessage";
import { fetchAllAttendancePayments } from "./AttendanceTransactionHistoryUtils/attendanceApiService";
import {
  exportAllAttendanceToExcel,
  exportDatewiseAttendanceToExcel,
} from "./AttendanceTransactionHistoryUtils/attendanceExcelExport";
import { filterAttendanceByDateRange } from "./AttendanceTransactionHistoryUtils/attendanceHelpers";
// import { getPaginationData } from "./AttendanceTransactionHistoryUtils/pagination";
import LoadingSpinner from "../../Online Print/OnlinePrintComponent/LoadingSpinner";
import DateRangePicker from "../../Online Print/OnlinePrintComponent/DateRangePicker";
import Pagination from "../../Online Print/OnlinePrintComponent/Pagination";
import { getPaginationData } from "../../Online Print/OnlinePrintUtils/pagination";

const AttendanceTransactionHistory = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
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

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setCurrentPage(1);
    setSelectedIds([]);
    try {
      const data = await fetchAllAttendancePayments();
      setAllRecords(data);
    } catch (error) {
      console.error("Error fetching attendance payments:", error);
      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Apply filter
  useEffect(() => {
    let filtered = [...allRecords];

    if (filterType === "paid") {
      filtered = filtered.filter((r) => parseFloat(r.amount) > 0);
    } else if (filterType === "free") {
      filtered = filtered.filter((r) => parseFloat(r.amount) === 0);
    }

    setFilteredRecords(filtered);
    setCurrentPage(1);
    setSelectedIds([]);
  }, [allRecords, filterType]);

  const handleFilterChange = (newFilter) => {
    setFilterType(newFilter);
  };

  const handleSelectAll = (currentPageRecords) => {
    const currentPageIds = currentPageRecords.map((r) => r.id);
    const allCurrentSelected = currentPageIds.every((id) =>
      selectedIds.includes(id),
    );

    if (allCurrentSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
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
      await exportAllAttendanceToExcel(filteredRecords);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setExportLoading((prev) => ({ ...prev, all: false }));
    }
  };

  const handleExportSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Please select records to export");
      return;
    }

    setExportLoading((prev) => ({ ...prev, selected: true }));
    try {
      const selectedRecords = filteredRecords.filter((r) =>
        selectedIds.includes(r.id),
      );
      await exportAllAttendanceToExcel(selectedRecords);
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
      const dateFilteredRecords = filterAttendanceByDateRange(
        filteredRecords,
        startDate,
        endDate,
      );

      if (dateFilteredRecords.length === 0) {
        alert("No records found in the selected date range");
        setExportLoading((prev) => ({ ...prev, datewise: false }));
        return;
      }

      await exportDatewiseAttendanceToExcel(
        dateFilteredRecords,
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

  const { totalPages, currentItems: currentRecords } = getPaginationData(
    filteredRecords,
    currentPage,
    12,
  );

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Attendance Transaction History
            </h1>
            <p className="text-gray-600">
              Payment records for attendance system
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Payment Records
                </h2>
                <p className="text-gray-600">
                  View and manage attendance payments
                </p>
              </div>
              <div>
                <AttendanceExportButtons
                  onExportAll={handleExportAll}
                  onExportSelected={handleExportSelected}
                  onToggleDateRange={() => setShowDateRange(true)}
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
            ) : allRecords.length === 0 ? (
              <NoAttendanceMessage />
            ) : (
              <>
                <AttendanceFilterBar
                  filterType={filterType}
                  onFilterChange={handleFilterChange}
                  selectedCount={selectedIds.length}
                  totalCount={filteredRecords.length}
                />

                <AttendanceStats records={filteredRecords} />

                <AttendanceTable
                  records={currentRecords}
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
        </div>
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

export default AttendanceTransactionHistory;
