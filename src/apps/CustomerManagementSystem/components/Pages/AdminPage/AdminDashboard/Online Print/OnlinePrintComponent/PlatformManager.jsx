import React, { useState, useEffect, useCallback, useMemo } from "react";
import ShopTable from "./ShopTable ";
import ExportButtons from "./ExportButtons";
import DateRangePicker from "./DateRangePicker";
import LoadingSpinner from "./LoadingSpinner";
import NoDataMessage from "./NoDataMessage";
import Pagination from "./Pagination";
import SearchField from "./SearchField";
import { fetchShopsByPlatform } from "../OnlinePrintUtils/apiService";
import {
  exportAllShopsToExcel,
  exportDatewiseToExcel,
  exportNewShopsDetailsToExcel,
  exportNewShopsDatewiseToExcel,
} from "../OnlinePrintUtils/excelExport";
import {
  filterShopsByDateRange,
  filterShopsBySearchTerm,
} from "../OnlinePrintUtils/shopHelpers";
import { getPaginationData } from "../OnlinePrintUtils/pagination";

const PlatformManager = ({ platform }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState({
    all: false,
    datewise: false,
    newDatewise: false,
    newDetails: false,
  });
  const [showDateRange, setShowDateRange] = useState(false);
  const [exportType, setExportType] = useState(null); // Track which export button was clicked
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    setSearchTerm("");
  }, [platform]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const searchedShops = useMemo(
    () => filterShopsBySearchTerm(shops, platform, searchTerm),
    [platform, searchTerm, shops],
  );

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

  const handleExportNewShopsDatewise = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be later than end date");
      return;
    }

    setExportLoading((prev) => ({ ...prev, newDatewise: true }));
    try {
      await exportNewShopsDatewiseToExcel(shops, platform, startDate, endDate);

      setShowDateRange(false);
      setStartDate("");
      setEndDate("");
      setExportType(null);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setExportLoading((prev) => ({ ...prev, newDatewise: false }));
    }
  };

  const handleExportNewShopsDetails = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be later than end date");
      return;
    }

    setExportLoading((prev) => ({ ...prev, newDetails: true }));
    try {
      await exportNewShopsDetailsToExcel(shops, platform, startDate, endDate);

      setShowDateRange(false);
      setStartDate("");
      setEndDate("");
      setExportType(null);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setExportLoading((prev) => ({ ...prev, newDetails: false }));
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

  const handleNewShopsDatewiseClick = () => {
    setExportType("newDatewise");
    setShowDateRange(true);
  };

  const handleNewShopsDetailsClick = () => {
    setExportType("newDetails");
    setShowDateRange(true);
  };

  const handleDateRangeExport = () => {
    if (exportType === "all") {
      handleExportAll();
    } else if (exportType === "datewise") {
      handleExportDatewise();
    } else if (exportType === "newDatewise") {
      handleExportNewShopsDatewise();
    } else if (exportType === "newDetails") {
      handleExportNewShopsDetails();
    }
  };

  const handleDateRangeCancel = () => {
    setShowDateRange(false);
    setStartDate("");
    setEndDate("");
    setExportType(null);
  };

  const { totalPages, currentItems: currentShops } = getPaginationData(
    searchedShops,
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
              onExportNewShopsDatewise={handleNewShopsDatewiseClick}
              onExportNewShopsDetails={handleNewShopsDetailsClick}
              exportAllLoading={exportLoading.all}
              dateRangeLoading={exportLoading.datewise}
              newShopsDateRangeLoading={exportLoading.newDatewise}
              newShopsDetailsLoading={exportLoading.newDetails}
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
            <SearchField
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search email or shop ID"
              resultCount={searchedShops.length}
              totalCount={shops.length}
            />

            {searchedShops.length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center text-gray-500">
                No shops found for this search.
              </div>
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
        loading={
          exportLoading.all ||
          exportLoading.datewise ||
          exportLoading.newDatewise ||
          exportLoading.newDetails
        }
        showDateRange={showDateRange}
        exportDetails={
          exportType === "newDatewise"
            ? [
                "Date-wise new shop count summary",
                "Only shop IDs first created from February 1, 2026 onward are checked",
                "Shop IDs before February 1, 2026 are ignored for comparison",
              ]
            : exportType === "newDetails"
              ? [
                  "Unique new shop details for the selected period",
                  "Repeated shop details listed below in red",
                  "Comparison starts from February 1, 2026 only",
                ]
            : undefined
        }
      />
    </>
  );
};

export default PlatformManager;
