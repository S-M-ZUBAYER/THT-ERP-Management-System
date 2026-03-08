export const filterAttendanceByDateRange = (records, startDate, endDate) => {
    const startDateObj = new Date(startDate + "T00:00:00");
    const endDateObj = new Date(endDate + "T23:59:59.999");

    return records.filter((record) => {
        const paymentDate = new Date(record.paymentTime);
        return paymentDate >= startDateObj && paymentDate <= endDateObj;
    });
};

export const groupAttendanceByDate = (records) => {
    const recordsByDate = {};

    records.forEach((record) => {
        const paymentDate = new Date(record.paymentTime);
        const dateKey = paymentDate.toLocaleDateString("en-CA");
        if (!recordsByDate[dateKey]) {
            recordsByDate[dateKey] = {
                count: 0,
                totalAmount: 0,
                records: []
            };
        }
        recordsByDate[dateKey].count++;
        recordsByDate[dateKey].totalAmount += parseFloat(record.amount || 0);
        recordsByDate[dateKey].records.push(record);
    });

    return recordsByDate;
};

export const calculateAttendanceRevenue = (records) => {
    return records.reduce((sum, record) => {
        return sum + parseFloat(record.amount || 0);
    }, 0);
};
