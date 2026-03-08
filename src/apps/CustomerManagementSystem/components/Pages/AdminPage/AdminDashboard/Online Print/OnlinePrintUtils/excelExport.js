import ExcelJS from "exceljs";
import { PLATFORM_STYLES } from "./constants";
import { getShopFields, groupShopsByDate } from "./shopHelpers";

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

    // Get platform styles
    const style = PLATFORM_STYLES.header[platform] || {
        bg: "FFE0E0E0",
        fontColor: "FF000000",
        fontSize: 13,
    };

    // Style header row
    const headerRow = worksheet.getRow(1);
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

    // Style header
    const headerRow = worksheet.getRow(1);
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

