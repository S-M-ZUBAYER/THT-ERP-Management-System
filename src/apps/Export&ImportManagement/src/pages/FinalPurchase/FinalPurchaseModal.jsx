import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from "react-icons/md";
import { toast } from 'react-toastify';

const FinalPurchaseModal = ({
    isOpen,
    selectedPurchase,
    setSelectedPurchase,
    handleChange,
    handleSave,
    closeModal,
}) => {

    const [editedProductInBoxesData, setEditedProductInBoxesData] = useState(selectedPurchase ? selectedPurchase?.purchaseProductInBoxes : []);
    const [serviceProvider, setServiceProvider] = useState([]);
    const [calculationData, setCalculationData] = useState([]);

    const fetchTradeServiceProvider = async () => {
        try {
            const response = await axios.get(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/trade_service"
            );
            setServiceProvider(response.data);
        } catch (error) {
            console.error("Failed to fetch data");
        }
    };

    const fetchProductCalculationData = async () => {
        try {
            const response = await axios.get(
                "https://grozziieget.zjweiting.com:3091/web-api-tht-1/product_in_box_calculation"
            );
            setCalculationData(response.data);
        } catch (error) {
            console.error("Failed to fetch data");
        }
    };

    useEffect(() => {
        fetchTradeServiceProvider();
        fetchProductCalculationData()
    }, []);

    useEffect(() => {
        if (calculationData.length > 0 && selectedPurchase?.purchaseProductInBoxes?.length > 0) {
            const originalData = [...selectedPurchase.purchaseProductInBoxes];
            const updatedData = [...editedProductInBoxesData];

            const mergedData = originalData.map((product, index) => {
                const hscode =
                    updatedData[index]?.hscode ||
                    calculationData.find((item) => item.productName === product.productName)?.hscode ||
                    product.hscode;

                const c_FUS =
                    parseFloat(calculationData.find((item) => item.productName === product.productName)?.fobus$) * product?.quantity

                const c_FUSD =
                    parseFloat(calculationData.find((item) => item.productName === product.productName)?.fobusd) * product?.quantity

                updatedData[index] = {
                    ...product,
                    hscode,
                    c_FUS,
                    c_FUSD,
                };

                return updatedData[index];
            });

            // Only update if mergedData has changed
            const hasChanges = JSON.stringify(mergedData) !== JSON.stringify(selectedPurchase.purchaseProductInBoxes);

            if (hasChanges) {
                setEditedProductInBoxesData(updatedData);
                setSelectedPurchase((prev) => ({
                    ...prev,
                    purchaseProductInBoxes: mergedData,
                }));
            }
        }
    }, [calculationData, selectedPurchase?.purchaseProductInBoxes]);


    if (!isOpen || !selectedPurchase) {
        return null;
    }
    // State to manage the edited values for each product



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-[1300px] w-full h-[90vh] overflow-y-auto">
                <div className="grid grid-cols-12 ">

                    <h2 className=" mb-4 text-center col-span-11 flex justify-center items-center text-3xl my-4 uppercase text-cyan-600 font-bold">Edit Purchase Details</h2>

                    <div className="flex justify-end">

                        <MdOutlineCancel className=" text-4xl font-bold text-red-400 hover:cursor-pointer" onClick={closeModal} />
                    </div>

                </div>
                {
                    selectedPurchase?.sendBackReasons
                    && <div className="py-4">
                        <h4 className="text-lg font-semibold mb-4">Send Back Reasons:</h4>
                        <div className="">
                            {selectedPurchase?.sendBackReasons?.split(",").map((reason, index) => (
                                <div
                                    key={index}
                                    className="bg-yellow-100 mb-2 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-lg shadow-sm w-full md:w-auto"
                                >
                                    <p className="font-medium text-sm">{index + 1}. {reason.trim()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                }

                {/* General Information */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block font-medium">Country</label>
                        <input
                            type="text"
                            name="transportCountryName"
                            value={selectedPurchase.transportCountryName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Port</label>
                        <input
                            type="text"
                            name="transportPort"
                            value={selectedPurchase.transportPort}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Shipment Way</label>
                        <input
                            type="text"
                            name="transportWay"
                            value={selectedPurchase.transportWay}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Invoice No</label>
                        <input
                            type="text"
                            name="invoiceNo"
                            value={selectedPurchase.invoiceNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Invoice Value(USD)</label>
                        <input
                            type="text"
                            name="total"
                            value={selectedPurchase.total}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Invoice Date</label>
                        <input
                            type="text"
                            name="invoiceDate"
                            value={selectedPurchase.invoiceDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">EP No</label>
                        <input
                            type="text"
                            name="epNo"
                            value={selectedPurchase.epNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Container No</label>
                        <input
                            type="text"
                            name="truckNo"
                            value={selectedPurchase.truckNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Zone</label>
                        <input
                            type="text"
                            name="zone"
                            value={selectedPurchase.zone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Port Of Loading</label>
                        <input
                            type="text"
                            name="loadfrom"
                            value={selectedPurchase.loadfrom}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Permit Till Date</label>
                        <input
                            type="text"
                            name="permitedDate"
                            value={selectedPurchase.permitedDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Export No</label>
                        <input
                            type="text"
                            name="expNo"
                            value={selectedPurchase.expNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Export Date</label>
                        <input
                            type="text"
                            name="expDate"
                            value={selectedPurchase.expDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">CM Value</label>
                        <input
                            type="text"
                            name="cmValue"
                            value={selectedPurchase.cmValue}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Consignee Name</label>
                        <input
                            type="text"
                            name="consigneeName"
                            value={selectedPurchase.consigneeName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Consignee Address</label>
                        <input
                            type="text"
                            name="consigneeAddress"
                            value={selectedPurchase.consigneeAddress}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Bank Name</label>
                        <input
                            type="text"
                            name="bankName"
                            value={selectedPurchase.bankName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">LC/No./TT/P.S/SC/CMT</label>
                        <input
                            type="text"
                            name="sccmt"
                            value={selectedPurchase.sccmt}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Enterprise Employee</label>
                        <input
                            type="text"
                            name="enterpriseEmp"
                            value={selectedPurchase.enterpriseEmp}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Verifying Officer</label>
                        <input
                            type="text"
                            name="verifyingEmp"
                            value={selectedPurchase.verifyingEmp}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Permit Officer</label>
                        <input
                            type="text"
                            name="permitEmp"
                            value={selectedPurchase.permitEmp}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Total Box Weight</label>
                        <input
                            type="number"
                            name="allTotalBoxWeight"
                            value={selectedPurchase.allTotalBoxWeight}
                            onChange={handleChange}
                            readOnly
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>

                </div>
                {/* Particular Expense Names */}
                <h3 className="text-xl font-bold mb-4 text-center underline"><span>{selectedPurchase?.traderServiceProvider}</span> Particular Expenses</h3>

                {/* <div>
                    <label className="block font-medium">Trade Service Provider</label>
                    <input
                        type="text"
                        name="traderServiceProvider"
                        value={selectedPurchase.traderServiceProvider}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div> */}
                <div>
                    <label className="block font-medium">Trade Service Provider</label>
                    <select
                        name="traderServiceProvider"
                        value={selectedPurchase.traderServiceProvider}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    >
                        {serviceProvider.map((provider, index) => (
                            <option key={index} value={provider.name}>
                                {provider.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block font-medium">Net Weight</label>
                        <input
                            type="number"
                            name="netWeight"
                            value={selectedPurchase.netWeight}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Gross Weight</label>
                        <input
                            type="number"
                            name="grossWeight"
                            value={selectedPurchase.grossWeight}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                </div>

                <table className="min-w-full bg-white mb-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">Date</th>
                            <th className="py-2 px-4">Expense Name</th>
                            <th className="py-2 px-4">Remark</th>
                            <th className="py-2 px-4">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPurchase.particularExpenseNames.map((expense, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-4">{expense.date}</td>
                                <td className="py-2 px-4">{expense.particularExpenseName}</td>
                                <td className="py-2 px-4">{expense.remark}</td>
                                <td className="py-2 px-4">{expense.particularExpenseCost}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-semibold text-gray-700">
                            <td colspan="3" className="py-2 px-4 text-left">Total Amount</td>
                            <td className="py-2 px-4">{selectedPurchase.totalCost}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Purchase Product in Boxes */}
                <h3 className="text-xl font-bold mb-4 text-center underline">Products In Boxes</h3>
                {/* <table className="min-w-full bg-white mb-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">Product Name</th>
                            <th className="py-2 px-4">Model</th>
                            <th className="py-2 px-4">Quantity</th>
                            <th className="py-2 px-4">Truck No</th>
                            <th className="py-2 px-4">Pallet No</th>
                            <th className="py-2 px-4">Total Box</th>
                            <th className="py-2 px-4">Box weight</th>
                            <th className="py-2 px-4">Total weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPurchase.purchaseProductInBoxes.map((product, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-4">{product.productName}</td>
                                <td className="py-2 px-4">{product.productModel}</td>
                                <td className="py-2 px-4">{product.quantity}</td>
                                <td className="py-2 px-4">{product.truckNumber}</td>
                                <td className="py-2 px-4">{product.totalPallet}</td>
                                <td className="py-2 px-4">{product.totalBox}</td>
                                <td className="py-2 px-4">{product.weightPerBox}</td>
                                <td className="py-2 px-4">{product.individualTotalBoxWeight}</td>
                            </tr>
                        ))}
                    </tbody>
                </table> */}

                <table className="min-w-full bg-white mb-6">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-1">HS Code</th>
                            <th className="py-2 px-1">Product Name</th>
                            <th className="py-2 px-1">Model</th>
                            <th className="py-2 px-1">Quantity</th>
                            <th className="py-2 px-1">Truck No</th>
                            <th className="py-2 px-1">Pallet No</th>
                            <th className="py-2 px-1">Total Box</th>
                            <th className="py-2 px-1">Box weight</th>
                            <th className="py-2 px-1">Total weight</th>
                            <th className="py-2 px-1">FOB/CIF/
                                CFR/C&F(US$)</th>
                            <th className="py-2 px-1">FOB/CIF/
                                CFR/C&F(USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPurchase.purchaseProductInBoxes && selectedPurchase.purchaseProductInBoxes.map((product, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-1">
                                    <input
                                        type="text"
                                        value={editedProductInBoxesData[index]?.hscode ||
                                            calculationData.find((item) => item.productName === product.productName)?.hscode ||
                                            product.hscode}
                                        placeholder="HS Code"
                                        className="border-2 rounded px-1 w-36 min-h-12"
                                        readOnly
                                    />
                                </td>


                                <td className="py-2 px-1">{product.productName}</td>
                                <td className="py-2 px-1">{product.productModel}</td>
                                <td className="py-2 px-1">{product.quantity}</td>
                                <td className="py-2 px-1">{product.truckNumber}</td>
                                <td className="py-2 px-1">{product.totalPallet}</td>
                                <td className="py-2 px-1">{product.totalBox}</td>
                                <td className="py-2 px-1">{product.weightPerBox}</td>
                                <td className="py-2 px-1">{product.individualTotalBoxWeight}</td>
                                <td className="py-2 px-1">
                                    <td className="py-2 px-1">
                                        <input
                                            type="text"
                                            value={
                                                parseFloat((calculationData.find((item) => item.productName === product.productName)?.fobus$ || 0) * product.quantity)
                                            }
                                            className="border-2 rounded px-1 w-36 min-h-12"
                                            readOnly
                                        />
                                    </td>
                                    <td className="py-2 px-1">
                                        <input
                                            type="text"
                                            value={

                                                parseFloat((calculationData.find((item) => item.productName === product.productName)?.fobusd || 0) * product.quantity)
                                            }
                                            className="border-2 rounded px-1 w-36 min-h-12"
                                            readOnly
                                        />
                                    </td>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-semibold text-gray-700">
                            <td colSpan="8" className="py-2 px-4 text-left">All Total Weight</td>
                            <td className="py-2 px-4 text-start">{selectedPurchase.allTotalBoxWeight}</td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                        </tr>
                    </tfoot>
                </table>

                {/* Container Expense Names */}
                <h3 className="text-xl font-bold mb-4 text-center underline"><span>{selectedPurchase?.containerServiceProvider}</span> CARRIER SERVICE</h3>
                <table className="min-w-full bg-white mb-6 shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-left text-gray-700 font-semibold">
                            <th className="py-2 px-4">S/L No</th>
                            <th className="py-2 px-4">Date</th>
                            <th className="py-2 px-4">Container No</th>
                            <th className="py-2 px-4">Container T/S</th>
                            <th className="py-2 px-4">Invoice No</th>
                            <th className="py-2 px-4">EP NO</th>
                            <th className="py-2 px-4">Fare Amount</th>
                            <th className="py-2 px-4">Ait/Vat 5%</th>
                            <th className="py-2 px-4">Total Amount/TK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPurchase.containerExpenseNames.map((container, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100">
                                <td className="py-2 px-4">{container.slNo}</td>
                                <td className="py-2 px-4">{container.date}</td>
                                <td className="py-2 px-4">{container.containerNo}</td>
                                <td className="py-2 px-4">{container.containerTypeSize}</td>
                                <td className="py-2 px-4">{container.invoiceNo}</td>
                                <td className="py-2 px-4">{container.epNumber}</td>
                                <td className="py-2 px-4">{container.fareAmount}</td>
                                <td className="py-2 px-4">{container.aitVat}</td>
                                <td className="py-2 px-4">{container.individualTotalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-semibold text-gray-700">
                            <td colspan="6" className="py-2 px-4 text-left">Gross Total Amount</td>
                            <td className="py-2 px-4">{selectedPurchase.totalFareAmount}</td>
                            <td className="py-2 px-4">{selectedPurchase.totalAitVat}</td>
                            <td className="py-2 px-4">{selectedPurchase.totalCarrierAmount}</td>
                        </tr>
                    </tfoot>
                </table>


                {/* Ocean info */}
                <h3 className="text-xl font-bold mb-4 text-center underline"><span>{selectedPurchase.seaServiceProvider}</span> FREIGHT SERVICE</h3>
                <div>
                    <label className="block font-medium">Shipper</label>
                    <input
                        type="text"
                        name="shipper"
                        value={selectedPurchase.shipper}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">

                    <div>
                        <label className="block font-medium">B/L No </label>
                        <input
                            type="text"
                            name="blNo"
                            value={selectedPurchase.blNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Container No </label>
                        <input
                            type="text"
                            name="containerNo"
                            value={selectedPurchase.containerNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Destination</label>
                        <input
                            type="text"
                            name="destination"
                            value={selectedPurchase.destination}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">VSL/VOY</label>
                        <input
                            type="text"
                            name="vslVoy"
                            value={selectedPurchase.vslVoy}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">ETD</label>
                        <input
                            type="text"
                            name="etd"
                            value={selectedPurchase.etd}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">ETA</label>
                        <input
                            type="text"
                            name="eta"
                            value={selectedPurchase.eta}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Sea Exchange Rate</label>
                        <input
                            type="number"
                            name="exchangeRate"
                            value={selectedPurchase.exchangeRate}
                            onChange={handleChange}
                            readOnly
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                </div>
                <table class="min-w-full border-collapse border border-gray-300 shadow-lg my-5">
                    <thead class="bg-blue-100">
                        <tr>
                            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount (USD)</th>
                            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount (TK)</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {selectedPurchase.chargesList.length > 0 && selectedPurchase.chargesList.map((charge, index) => (
                            <tr key={charge.id} class={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                                <td class="border border-gray-300 px-6 py-4 text-sm text-gray-900">{charge.id}</td>
                                <td class="border border-gray-300 px-6 py-4 text-sm text-gray-900">{charge.description}</td>
                                <td class="border border-gray-300 px-6 py-4 text-sm text-gray-900">{charge.amountUSD}</td>
                                <td class="border border-gray-300 px-6 py-4 text-sm text-gray-900">{charge.amountBDT}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr class="bg-blue-100 font-semibold text-gray-700">
                            <td colspan="2" class="border border-gray-300 px-6 py-4 text-left">Total</td>
                            <td class="border border-gray-300 px-6 py-4">{selectedPurchase.totalAmountUSD} USD</td>
                            <td class="border border-gray-300 px-6 py-4">{selectedPurchase.totalAmountBDT} TK</td>
                        </tr>
                    </tfoot>
                </table>
                {/* Footer Actions */}
                <div className="flex justify-end">
                    <button
                        onClick={closeModal}
                        className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinalPurchaseModal;
