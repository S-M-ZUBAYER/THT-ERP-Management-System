import React, { useEffect, useState } from "react";

const ShippingDataTable = ({ formData, setFormData, shipCostTK, setShipCostTK, shipCostUSD, setShipCostUSD, transportPort, transportCountry, truckNo }) => {

    const handleFieldChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    useEffect(() => {

        setFormData((prevFormData) => ({
            ...prevFormData,
            containerNo: truckNo
        }));
    }, [truckNo]);



    // Update charges and calculate amounts
    const handleChargeChange = (index, field, value) => {
        const updatedCharges = [...formData.charges];
        updatedCharges[index][field] = field === "amountUSD" ? parseFloat(value) || 0 : value;
        if (field === "amountUSD") {
            updatedCharges[index]["amountBDT"] = (
                updatedCharges[index]["amountUSD"] * formData.exchangeRate
            ).toFixed(2);
        }
        setFormData({ ...formData, charges: updatedCharges });
    };

    // Add a new charge row
    const addNewChargeRow = (e) => {
        e.preventDefault();
        setFormData({
            ...formData,
            charges: [...formData.charges, { description: "", amountUSD: 0, amountBDT: 0 }],
        });
    };


    useEffect(() => {
        setFormData({
            ...formData, destination: `${transportPort}, ${transportCountry}`
        });
    }, [transportCountry, transportPort]);
    useEffect(() => {
        const totalUSD = formData.charges.reduce((acc, charge) => acc + parseFloat(charge.amountUSD || 0), 0).toFixed(2);
        setShipCostUSD(totalUSD);
    }, [formData.charges]);

    // UseEffect to calculate TK total
    useEffect(() => {
        const totalTK = formData.charges.reduce((acc, charge) => acc + parseFloat(charge.amountBDT || 0), 0).toFixed(2);
        setShipCostTK(totalTK);
    }, [formData.charges]);


    return (
        <div className="p-4">
            <h1 className="text-3xl underline font-bold mb-6 text-center text-gray-800">Sea Freight Shipping Details Form</h1>

            <div className="mb-4">
                <label className="block font-semibold mb-2">Sea Service Provider</label>
                <input
                    type="text"
                    name="seaServiceProvider"
                    value={formData.seaServiceProvider}
                    onChange={handleFieldChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter Sea Service Provider name"
                />
            </div>

            {/* Shipper and B/L NO Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-semibold">Shipper</label>
                    <input
                        type="text"
                        name="shipper"
                        value={formData.shipper}
                        onChange={handleFieldChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block font-semibold">B/L NO</label>
                    <input
                        type="text"
                        name="blNo"
                        value={formData.blNo}
                        onChange={handleFieldChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter B/L No"
                    />
                </div>
            </div>

            {/* Container, Destination, VSL/VOY, and ETD CGP Fields */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                    <label className="block font-semibold">Container No</label>
                    <input
                        type="text"
                        name="containerNo"
                        value={truckNo}
                        onChange={handleFieldChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter Container No"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block font-semibold">Destination</label>
                    <input
                        type="text"
                        name="destination"
                        value={`${transportPort}, ${transportCountry}`}
                        onClick={handleFieldChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter Destination"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block font-semibold">VSL/VOY</label>
                    <input
                        type="text"
                        name="vslVoy"
                        value={formData.vslVoy}
                        onChange={handleFieldChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter VSL/VOY"
                    />
                </div>
                <div>
                    <label className="block font-semibold">ETD</label>
                    <input
                        type="date"
                        name="etd"
                        value={formData.etd}
                        onChange={handleFieldChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter ETD"
                    />
                </div>
                <div>
                    <label className="block font-semibold">ETA</label>
                    <input
                        type="date"
                        name="eta"
                        value={formData.eta}
                        onChange={handleFieldChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter ETA"
                    />
                </div>

            </div>

            {/* Exchange Rate */}
            <div className="mb-4">
                <label className="block font-semibold">Exchange Rate (USD to BDT)</label>
                <input
                    type="number"
                    name="exchangeRate"
                    placeholder="Enter Exchange Rate"
                    value={formData.exchangeRate}
                    onChange={handleFieldChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {/* Charges Table with Add Row Feature */}
            <table className="min-w-full table-auto border-collapse border border-gray-300 mb-4">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border border-gray-300 p-2">Description</th>
                        <th className="border border-gray-300 p-2">Amount (USD)</th>
                        <th className="border border-gray-300 p-2">Amount (BDT)</th>
                        <th className="border border-gray-300 p-2"></th> {/* For delete action */}
                    </tr>
                </thead>
                <tbody>
                    {formData.charges.map((charge, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="text"
                                    value={charge.description}
                                    onChange={(e) => handleChargeChange(index, "description", e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Enter Description"
                                />
                            </td>
                            <td className="border border-gray-300 p-2">
                                <input
                                    type="number"
                                    value={charge.amountUSD}
                                    onChange={(e) => handleChargeChange(index, "amountUSD", e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </td>
                            <td className="border border-gray-300 p-2 text-right">{charge.amountBDT}</td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    className="bg-red-500 text-white p-1 rounded"
                                    onClick={() => {
                                        const updatedCharges = formData.charges.filter((_, i) => i !== index);
                                        setFormData({ ...formData, charges: updatedCharges });
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100">
                        <td className="border border-gray-300 p-2 font-bold">Total</td>
                        <td className="border border-gray-300 p-2 text-right font-bold">{shipCostUSD}</td>
                        <td className="border border-gray-300 p-2 text-right font-bold">{shipCostTK}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>

            <button
                className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-green-500 text-white font-bold hover:text-black p-2"
                onClick={addNewChargeRow}
            >
                Add New Row
            </button>
        </div>
    );
};

export default ShippingDataTable;
