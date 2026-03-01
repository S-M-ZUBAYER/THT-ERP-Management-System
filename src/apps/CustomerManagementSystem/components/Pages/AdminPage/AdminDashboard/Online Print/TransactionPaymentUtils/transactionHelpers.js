export const filterTransactionsByDateRange = (transactions, startDate, endDate) => {
    const startDateObj = new Date(startDate + "T00:00:00");
    const endDateObj = new Date(endDate + "T23:59:59.999");

    return transactions.filter((transaction) => {
        const paymentDate = new Date(transaction.paymentTime);
        return paymentDate >= startDateObj && paymentDate <= endDateObj;
    });
};

export const groupTransactionsByDate = (transactions) => {
    const transactionsByDate = {};

    transactions.forEach((transaction) => {
        const paymentDate = new Date(transaction.paymentTime);
        const dateKey = paymentDate.toLocaleDateString("en-CA"); // YYYY-MM-DD format
        if (!transactionsByDate[dateKey]) {
            transactionsByDate[dateKey] = {
                count: 0,
                totalAmount: 0,
                transactions: []
            };
        }
        transactionsByDate[dateKey].count++;
        transactionsByDate[dateKey].totalAmount += parseFloat(transaction.amount || 0);
        transactionsByDate[dateKey].transactions.push(transaction);
    });

    return transactionsByDate;
};

export const calculateTotalRevenue = (transactions) => {
    return transactions.reduce((sum, transaction) => {
        return sum + parseFloat(transaction.amount || 0);
    }, 0);
};