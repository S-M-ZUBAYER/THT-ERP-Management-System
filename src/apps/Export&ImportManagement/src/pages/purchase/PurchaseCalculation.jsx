import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarrierTableData from "./CarrierTableData";
import ShippingDataTable from "./ShippingDataTable";

const ExpensesForm = ({ handleToFinalSave, btnLoading, expenses, onExpenseSave, onTotalCostChange, rows, setRows, containerServiceProvider, setContainerServiceProvider, formData, setFormData, shipCostTK, setShipCostTK, shipCostUSD, setShipCostUSD, totalFareAmount, setTotalFareAmount, totalAitVat, setTotalAitVat, totalCarrierAmount, setTotalCarrierAmount, selectedExpensesList, setSelectedExpensesList, ipNo, invoiceNo, truckNo, transportCountry, transportPort }) => {
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [dates, setDates] = useState({});

  const handleSave = () => {
    const selectedExpenseData = selectedExpenses.map((id) => {
      const expense = expenses.find((expense) => expense.id === Number(id));
      return {
        id: expense.id,
        particularExpenseName: expense.particularExpenseName,
        particularExpenseCost: expense.particularExpenseCost,
        remark: remarks[id] || "",
        date: dates[id] || "",
      };
    });
    onExpenseSave(selectedExpenseData);
  };

  useEffect(() => {
    handleSave();
    const totalCost = selectedExpenses
      .reduce((total, id) => {
        const expense = expenses.find((expense) => expense.id === Number(id));
        return total + parseFloat(expense.particularExpenseCost);
      }, 0)
      .toFixed(2);

    onTotalCostChange(totalCost);
  }, [selectedExpenses, remarks, dates]);

  const handleCheckboxChange = (event) => {
    const expenseId = event.target.value;
    const isChecked = event.target.checked;

    setSelectedExpenses((prevState) => {
      if (isChecked) {
        return [...prevState, expenseId];
      } else {
        return prevState.filter((id) => id !== expenseId);
      }
    });
  };

  const handleRemarkChange = (event, expenseId) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [expenseId]: event.target.value,
    }));
  };

  const handleDateChange = (event, expenseId) => {
    setDates((prevDates) => ({
      ...prevDates,
      [expenseId]: event.target.value,
    }));
  };

  const totalCost = selectedExpenses
    .reduce((total, id) => {
      const expense = expenses.find((expense) => expense.id === Number(id));
      return total + parseFloat(expense.particularExpenseCost);
    }, 0)
    .toFixed(2);
  onTotalCostChange(totalCost);



  return (
    <div className="p-4">
      <div className=" overflow-x-auto add__scrollbar">
        {expenses.map((expense) => (
          <div key={expense.id} className="mb-4 grid grid-cols-4 gap-3">
            <label className="mb-2 flex items-center font-bold">
              <input
                type="checkbox"
                value={expense.id}
                checked={selectedExpenses.includes(String(expense.id))}
                onChange={handleCheckboxChange}
                className="mr-2 checkbox checkbox-info"
              />
              {expense.particularExpenseName}
            </label>
            <input
              type="text"
              className="border p-1 mb-2 mr-2"
              placeholder="Cost"
              readOnly
              value={expense.particularExpenseCost}
            />
            <input
              type="text"
              className="border p-1 mb-2  mr-2"
              placeholder="Remark"
              value={remarks[expense.id] || ""}
              onChange={(e) => handleRemarkChange(e, expense.id)}
            />
            <input
              type="date"
              className="border p-1"
              value={dates[expense.id] || ""}
              onChange={(e) => handleDateChange(e, expense.id)}
            />
          </div>
        ))}
        <div className="font-bold text-2xl text-center text-sky-400 mt-10">
          Total Cost(TK): {totalCost}
        </div>
      </div>

      <CarrierTableData
        rows={rows}
        setRows={setRows}
        containerServiceProvider={containerServiceProvider}
        setContainerServiceProvider={setContainerServiceProvider}
        totalFareAmount={totalFareAmount}
        setTotalFareAmount={setTotalFareAmount}
        totalAitVat={totalAitVat}
        setTotalAitVat={setTotalAitVat}
        totalCarrierAmount={totalCarrierAmount}
        setTotalCarrierAmount={setTotalCarrierAmount}
        ipNo={ipNo}
        invoiceNo={invoiceNo}
        truckNo={truckNo}
      ></CarrierTableData>


      <ShippingDataTable
        formData={formData}
        setFormData={setFormData}
        shipCostTK={shipCostTK}
        setShipCostTK={setShipCostTK}
        shipCostUSD={shipCostUSD}
        setShipCostUSD={setShipCostUSD}
        transportCountry={transportCountry}
        transportPort={transportPort}
        truckNo={truckNo}
      ></ShippingDataTable>

      {/* button */}
      <div className="my-6 flex justify-end">
        <button
          onClick={handleToFinalSave}
          className="mr-2 btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
        >
          {btnLoading ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ExpensesForm;
