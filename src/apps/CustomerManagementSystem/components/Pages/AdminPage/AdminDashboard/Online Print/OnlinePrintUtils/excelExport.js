import ExcelJS from "exceljs";
import { PLATFORM_STYLES } from "./constants";
import {
    getNewAndRepeatedShopsByDateRange,
    getNewShopsByFirstCreatedDate,
    getShopFields,
    groupShopsByDate,
    NEW_SHOPS_COMPARISON_START_DATE,
} from "./shopHelpers";

const getPlatformUserListHeading = (platform) =>
    `${platform.toUpperCase()} User List`;

const getShopStatus = (shop) => (shop.active === 1 ? "Active" : "Inactive");

const formatExportDate = (dateValue) => {
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
};

const getShopDetailsRow = (shop, platform, firstShop = shop) => {
    const { email, key, country } = getShopFields(shop, platform);
    const { email: firstEmail } = getShopFields(firstShop, platform);

    return [
        shop.id,
        email,
        country,
        key,
        getShopStatus(shop),
        formatExportDate(shop.createdAt),
        formatExportDate(shop.updatedAt),
        formatExportDate(firstShop?.createdAt),
        firstEmail || "",
    ];
};

const styleDetailHeaderRow = (row, fillColor = "FFDDEBF7", fontColor = "FF000000") => {
    row.eachCell((cell) => {
        cell.font = {
            bold: true,
            size: 12,
            color: { argb: fontColor },
        };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: fillColor },
        };
        cell.alignment = {
            vertical: "middle",
            horizontal: "center",
        };
    });
};

const downloadWorkbook = async (workbook, filename) => {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
};

