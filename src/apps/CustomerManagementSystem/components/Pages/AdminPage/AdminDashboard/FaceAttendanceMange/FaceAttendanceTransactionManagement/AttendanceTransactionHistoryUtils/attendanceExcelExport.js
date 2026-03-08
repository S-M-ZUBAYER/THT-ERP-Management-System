import ExcelJS from "exceljs";
import { ATTENDANCE_EXPORT_STYLES } from "./attendanceConstants";
import { groupAttendanceByDate, calculateAttendanceRevenue } from "./attendanceHelpers";

export const exportAllAttendanceToExcel = async (records) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance Payments");

    // Define columns
    worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Email", key: "email", width: 35 },
        { header: "Package", key: "package", width: 20 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Currency", key: "currency", width: 12 },
        { header: "Payment Time", key: "paymentTime", width: 25 },
        { header: "Expire Time", key: "expireTime", width: 25 },
        { header: "Status", key: "status", width: 15 },
        { header: "Created At", key: "createdAt", width: 25 },
    ];

    const style = ATTENDANCE_EXPORT_STYLES.header;

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

    // Add data rows
    records.forEach((record) => {
        worksheet.addRow({
            id: record.id,
            email: record.email,
            package: record.package_name,
            amount: parseFloat(record.amount).toFixed(2),
            currency: record.currency.toUpperCase(),
            paymentTime: new Date(record.paymentTime).toLocaleString(),
            expireTime: new Date(record.paymentExpireTime).toLocaleString(),
            status: record.paymentStatus === 1 ? "Active" : "Inactive",
            createdAt: new Date(record.created_at).toLocaleString(),
        });
    });

    // Calculate totals
    const totalRevenue = calculateAttendanceRevenue(records);
    const paidCount = records.filter(r => parseFloat(r.amount) > 0).length;
    const freeCount = records.length - paidCount;

    // Add summary section
    worksheet.addRow([]);
    const summaryRow = worksheet.addRow(["SUMMARY", "", "", "", "", "", "", "", ""]);
    worksheet.addRow(["Total Transactions", records.length, "", "", "", "", "", "", ""]);
    worksheet.addRow(["Total Revenue", `$${totalRevenue.toFixed(2)}`, "", "", "", "", "", "", ""]);
    worksheet.addRow(["Paid Transactions", paidCount, "", "", "", "", "", "", ""]);
    worksheet.addRow(["Free Transactions", freeCount, "", "", "", "", "", "", ""]);

    const summaryStyle = ATTENDANCE_EXPORT_STYLES.summary;

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

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_payments_${new Date().toISOString().split("T")[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
};

export const exportDatewiseAttendanceToExcel = async (records, startDate, endDate) => {
    const recordsByDate = groupAttendanceByDate(records);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datewise Summary");

    worksheet.columns = [
        { header: "Date", key: "date", width: 20 },
        { header: "Number of Transactions", key: "count", width: 25 },
        { header: "Total Amount (USD)", key: "amount", width: 25 },
    ];

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD1E7DD" },
    };

    // Sort and add date rows
    const sortedDates = Object.keys(recordsByDate).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach((dateKey) => {
        const date = new Date(dateKey);
        const dayData = recordsByDate[dateKey];
        worksheet.addRow({
            date: date.toLocaleDateString(),
            count: dayData.count,
            amount: `$${dayData.totalAmount.toFixed(2)}`,
        });
    });

    // Add totals
    const totalTransactions = records.length;
    const totalRevenue = calculateAttendanceRevenue(records);

    worksheet.addRow([]);
    const totalRow = worksheet.addRow({
        date: "TOTAL",
        count: totalTransactions,
        amount: `$${totalRevenue.toFixed(2)}`,
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
    worksheet.addRow(["Purpose:", "Attendance"]);

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_datewise_${startDate}_to_${endDate}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
};
