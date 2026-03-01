import React from "react";
import { calculateTotalRevenue } from "../TransactionPaymentUtils/transactionHelpers";

const TransactionStats = ({ transactions, platform }) => {
  const totalRevenue = calculateTotalRevenue(transactions);
  const paidTransactions = transactions.filter(
    (t) => parseFloat(t.amount) > 0,
  ).length;
  const freeTransactions = transactions.length - paidTransactions;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
        <p className="text-2xl font-bold text-gray-800">
          {transactions.length}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
        <p className="text-2xl font-bold text-green-600">
          ${totalRevenue.toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Paid Transactions</p>
        <p className="text-2xl font-bold text-blue-600">{paidTransactions}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Free Transactions</p>
        <p className="text-2xl font-bold text-gray-600">{freeTransactions}</p>
      </div>
    </div>
  );
};

export default TransactionStats;