export const exportAllShopsToExcel = async (shops, platform, startDate, endDate) => {
    // Filter shops by date range
    const filteredShops = shops.filter((shop) => {
        const shopDate = new Date(shop.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Set time to start of day for start date and end of day for end date
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return shopDate >= start && shopDate <= end;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${platform.toUpperCase()} Shops`);

    // Define columns
    worksheet.columns = [
        { header: "ID", key: "id", width: 15 },
        { header: "Email", key: "email", width: 40 },
        { header: "Country", key: "country", width: 15 },
        { header: "API Key/Shop Id", key: "key", width: 60 },
        { header: "Status", key: "status", width: 15 },
        { header: "Created Date", key: "createdAt", width: 30 },
        { header: "Updated Date", key: "updatedAt", width: 30 },
    ];

    worksheet.insertRow(1, [getPlatformUserListHeading(platform)]);
    worksheet.mergeCells("A1:G1");
    const titleRow = worksheet.getRow(1);
    titleRow.height = 28;
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = {
        vertical: "middle",
        horizontal: "center",
    };

    // Get platform styles
    const style = PLATFORM_STYLES.header[platform] || {
        bg: "FFE0E0E0",
        fontColor: "FF000000",
        fontSize: 13,
    };

    // Style header row
    const headerRow = worksheet.getRow(2);
    headerRow.eachCell((cell) => {
        cell.font = {
            bold: true,
            size: style.fontSize,
            color: { argb: style.fontColor },
        };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: style.bg },
        };
        cell.alignment = {
            vertical: "middle",
            horizontal: "center",
        };
    });

    // Add data rows using filtered shops
    filteredShops.forEach((shop) => {
        const { email, key, country } = getShopFields(shop, platform);
        const createdAtLocal = new Date(shop.createdAt);
        const updatedAtLocal = new Date(shop.updatedAt);

        worksheet.addRow({
            id: shop.id,
            email: email,
            country: country,
            key: key,
            status: shop.active === 1 ? "Active" : "Inactive",
            createdAt: createdAtLocal.toLocaleString(),
            updatedAt: updatedAtLocal.toLocaleString(),
        });
    });

    // Add summary section
    worksheet.addRow([]);
    const summaryRow = worksheet.addRow(["SUMMARY", "", "", "", "", "", ""]);
    worksheet.addRow(["Total Shops", filteredShops.length, "", "", "", "", ""]);
    worksheet.addRow(["Date Range", `${startDate} to ${endDate}`, "", "", "", "", ""]);

    const summaryStyle = PLATFORM_STYLES.summary[platform] || {
        bg: "FFF3F4F6",
        fontColor: "FF374151",
        fontSize: 12,
    };

    summaryRow.eachCell((cell) => {
        cell.font = {
            bold: true,
            size: summaryStyle.fontSize,
            color: { argb: summaryStyle.fontColor },
        };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: summaryStyle.bg },
        };
        cell.alignment = {
            vertical: "middle",
            horizontal: "right",
        };
    });

    // Format filename with date range
    const formattedStartDate = startDate.split('-').join('');
    const formattedEndDate = endDate.split('-').join('');
    const filename = `${platform}_all_shops_${formattedStartDate}_to_${formattedEndDate}.xlsx`;

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
};

export const exportDatewiseToExcel = async (shops, platform, startDate, endDate) => {
    const shopsByDate = groupShopsByDate(shops);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datewise Summary");

    worksheet.columns = [
        { header: "Date", key: "date", width: 20 },
        { header: "Number of Shops", key: "count", width: 30 },
    ];

    worksheet.insertRow(1, [`${getPlatformUserListHeading(platform)} Datewise Summary`]);
    worksheet.mergeCells("A1:B1");
    const titleRow = worksheet.getRow(1);
    titleRow.height = 28;
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = {
        vertical: "middle",
        horizontal: "center",
    };

    // Style header
    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true, size: 12 };
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDDEBF7" },
    };

    // Sort and add date rows
    const sortedDates = Object.keys(shopsByDate).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach((dateKey) => {
        const date = new Date(dateKey);
        worksheet.addRow({
            date: date.toLocaleDateString(),
            count: shopsByDate[dateKey],
        });
    });

    // Add totals
    worksheet.addRow([]);
    const totalRow = worksheet.addRow({
        date: "TOTAL",
        count: shops.length,
    });
    totalRow.font = { bold: true };
    totalRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC6EFCE" },
    };

    // Add date range info
    worksheet.addRow([]);
    worksheet.addRow(["Report Date Range:", `${startDate} to ${endDate}`]);

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${platform}_datewise_${startDate}_to_${endDate}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
};

export const exportNewShopsDatewiseToExcel = async (shops, platform, startDate, endDate) => {
    const newShops = getNewShopsByFirstCreatedDate(shops, platform, startDate, endDate);
    const shopsByDate = groupShopsByDate(newShops);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("New Shops Datewise Summary");

    worksheet.columns = [
        { header: "Date", key: "date", width: 20 },
        { header: "Number of New Shops", key: "count", width: 30 },
    ];

    worksheet.insertRow(1, [`${getPlatformUserListHeading(platform)} New Shops Datewise Summary`]);
    worksheet.mergeCells("A1:B1");
    const titleRow = worksheet.getRow(1);
    titleRow.height = 28;
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = {
        vertical: "middle",
        horizontal: "center",
    };

    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true, size: 12 };
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDDEBF7" },
    };

    const sortedDates = Object.keys(shopsByDate).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach((dateKey) => {
        const date = new Date(dateKey);
        worksheet.addRow({
            date: date.toLocaleDateString(),
            count: shopsByDate[dateKey],
        });
    });

    worksheet.addRow([]);
    const totalRow = worksheet.addRow({
        date: "TOTAL",
        count: newShops.length,
    });
    totalRow.font = { bold: true };
    totalRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC6EFCE" },
    };

    worksheet.addRow([]);
    worksheet.addRow(["Report Date Range:", `${startDate} to ${endDate}`]);
    worksheet.addRow([
        "Count Rule:",
        `Only shop IDs whose first created date from ${NEW_SHOPS_COMPARISON_START_DATE} onward is inside the selected date range`,
    ]);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${platform}_new_shops_datewise_${startDate}_to_${endDate}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
};

export const exportNewShopsDetailsToExcel = async (shops, platform, startDate, endDate) => {
    const { uniqueNewShops, repeatedShops } = getNewAndRepeatedShopsByDateRange(
        shops,
        platform,
        startDate,
        endDate,
    );
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("New Shop Details");
    const detailHeaders = [
        "ID",
        "Email",
        "Country",
        "API Key/Shop Id",
        "Status",
        "Created Date",
        "Updated Date",
        "First Created Date",
        "First Email",
    ];

    worksheet.columns = [
        { key: "id", width: 15 },
        { key: "email", width: 40 },
        { key: "country", width: 15 },
        { key: "key", width: 60 },
        { key: "status", width: 15 },
        { key: "createdAt", width: 30 },
        { key: "updatedAt", width: 30 },
        { key: "firstCreatedAt", width: 30 },
        { key: "firstEmail", width: 40 },
    ];

    worksheet.addRow([`${getPlatformUserListHeading(platform)} New Shops Details`]);
    worksheet.mergeCells("A1:I1");
    const titleRow = worksheet.getRow(1);
    titleRow.height = 28;
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = {
        vertical: "middle",
        horizontal: "center",
    };

    worksheet.addRow([]);
    worksheet.addRow(["Date Range", `${startDate} to ${endDate}`]);
    worksheet.addRow(["Unique New Shops", uniqueNewShops.length]);
    const repeatedSummaryRow = worksheet.addRow(["Repeated Shops in Selected Date Range", repeatedShops.length]);

    [3, 4, 5].forEach((rowNumber) => {
        const row = worksheet.getRow(rowNumber);
        row.getCell(1).font = { bold: true };
        row.getCell(1).alignment = { vertical: "middle", horizontal: "right" };
    });

    repeatedSummaryRow.eachCell((cell, colNumber) => {
        cell.font = {
            ...(cell.font ?? {}),
            color: { argb: "FFB91C1C" },
            bold: colNumber === 1 ? true : cell.font?.bold,
        };
    });

    worksheet.addRow([]);
    const uniqueTitleRow = worksheet.addRow(["Unique New Shop Details"]);
    worksheet.mergeCells(`A${uniqueTitleRow.number}:I${uniqueTitleRow.number}`);
    uniqueTitleRow.getCell(1).font = { bold: true, size: 13 };
    uniqueTitleRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFECFDF5" },
    };

    const uniqueHeaderRow = worksheet.addRow(detailHeaders);
    styleDetailHeaderRow(uniqueHeaderRow, "FFDDEBF7");

    uniqueNewShops.forEach((shop) => {
        worksheet.addRow(getShopDetailsRow(shop, platform));
    });

    if (uniqueNewShops.length === 0) {
        worksheet.addRow(["No unique new shops found in the selected date range"]);
    }

    worksheet.addRow([]);
    const repeatedTitleRow = worksheet.addRow(["Repeated Shop Details"]);
    worksheet.mergeCells(`A${repeatedTitleRow.number}:I${repeatedTitleRow.number}`);
    repeatedTitleRow.getCell(1).font = {
        bold: true,
        size: 13,
        color: { argb: "FFB91C1C" },
    };
    repeatedTitleRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFE5E5" },
    };

    const repeatedHeaderRow = worksheet.addRow(detailHeaders);
    styleDetailHeaderRow(repeatedHeaderRow, "FFFFC7CE", "FF9C0006");

    if (repeatedShops.length === 0) {
        const emptyRepeatedRow = worksheet.addRow([
            "No repeated shops found in the selected date range",
        ]);
        emptyRepeatedRow.getCell(1).font = {
            italic: true,
            color: { argb: "FFB91C1C" },
        };
    } else {
        repeatedShops.forEach(({ shop, firstShop }) => {
            const row = worksheet.addRow(getShopDetailsRow(shop, platform, firstShop));
            row.eachCell((cell) => {
                cell.font = { color: { argb: "FFB91C1C" } };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFF1F2" },
                };
            });
        });
    }

    worksheet.eachRow((row) => {
        row.eachCell((cell, colNumber) => {
            cell.alignment = {
                vertical: "middle",
                horizontal: colNumber === 2 || colNumber === 4 || colNumber === 9 ? "left" : "center",
            };
            cell.border = {
                top: { style: "thin", color: { argb: "FFD9D9D9" } },
                left: { style: "thin", color: { argb: "FFD9D9D9" } },
                bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
                right: { style: "thin", color: { argb: "FFD9D9D9" } },
            };
        });
    });

    const formattedStartDate = startDate.split("-").join("");
    const formattedEndDate = endDate.split("-").join("");
    await downloadWorkbook(
        workbook,
        `${platform}_new_shops_details_${formattedStartDate}_to_${formattedEndDate}.xlsx`,
    );
};

