// excelExportUtils.js
import ExcelJS from "exceljs";

// 🔹 Helper: Format Date for Display
export const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";

    try {
        const [datePart, timePart] = dateString.split(" ");
        const [day, monthAbbr, year] = datePart.split("-");

        const monthMap = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04",
            May: "05", Jun: "06", Jul: "07", Aug: "08",
            Sep: "09", Oct: "10", Nov: "11", Dec: "12",
        };

        const month = monthMap[monthAbbr] || "01";
        return `${year}-${month}-${day.padStart(2, "0")}`;
    } catch (error) {
        return dateString;
    }
};

// 🔹 Helper: Parse Device Date
export const parseDeviceDate = (dateString) => {
    if (!dateString) return null;

    try {
        const [datePart, timePart] = dateString.split(" ");
        const [day, monthAbbr, year] = datePart.split("-");

        const monthMap = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04",
            May: "05", Jun: "06", Jul: "07", Aug: "08",
            Sep: "09", Oct: "10", Nov: "11", Dec: "12",
        };

        const month = monthMap[monthAbbr];
        if (!month) return null;

        return `${year}-${month}-${day.padStart(2, "0")}`;
    } catch (error) {
        console.error("Error parsing date:", dateString, error);
        return null;
    }
};

// 🔹 Export: All History to Excel
export const exportAllHistoryToExcel = async (devices, setExportLoading) => {
    setExportLoading((prev) => ({ ...prev, allHistory: true }));

    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Face Attendance System";
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet("Devices Summary");

        worksheet.columns = [
            { header: "Device Name", key: "deviceName", width: 30 },
            { header: "Device MAC", key: "deviceMAC", width: 30 },
            { header: "Created Date", key: "createdDate", width: 30 },
            { header: "Employee Count", key: "employeeCount", width: 25 },
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.height = 25;

        worksheet.columns.forEach((column, index) => {
            const cell = headerRow.getCell(index + 1);

            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFC6EFCE" },
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

        let totalEmployees = 0;
        let totalDevices = devices.length;

        devices.forEach((device) => {
            const employeeCount = device.employeeCount || 0;
            totalEmployees += employeeCount;

            const row = worksheet.addRow({
                deviceName: device.deviceName || "N/A",
                deviceMAC: device.deviceMAC || "N/A",
                createdDate: device.createdAt ? device.createdAt.split("T")[0] : "N/A",
                employeeCount: employeeCount,
            });

            row.eachCell((cell, colNumber) => {
                cell.border = {
                    top: { style: "thin", color: { argb: "FFD9D9D9" } },
                    left: { style: "thin", color: { argb: "FFD9D9D9" } },
                    bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
                    right: { style: "thin", color: { argb: "FFD9D9D9" } },
                };

                if (colNumber === 4) {
                    cell.alignment = { horizontal: "center" };
                }
            });
        });

        worksheet.addRow([]);
        worksheet.addRow([]);

        const summaryHeaderRow = worksheet.addRow(["SUMMARY", "", "", ""]);
        summaryHeaderRow.eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFE2EFDA" },
            };
            cell.font = { bold: true, size: 12 };
            cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            };
        });

        const totalDevicesRow = worksheet.addRow([
            "Total Devices",
            totalDevices,
            "",
            "",
        ]);
        totalDevicesRow.getCell(1).font = { bold: true, size: 12 };
        totalDevicesRow.getCell(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2EFDA" },
        };
        totalDevicesRow.getCell(2).font = { bold: true, size: 12 };
        totalDevicesRow.getCell(2).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF2F2F2" },
        };
        totalDevicesRow.eachCell((cell) => {
            cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            };
        });

        const totalEmployeesRow = worksheet.addRow([
            "Total Employees",
            totalEmployees,
            "",
            "",
        ]);
        totalEmployeesRow.getCell(1).font = { bold: true, size: 12 };
        totalEmployeesRow.getCell(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2EFDA" },
        };
        totalEmployeesRow.getCell(2).font = { bold: true, size: 12 };
        totalEmployeesRow.getCell(2).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF2F2F2" },
        };
        totalEmployeesRow.eachCell((cell) => {
            cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            };
        });

        worksheet.views = [{ state: "frozen", ySplit: 1, xSplit: 0 }];
        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: 1, column: 4 },
        };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Devices_Summary_${new Date().toISOString().split("T")[0]
            }.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error exporting to Excel:", error);
        alert("Failed to export data. Please try again.");
    } finally {
        setExportLoading((prev) => ({ ...prev, allHistory: false }));
    }
};

// Continue in next file for datewise export...