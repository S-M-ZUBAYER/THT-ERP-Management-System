import React, { useEffect, useState } from "react";

const CarrierTableData = ({
    rows, setRows, setContainerServiceProvider, containerServiceProvider, totalFareAmount, setTotalFareAmount, totalAitVat, setTotalAitVat, totalCarrierAmount, setTotalCarrierAmount, invoiceNo, truckNo, ipNo }) => {

    // Function to add a new row
    const addRow = (e) => {
        e.preventDefault();
        const newRow = {
            slNo: rows.length + 1,
            date: "",
            containerNo: "",
            containerTypeSize: "",
            invoiceNo: "",
            epNumber: "",
            fareAmount: 0,
            aitVat: 0,
            individualTotalAmount: 0,
        };
        setRows([...rows, newRow]);
    };

    // Function to handle input change and update the state
    const handleInputChange = (index, field, value) => {

        const updatedRows = [...rows];

        if (field !== "fareAmount") {
            updatedRows[index][field] = value;
        }


        // Calculate the VAT (5%) and total amount dynamically
        else if (field === "fareAmount") {
            updatedRows[index][field] = parseFloat(value);
            const fareAmount = parseFloat(value) || 0;
            const vat = fareAmount * 0.05; // Assuming VAT is 5%
            const individualTotalAmount = fareAmount + vat;
            updatedRows[index]["aitVat"] = parseFloat(vat.toFixed(2));
            updatedRows[index]["individualTotalAmount"] = parseFloat(individualTotalAmount.toFixed(2));
        }

        setRows(updatedRows);
    };

    // // Calculate total fare, vat, and total amount across all rows
    // const calculateGrandTotal = (field) => {
    //     return rows.reduce((acc, row) => acc + parseFloat(row[field] || 0), 0).toFixed(2);
    // };
    const handleContainerServiceProviderChange = (e) => {
        const service = e.target.value;
        setContainerServiceProvider(service);
    }

    const calculateGrandTotal = (field) => {
        return rows.reduce((acc, item) => acc + parseFloat(item[field] || 0), 0).toFixed(2);
    };

    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
        setRows(updatedRows); // Update the state with the new rows array
    };


    // useEffect to calculate totals when the ContainerExpenseNames changes
    useEffect(() => {
        setTotalFareAmount(calculateGrandTotal('fareAmount'));
        setTotalAitVat(calculateGrandTotal('aitVat'));
        setTotalCarrierAmount(calculateGrandTotal('individualTotalAmount'));
    }, [rows]);

    return (
        <div className="p-4">
            <h1 className="text-3xl underline font-bold mb-6 text-center text-gray-800">Container Carrier Service Details Form</h1>
            <div className="mb-4">
                <label className="block font-semibold mb-2">Container Carrier Service Provider</label>
                <input
                    type="text"
                    name="containerCarrier"
                    value={containerServiceProvider}
                    onChange={handleContainerServiceProviderChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter Container Carrier Service Provider"
                />
            </div>
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">S/L No</th>
                        <th className="border border-gray-300 p-2">Date</th>
                        <th className="border border-gray-300 p-2">Container No</th>
                        <th className="border border-gray-300 p-2">Container Type/Size</th>
                        <th className="border border-gray-300 p-2">Invoice No</th>
                        <th className="border border-gray-300 p-2">EP Number</th>
                        <th className="border border-gray-300 p-2">Fare Amount</th>
                        <th className="border border-gray-300 p-2">AIT/VAT (5%)</th>
                        <th className="border border-gray-300 p-2">Total Amount/Taka</th>
                        <th className="border border-gray-300 p-2">Actions</th> {/* Added column for actions */}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2 text-center">{row.slNo}</td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.date}
                                    onChange={(e) => handleInputChange(index, "date", e.target.value)}
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.containerNo}
                                    onChange={(e) => handleInputChange(index, "containerNo", truckNo)}
                                    placeholder="Container No"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.containerTypeSize}
                                    onChange={(e) => handleInputChange(index, "containerTypeSize", e.target.value)}
                                    placeholder="Container Type/Size"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.invoiceNo}
                                    onChange={(e) => handleInputChange(index, "invoiceNo", invoiceNo)}
                                    placeholder="Invoice No"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.epNumber}
                                    onChange={(e) => handleInputChange(index, "epNumber", ipNo)}
                                    placeholder="EP Number"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={row.fareAmount}
                                    onChange={(e) => handleInputChange(index, "fareAmount", e.target.value)}
                                    placeholder="Fare Amount"
                                />
                            </td>
                            <td className="border border-gray-300 p-2 text-right">{row.aitVat}</td>
                            <td className="border border-gray-300 p-2 text-right">{row.individualTotalAmount}</td>
                            <td className="border border-gray-300 p-2 text-center">
                                <button
                                    className="bg-red-500 text-white px-4 py-1 rounded"
                                    onClick={() => handleDeleteRow(index)} // Delete button with event
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100">
                        <td className="border border-gray-300 p-2 text-center" colSpan={6}>Gross Total Amount</td>
                        <td className="border border-gray-300 p-2 text-right">
                            {totalFareAmount}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                            {totalAitVat}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                            {totalCarrierAmount}
                        </td>
                    </tr>
                </tfoot>
            </table>


            <button
                className="mt-4 p-2 btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-green-500 text-white font-bold hover:text-black"
                onClick={addRow}
            >
                Add New Row
            </button>
        </div>
    );
};

export default CarrierTableData;
