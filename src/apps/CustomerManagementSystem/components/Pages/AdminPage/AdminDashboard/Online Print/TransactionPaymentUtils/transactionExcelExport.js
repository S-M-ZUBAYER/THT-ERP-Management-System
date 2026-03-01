import ExcelJS from "exceljs";
import { TRANSACTION_PLATFORM_STYLES } from "./transactionConstants";
import { groupTransactionsByDate, calculateTotalRevenue } from "./transactionHelpers";

export const exportAllTransactionsToExcel = async (transactions, platform) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${platform.toUpperCase()} Transactions`);

    // Define columns
    worksheet.columns = [
        { header: "Email", key: "email", width: 40 },
        { header: "Shop Name", key: "shopName", width: 35 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Currency", key: "currency", width: 12 },
        { header: "Payment Time", key: "paymentTime", width: 30 },
        { header: "Expire Time", key: "expireTime", width: 30 },
        { header: "Create Time", key: "createTime", width: 30 },
    ];

    // Get platform styles
    const style = TRANSACTION_PLATFORM_STYLES.header[platform] || {
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

    // Add data rows
    transactions.forEach((transaction) => {
        worksheet.addRow({
            email: transaction.email,
            shopName: transaction.shopName,
            amount: parseFloat(transaction.amount).toFixed(2),
            currency: transaction.currency.toUpperCase(),
            paymentTime: new Date(transaction.paymentTime).toLocaleString(),
            expireTime: new Date(transaction.paymentExpireTime).toLocaleString(),
            createTime: new Date(transaction.createTime).toLocaleString(),
        });
    });

    // Calculate totals
    const totalRevenue = calculateTotalRevenue(transactions);

    // Add summary section
    worksheet.addRow([]);
    const summaryRow = worksheet.addRow(["SUMMARY", "", "", "", "", "", "", ""]);
    worksheet.addRow(["Total Transactions", transactions.length, "", "", "", "", "", ""]);
    worksheet.addRow(["Total Revenue", `$${totalRevenue.toFixed(2)}`, "", "", "", "", "", ""]);

    const summaryStyle = TRANSACTION_PLATFORM_STYLES.summary[platform] || {
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

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${platform}_all_transactions_${new Date().toISOString().split("T")[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
};

export const exportDatewiseTransactionsToExcel = async (transactions, platform, startDate, endDate) => {
    const transactionsByDate = groupTransactionsByDate(transactions);

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
        fgColor: { argb: "FFDDEBF7" },
    };

    // Sort and add date rows
    const sortedDates = Object.keys(transactionsByDate).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach((dateKey) => {
        const date = new Date(dateKey);
        const dayData = transactionsByDate[dateKey];
        worksheet.addRow({
            date: date.toLocaleDateString(),
            count: dayData.count,
            amount: `$${dayData.totalAmount.toFixed(2)}`,
        });
    });

    // Add totals
    const totalTransactions = transactions.length;
    const totalRevenue = calculateTotalRevenue(transactions);

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
    worksheet.addRow(["Platform:", platform.toUpperCase()]);

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${platform}_datewise_transactions_${startDate}_to_${endDate}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
};