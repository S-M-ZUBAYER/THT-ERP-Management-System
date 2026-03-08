import ExcelJS from "exceljs";

export const exportToExcelDatewiseForFirstPage = async (devices, startDate, endDate) => {
    // Group devices by date

    const groupedByDate = devices.reduce((acc, device) => {
        const date = device.createdAt.split("T")[0];
        if (!acc[date]) {
            acc[date] = { devices: 0, employees: 0 };
        }
        acc[date].devices += 1;
        acc[date].employees += device.employeeCount;
        return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
        b.localeCompare(a),
    );

    // Calculate totals
    const totalEmployees = devices.reduce((sum, d) => sum + d.employeeCount, 0);
    const calculatedTotalDevices = Object.values(groupedByDate).reduce(
        (sum, d) => sum + d.devices,
        0,
    );

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Device Employee Report");

    // Define columns
    worksheet.columns = [
        { header: "Created Date", key: "date", width: 45 },
        { header: "Total Devices", key: "devices", width: 25 },
        { header: "Total Employees", key: "employees", width: 25 },
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF004368" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 25;

    // Add data rows
    sortedDates.forEach((date) => {
        worksheet.addRow({
            date: date,
            devices: groupedByDate[date].devices,
            employees: groupedByDate[date].employees,
        });
    });

    // Add total row
    const totalRow = worksheet.addRow({
        date: "Total",
        devices: calculatedTotalDevices,
        employees: totalEmployees,
    });
    totalRow.font = { bold: true, size: 12 };
    totalRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
    };

    // Add summary information
    worksheet.addRow({});
    worksheet.addRow({
        date: `Report Date Range: ${startDate} to ${endDate}`,
    });
    worksheet.addRow({
        date: `Total Records: ${sortedDates.length} date(s), ${calculatedTotalDevices} device(s)`,
    });

    // Set alignment for all cells
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            if (rowNumber > 1) {
                cell.alignment = { vertical: "middle", horizontal: "center" };
            }
        });
    });

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
        "download",
        `device_employee_report_${startDate}_to_${endDate}.xlsx`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToExcelDatewiseAllDataForFirstPage = async (
    devices,
    startDate,
    endDate
) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("All Device Data");

    // Define columns (ALL device info)
    worksheet.columns = [
        { header: "Created Date", key: "createdAt", width: 30 },
        { header: "Device ID", key: "deviceId", width: 15 },
        { header: "Device Name", key: "deviceName", width: 35 },
        { header: "Device MAC", key: "deviceMAC", width: 30 },
        { header: "Employee Count", key: "employeeCount", width: 20 },
    ];

    // Header style
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF004368" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 25;

    // Sort by date DESC
    const sortedDevices = [...devices].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Add device rows
    sortedDevices.forEach((device) => {
        worksheet.addRow({
            createdAt: device.createdAt.replace("T", " "),
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            deviceMAC: device.deviceMAC,
            employeeCount: device.employeeCount,
        });
    });

    // Totals
    const totalDevices = devices.length;
    const totalEmployees = devices.reduce(
        (sum, d) => sum + d.employeeCount,
        0
    );

    // Empty row
    worksheet.addRow({});

    // Summary rows
    const summaryHeader = worksheet.addRow({
        createdAt: "SUMMARY",
    });
    summaryHeader.font = { bold: true, size: 13, argb: "FFE6F2F8" };

    const summaryRow1 = worksheet.addRow({
        createdAt: `Report Date Range: ${startDate} to ${endDate}`,
    });

    const summaryRow2 = worksheet.addRow({
        createdAt: `Total Devices: ${totalDevices}`,
    });

    const summaryRow3 = worksheet.addRow({
        createdAt: `Total Employees: ${totalEmployees}`,
    });

    [summaryRow1, summaryRow2, summaryRow3].forEach((row) => {
        row.font = { bold: true };
        row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
        };
    });

    // Align all cells
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            cell.alignment = {
                vertical: "middle",
                horizontal: rowNumber === 1 ? "center" : "left",
            };
        });
    });

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = `device_full_data_${startDate}_to_${endDate}.xlsx`;
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
