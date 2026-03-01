import React from "react";

const TransactionTableRow = ({ transaction, isSelected, onSelect }) => {
  const amount = parseFloat(transaction.amount || 0);
  const isPaid = amount > 0;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(transaction.id)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
      </td>
      <td className="px-4 py-3 font-medium">{transaction.id}</td>
      <td className="px-4 py-3 font-semibold text-gray-800">
        {transaction.email}
      </td>
      <td className="px-4 py-3">
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded block max-w-xs truncate">
          {transaction.shopName}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`font-bold ${isPaid ? "text-green-600" : "text-gray-400"}`}
        >
          ${amount.toFixed(2)}
        </span>
      </td>
      <td className="px-4 py-3 uppercase text-gray-600">
        {transaction.currency}
      </td>
      <td className="px-4 py-3 text-gray-500">
        {new Date(transaction.paymentTime).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-gray-500">
        {new Date(transaction.paymentExpireTime).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isPaid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          {isPaid ? "Paid" : "Free"}
        </span>
      </td>
    </tr>
  );
};

export default TransactionTableRow;
