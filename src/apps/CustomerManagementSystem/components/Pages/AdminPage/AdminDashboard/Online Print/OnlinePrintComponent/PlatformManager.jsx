import React, { useState, useEffect, useCallback } from "react";
import ShopTable from "./ShopTable ";
import ExportButtons from "./ExportButtons";
import DateRangePicker from "./DateRangePicker";
import LoadingSpinner from "./LoadingSpinner";
import NoDataMessage from "./NoDataMessage";
import Pagination from "./Pagination";
import { fetchShopsByPlatform } from "../OnlinePrintUtils/apiService";
import {
  exportAllShopsToExcel,
  exportDatewiseToExcel,
} from "../OnlinePrintUtils/excelExport";
import { filterShopsByDateRange } from "../OnlinePrintUtils/shopHelpers";
import { getPaginationData } from "../OnlinePrintUtils/pagination";

const PlatformManager = ({ platform }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState({
    all: false,
    datewise: false,
  });
  const [showDateRange, setShowDateRange] = useState(false);
  const [exportType, setExportType] = useState(null); // Track which export button was clicked
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchShops = useCallback(async () => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const data = await fetchShopsByPlatform(platform);
      setShops(data);
    } catch (error) {
      console.error(`Error fetching ${platform} shops:`, error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, [platform]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleExportAll = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be later than end date");
      return;
    }

    setExportLoading((prev) => ({ ...prev, all: true }));

    try {
      await exportAllShopsToExcel(shops, platform, startDate, endDate);

      // Reset after successful export
      setShowDateRange(false);
      setStartDate("");
      setEndDate("");
      setExportType(null);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setExportLoading((prev) => ({ ...prev, all: false }));
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
      const filteredShops = filterShopsByDateRange(shops, startDate, endDate);
      await exportDatewiseToExcel(filteredShops, platform, startDate, endDate);

      setShowDateRange(false);
      setStartDate("");
      setEndDate("");
      setExportType(null);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setExportLoading((prev) => ({ ...prev, datewise: false }));
    }
  };

  const handleExportClick = () => {
    setExportType("all");
    setShowDateRange(true);
  };

  const handleDatewiseClick = () => {
    setExportType("datewise");
    setShowDateRange(true);
  };

  const handleDateRangeExport = () => {
    if (exportType === "all") {
      handleExportAll();
    } else if (exportType === "datewise") {
      handleExportDatewise();
    }
  };

  const handleDateRangeCancel = () => {
    setShowDateRange(false);
    setStartDate("");
    setEndDate("");
    setExportType(null);
  };

  const { totalPages, currentItems: currentShops } = getPaginationData(
    shops,
    currentPage,
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {platform.toUpperCase()} Shops
            </h2>
            <p className="text-gray-600">Total: {shops.length} shops</p>
          </div>
          <div>
            <ExportButtons
              onExportAll={handleExportClick}
              onExportSelected={handleExportClick}
              onToggleDateRange={handleDatewiseClick}
              exportAllLoading={exportLoading.all}
              dateRangeLoading={exportLoading.datewise}
              dateWise={true}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : shops.length === 0 ? (
          <NoDataMessage platform={platform} />
        ) : (
          <>
            <ShopTable shops={currentShops} platform={platform} />
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
        onExport={handleDateRangeExport}
        onCancel={handleDateRangeCancel}
        loading={exportLoading.all || exportLoading.datewise}
        showDateRange={showDateRange}
      />
    </>
  );
};

export default PlatformManager;
