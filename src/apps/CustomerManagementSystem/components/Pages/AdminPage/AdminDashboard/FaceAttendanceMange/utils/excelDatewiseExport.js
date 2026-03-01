// excelDatewiseExport.js
import ExcelJS from "exceljs";
import { parseDeviceDate, formatDateForDisplay } from "./excelExportUtils";

// 🔹 Export: Datewise Count to Excel
export const exportDatewiseCountToExcel = async (
    devices,
    startDate,
    endDate,
    setExportLoading,
    setShowDateRangePicker
) => {
    if (!startDate || !endDate) {
        alert("Please select both start and end dates");
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert("Start date cannot be later than end date");
        return;
    }
    console.log(devices, "devices");


    setExportLoading((prev) => ({ ...prev, datewise: true }));

    try {
        // Filter devices within selected date range
        const filteredDevices = devices.filter((device) => {
            if (!device.createdAt) return false;

            const deviceDate = parseDeviceDate(device.createdAt);
            if (!deviceDate) return false;

            return deviceDate >= startDate && deviceDate <= endDate;
        });

        // Group devices by creation date
        const devicesByDate = {};
        let totalDevices = 0;
        let totalEmployees = 0;

        filteredDevices.forEach((device) => {
            const createdDate = parseDeviceDate(device.createdAt) || "Unknown";
            const employeeCount = device.employeeCount || 0;

            if (!devicesByDate[createdDate]) {
                devicesByDate[createdDate] = {
                    deviceCount: 0,
                    employeeCount: 0,
                    originalDate: device.createdAt,
                };
            }

            devicesByDate[createdDate].deviceCount++;
            devicesByDate[createdDate].employeeCount += employeeCount;

            totalDevices++;
            totalEmployees += employeeCount;
        });

        // Sort dates in descending order
        const sortedDates = Object.keys(devicesByDate)
            .filter((date) => date !== "Unknown")
            .sort((a, b) => {
                const dateA = new Date(a);
                const dateB = new Date(b);
                return dateB - dateA;
            });

        // Create workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Face Attendance System";
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet("Datewise Summary");

        worksheet.columns = [
            { header: "Created Date", key: "createdDate", width: 30 },
            { header: "Total Devices", key: "totalDevices", width: 30 },
            { header: "Total Employees", key: "totalEmployees", width: 25 },
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.height = 25;

        worksheet.columns.forEach((column, index) => {
            const cell = headerRow.getCell(index + 1);

            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFDDEBF7" },
            };

            cell.font = {
                bold: true,
                size: 14,
                color: { argb: "FF000000" },
            };

            cell.alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
            };

            cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            };
        });

        // Add data rows
        sortedDates.forEach((date) => {
            const dateData = devicesByDate[date];
            const displayDate = formatDateForDisplay(dateData.originalDate) || date;

            const row = worksheet.addRow({
                createdDate: displayDate,
                totalDevices: dateData.deviceCount,
                totalEmployees: dateData.employeeCount,
            });

            row.eachCell((cell, colNumber) => {
                cell.border = {
                    top: { style: "thin", color: { argb: "FFD9D9D9" } },
                    left: { style: "thin", color: { argb: "FFD9D9D9" } },
                    bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
                    right: { style: "thin", color: { argb: "FFD9D9D9" } },
                };

                if (colNumber === 2 || colNumber === 3) {
                    cell.alignment = { horizontal: "center" };
                    cell.numFmt = "0";
                }
            });
        });

        // Add empty row
        worksheet.addRow([]);

        // Add totals row
        const totalsRow = worksheet.addRow({
            createdDate: "Total",
            totalDevices: totalDevices,
            totalEmployees: totalEmployees,
        });

        totalsRow.eachCell((cell, colNumber) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFC6EFCE" },
            };

            cell.font = {
                bold: true,
                size: 12,
            };

            cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "double", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            };

            if (colNumber === 2 || colNumber === 3) {
                cell.alignment = { horizontal: "center" };
                cell.numFmt = "0";
            }
        });

        // Add date range info
        worksheet.addRow([]);
        const dateRangeRow = worksheet.addRow([
            `Report Date Range: ${startDate} to ${endDate}`,
            "",
            "",
        ]);
        dateRangeRow.getCell(1).font = {
            italic: true,
            color: { argb: "FF4472C4" },
            size: 10,
        };
        worksheet.mergeCells(dateRangeRow.number, 1, dateRangeRow.number, 3);

        worksheet.addRow([]);
        const infoRow = worksheet.addRow([
            `Total Records: ${sortedDates.length} date(s), ${filteredDevices.length} device(s)`,
            "",
            "",
        ]);
        infoRow.getCell(1).font = {
            italic: true,
            color: { argb: "FF808080" },
            size: 9,
        };
        worksheet.mergeCells(infoRow.number, 1, infoRow.number, 3);

        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: 1, column: 3 },
        };

        worksheet.views = [{ state: "frozen", ySplit: 1, xSplit: 0 }];

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Datewise_Summary_${startDate}_to_${endDate}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        setShowDateRangePicker(false);
    } catch (error) {
        console.error("Error exporting datewise count:", error);
        alert("Failed to export datewise count. Please try again.");
    } finally {
        setExportLoading((prev) => ({ ...prev, datewise: false }));
    }
};