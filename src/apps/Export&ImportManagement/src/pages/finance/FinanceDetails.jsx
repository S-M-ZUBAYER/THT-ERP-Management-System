import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../components/context/authContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import MultipleImageUpload from './MultipleImageUpload';

const FinanceDetails = () => {

    const { financeDetailsData, setFinanceDetailsData } = useContext(UserContext);
    const [invoiceValue, setInvoiceValue] = useState(0);
    const [newCfLevel, setNewCfLevel] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState('');
    const navigate = useNavigate();


    // Fetch C&F Levels on component mount
    const [serviceProvider, setServiceProvider] = useState([]);
    const [selectedServiceProvider, setSelectedServiceProvider] = useState({});
    const [selectedImage, setSelectedImage] = useState(null); // For modal

    const openModal = (image) => {
        setSelectedImage(image); // Set the clicked image in modal
    };

    const closeModal = () => {
        setSelectedImage(null); // Close the modal
    };
    useEffect(() => {
        const fetchTradeServiceProvider = async () => {
            try {
                // Fetch trade service provider data from the API
                const response = await axios.get(
                    "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/trade_service"
                );

                // Set service provider data
                setServiceProvider(response.data);

                // Find the provider that matches the traderServiceProvider in financeDetailsData
                const provider = response.data.find(
                    (data) => data.name = financeDetailsData.traderServiceProvider
                );
                // Set the selected service provider if found
                if (provider) {
                    setSelectedServiceProvider(provider);
                } else {
                    toast.error("No matching service provider found");
                }

            } catch (error) {
                console.error("Error fetching trade service provider data:", error);
            }
        };

        fetchTradeServiceProvider();
    }, [financeDetailsData.traderServiceProvider]);



    const handleToReject = () => {
        const confirmReject = window.confirm("Are you sure you want to reject this export information?");

        if (confirmReject) {
            axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
                .then(response => {
                    // Find the purchase matching the invoice number from financeDetailsData
                    const finalPurchases = response.data.find(
                        (purchase) => purchase.invoiceNo === financeDetailsData.invoiceNo
                    );

                    if (!finalPurchases) {
                        toast.error('No purchase found for this invoice number!');
                        return Promise.reject('No matching purchase found');
                    }

                    // Create rejected data with the updated status
                    let rejectedData = {
                        ...finalPurchases,
                        status: "purchase",
                        sendBackReasons: reason
                    };

                    // Update the purchase data by making a PUT request
                    return axios.put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase', rejectedData);
                })
                .then(() => {
                    toast.warn('Data rejected from finance successfully!');

                    // Only proceed to delete after PUT request is successful
                    return axios.delete(`https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance/${financeDetailsData.id}`);
                })
                .then(() => {
                    toast.warn('Finance data deleted successfully!');
                    setShowModal(false);
                    navigate("/finance");
                })
                .catch(error => {
                    console.error('Error during rejection process:', error);
                    toast.error('An error occurred during the rejection or deletion process. Please try again.');
                });
        }
    };




    useEffect(() => {
        if (financeDetailsData.tradeExchangeRate) {
            setInvoiceValue(financeDetailsData.tradeExchangeRate * financeDetailsData.total)
        }
    }, [])



    // Function to handle update logic
    const handleUpdate = () => {
        const confirmAccept = window.confirm(
            "Are you sure, you want to Accept as final Data?"
        );
        if (confirmAccept) {
            // // Fetch the purchase data
            // axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
            //     .then(response => {

            //         // Find the purchase matching the invoice number
            //         const deletePurchases = response.data.find(
            //             (purchase) => purchase.invoiceNo === financeDetailsData.invoiceNo
            //         );

            //         if (!deletePurchases) {
            //             toast.error('No purchase found for this invoice number!');
            //             return;
            //         }

            //         // Delete the purchase entry
            //         return axios.delete(`https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase/${deletePurchases.id}`);
            //     })
            //     .then(() => {
            //         toast.warn('Purchase data deleted successfully!');
            //     })
            //     .catch(error => {
            //         console.error('Error during the update process:', error);
            //         toast.error('Failed to accept by finance or delete purchase!');
            //     });

            // Create a copy of financeDetailsData with updated fields
            if (!financeDetailsData.tradeExpanseStatus || !financeDetailsData.seaExpanseStatus || !financeDetailsData.carrierExpanseStatus) {
                toast.error("All Payment are not paid at all. Please payment first");
                return;

            }

            let AcceptedData = {
                ...financeDetailsData, // Copy all properties of financeDetailsData
                status: "finalData",
                finalStatus: "finalData",

            };

            console.log(AcceptedData, "accepted data");


            // Save updated finance data to the API
            axios.post('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', AcceptedData)
                .then(response => {
                    toast.success('Accepted by finance successfully!');

                    // Fetch the purchase data
                    return axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase');
                })
                .then(response => {

                    // Find the purchase matching the invoice number
                    const deletePurchases = response.data.find(
                        (purchase) => purchase.invoiceNo === AcceptedData.invoiceNo
                    );

                    if (!deletePurchases) {
                        toast.error('No purchase found for this invoice number!');
                        return;
                    }

                    // Delete the purchase entry
                    return axios.delete(`https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase/${deletePurchases.id}`);
                })
                .then(() => {
                    toast.warn('Purchase data deleted successfully!');
                })
                .catch(error => {
                    console.error('Error during the update process:', error);
                    toast.error('Failed to accept by finance or delete purchase!');
                });
        }

    };


    const [isDateInputVisible, setDateInputVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [tradeExchangeRate, setTradeExchangeRate] = useState('');
    const [isTradeRateInputVisible, setTradeRateInputVisible] = useState(false);

    const handleToTradePay = () => {

        const confirmTradePay = window.confirm(
            "Are you sure, you want to Confirm the trade pay"
        );

        if (confirmTradePay) {
            if (financeDetailsData.tradeExpanseStatus) {
                toast.warn("Already Paid Trade Payment");
                return;
            }

            if (!tradeExchangeRate) {
                toast.error("Please input Trade Exchange Rate before proceeding.");
                return;
            }

            // Basic trade pay data with exchange rate
            let tradePayData = {
                ...financeDetailsData, // Copy all properties of financeDetailsData
                status: "finance",
                tradeExpanseStatus: true,
                candF: parseFloat(newCfLevel),
                tradeExpanseDate: selectedDate,
                tradeExchangeRate: tradeExchangeRate, // Add trade exchange rate
            };

            if (financeDetailsData.seaExpanseStatus && financeDetailsData.carrierExpanseStatus) {
                // Final trade pay data when both conditions are true
                let finalTradePayData = {
                    ...financeDetailsData,
                    status: "finance",
                    finalStatus: "Complete",
                    candF: parseFloat(newCfLevel),
                    tradeExpanseStatus: true,
                    tradeExpanseDate: selectedDate,
                    tradeExchangeRate: tradeExchangeRate, // Add trade exchange rate
                };

                axios
                    .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', finalTradePayData)
                    .then(response => {
                        toast.success('Trade by finance successfully!');
                        setFinanceDetailsData(finalTradePayData);
                    })
                    .catch(error => {
                        toast.error('Error occurred while processing the trade.');
                        console.error(error);
                    });
            } else if (financeDetailsData.seaExpanseStatus || financeDetailsData.carrierExpanseStatus) {
                // Save the updated data to the API when one of the conditions is true
                axios
                    .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', tradePayData)
                    .then(response => {
                        toast.success('Trade by finance successfully!');
                        setFinanceDetailsData(tradePayData);
                    })
                    .catch(error => {
                        toast.error('Error occurred while processing the trade.');
                        console.error(error);
                    });
            } else {
                // If neither of the conditions is true, create a new entry via POST
                axios
                    .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', tradePayData)
                    .then(response => {
                        toast.success('Trade by finance successfully!');
                        setFinanceDetailsData(tradePayData);
                    })
                    .catch(error => {
                        toast.error('Error occurred while processing the trade.');
                        console.error(error);
                    });
            }
        }
    };

    const handleToShippingPay = () => {
        const confirmShippingPay = window.confirm(
            "Are you sure, you want to Confirm the shipping pay"
        );
        if (confirmShippingPay) {
            if (financeDetailsData.seaExpanseStatus) {
                toast.warn("Already Paid Sea Payment");
                return;
            }

            if (!selectedDate) {
                toast.error("Please select a date before proceeding.");
                return;
            }

            let ShippingPayData = {
                ...financeDetailsData,
                seaExpanseStatus: true,
                seaExpanseDate: selectedDate // Add the selected date here
            };

            if (financeDetailsData.tradeExpanseStatus && financeDetailsData.carrierExpanseStatus) {
                let finalShippingPayData = {
                    ...financeDetailsData,
                    status: "finance",
                    finalStatus: "Complete",
                    seaExpanseStatus: true,
                    seaExpanseDate: selectedDate // Add the selected date here
                };

                axios
                    .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', finalShippingPayData)
                    .then(response => {
                        toast.success('Sea Cost pay by finance successfully!');
                        setFinanceDetailsData(finalShippingPayData);
                    })
                    .catch(error => {
                        toast.error('Error occurred while processing the trade.');
                        console.error(error);
                    });
            } else {
                axios
                    .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', ShippingPayData)
                    .then(response => {
                        toast.success('Sea Cost pay by finance successfully!');
                        setFinanceDetailsData(ShippingPayData);
                    })
                    .catch(error => {
                        toast.error('Error occurred while processing the trade.');
                        console.error(error);
                    });
            }
        }
    };

    const handleToContainerPay = () => {
        const confirmCarrierPay = window.confirm(
            "Are you sure, you want to Confirm the Carrier pay"
        );

        if (confirmCarrierPay) {

            if (financeDetailsData.carrierExpanseStatus) {
                toast.warn("Already Paid Container Payment");
                return;
            }

            if (!selectedDate) {
                toast.error("Please select a date before proceeding.");
                return;
            }

            let containerPayData = {
                ...financeDetailsData,
                carrierExpanseStatus: true,
                carrierExpanseDate: selectedDate // Add the selected date here
            }

            if (financeDetailsData.seaExpanseStatus && financeDetailsData.tradeExpanseStatus) {
                // Final trade pay data when both conditions are true
                let finalCarrierPayData = {
                    ...financeDetailsData,
                    status: "finance",
                    finalStatus: "Complete",
                    carrierExpanseStatus: true,
                    carrierExpanseDate: selectedDate // Add the selected date here
                };

                axios
                    .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', finalCarrierPayData)
                    .then(response => {
                        toast.success('Carrier pay by finance successfully!');
                        setFinanceDetailsData(finalCarrierPayData);
                    })
                    .catch(error => {
                        toast.error('Error occurred while processing the trade.');
                        console.error(error);
                    });
            } else if (financeDetailsData.seaExpanseStatus || financeDetailsData.tradeExpanseStatus) {
                // Save the updated data to the API when one of the conditions is true
                axios
                    .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', containerPayData)
                    .then(response => {
                        toast.success('Carrier pay by finance successfully!');
                        setFinanceDetailsData(containerPayData);
                    })
                    .catch(error => {
                        toast.error('Error occurred while processing the trade.');
                        console.error(error);
                    });
            } else {
                // If neither of the conditions is true, create a new entry via POST
                axios
                    .put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', containerPayData)
                    .then(response => {
                        toast.success('Carrier Paid by finance successfully!');
                        setFinanceDetailsData(containerPayData);
                    })
                    .catch(error => {
                        toast.error('Error occurred while processing the trade.');
                        console.error(error);
                    });
            }
        }
    };

    const handleToTradeExchangeRate = (e) => {
        const newRate = e.target.value;
        setTradeExchangeRate(newRate);

        // Calculate the new C&F level based on the exchange rate
        const calculatedCfLevel = ((financeDetailsData.total * newRate * 0.20) / 100);
        // Conditional logic to update C&F level
        if (selectedServiceProvider.status === 'fix') {
            setNewCfLevel(selectedServiceProvider.level);
        }
        else {
            if (calculatedCfLevel > parseFloat(selectedServiceProvider.level)) {
                setNewCfLevel(selectedServiceProvider.level);
            } else {
                setNewCfLevel(calculatedCfLevel);
            }
        }

    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-[1300px] mx-auto bg-white shadow-md rounded-md p-6">
                <h1 className="mb-4 text-center underline flex justify-center items-center text-3xl my-4 uppercase text-cyan-600 font-bold">Shipment and Invoice Details</h1>

                {/* General Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-white">
                    <div>
                        <strong>Country:</strong> {financeDetailsData.transportCountryName}
                    </div>
                    <div>
                        <strong>Port:</strong> {financeDetailsData.transportPort}
                    </div>
                    <div>
                        <strong>Transport Way:</strong> {financeDetailsData.transportWay}
                    </div>
                    <div>
                        <strong>Invoice No:</strong> {financeDetailsData.invoiceNo}
                    </div>
                    <div>
                        <strong>Invoice Value (USD):</strong> {financeDetailsData.total}
                    </div>
                    <div>
                        <strong>Invoice Date:</strong> {financeDetailsData.invoiceDate}
                    </div>
                    <div>
                        <strong>EP No:</strong> {financeDetailsData.epNo}
                    </div>
                    <div>
                        <strong>Container No:</strong> {financeDetailsData.truckNo}
                    </div>
                    <div>
                        <strong>Zone:</strong> {financeDetailsData.zone}
                    </div>
                    <div>
                        <strong>Port Of Loading:</strong> {financeDetailsData?.loadfrom}
                    </div>
                    <div>
                        <strong>Permit Till Date:</strong> {financeDetailsData.permitedDate}
                    </div>
                    <div>
                        <strong>Export No:</strong> {financeDetailsData.expNo}
                    </div>
                    <div>
                        <strong>Export Date:</strong> {financeDetailsData.expDate}
                    </div>
                    <div>
                        <strong>CM Value:</strong> {financeDetailsData.cmValue}
                    </div>
                    <div>
                        <strong>Consignee Name:</strong> {financeDetailsData.consigneeName}
                    </div>
                    <div>
                        <strong>Consignee Address:</strong> {financeDetailsData.consigneeAddress}
                    </div>
                    <div>
                        <strong>Bank Name:</strong> {financeDetailsData.bankName}
                    </div>
                    <div>
                        <strong>LC/No./TT/P.S/SC/CMT:</strong> {financeDetailsData.sccmt}
                    </div>
                    <div>
                        <strong>Enterprise Employee:</strong> {financeDetailsData.enterpriseEmp}
                    </div>
                    <div>
                        <strong>Verifying Officer:</strong> {financeDetailsData.verifyingEmp}
                    </div>
                    <div>
                        <strong>Permit Officer:</strong> {financeDetailsData.permitEmp}
                    </div>
                    <div>
                        <strong>Total Box Weight:</strong> {financeDetailsData.allTotalBoxWeight}
                    </div>
                </div>


                {/* Particular Expense Names */}
                <h3 className="text-xl font-bold mb-4 text-center underline mt-8"><span>{financeDetailsData.traderServiceProvider
                }</span> Particular Expenses</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-white">
                    <div><strong>Gross Weight:</strong> {financeDetailsData.grossWeight}</div>
                    <div><strong>Net Weight:</strong> {financeDetailsData.netWeight}</div>
                    {
                        financeDetailsData.tradeExchangeRate > 0 &&
                        <>
                            <div><strong>Trade Exchange Rate:</strong> {financeDetailsData.tradeExchangeRate}</div>
                            <div><strong>Invoice Value:</strong> {financeDetailsData.total * financeDetailsData.tradeExchangeRate} TK</div>
                        </>
                    }
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
                        {financeDetailsData.financeParticularExpenseNames && financeDetailsData.financeParticularExpenseNames.map((expense, index) => (
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
                            <td colSpan="3" className="py-2 px-4 text-left">Total Individual Cost</td>
                            <td className="py-2 px-4">{financeDetailsData.totalCost}</td>
                        </tr>
                        {
                            financeDetailsData.tradeExchangeRate > 0 &&
                            <>
                                <tr className=" bg-orange-100 font-base text-gray-700 border-b">
                                    <td colSpan="3" className="py-2 px-4 text-left">C&F Commission 0.20%</td>
                                    <td className="py-2 px-4">{financeDetailsData?.candF ? financeDetailsData?.candF : newCfLevel}</td>
                                </tr>
                                <tr className=" bg-orange-100 font-base text-gray-700 border-b">
                                    <td colSpan="3" className="py-2 px-4 text-left">Total Amount</td>
                                    <td className="py-2 px-4">{parseFloat(financeDetailsData.totalCost) + parseFloat(financeDetailsData?.candF ? financeDetailsData?.candF : newCfLevel)}</td>
                                </tr>
                            </>
                        }


                    </tfoot>

                </table>
                <div className="text-right flex justify-between mb-16">
                    {
                        financeDetailsData.tradeExpanseDate
                        &&
                        <div className="my-2"><strong>Trade Service Payment Data:</strong> {financeDetailsData.tradeExpanseDate
                        }</div>
                    }
                    {
                        financeDetailsData.tradeExpanseStatus ? (
                            <button className="bg-green-500 text-white px-4 py-2 rounded">Paid</button>
                        ) : (
                            <div>
                                <button onClick={() => setTradeRateInputVisible(!isTradeRateInputVisible)} className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black">
                                    Trade Pay
                                </button>
                                {isTradeRateInputVisible && (
                                    <div className="mt-4">
                                        <label>Exchange Rate: </label>
                                        <input
                                            type="number"
                                            value={tradeExchangeRate}
                                            onChange={handleToTradeExchangeRate}
                                            className="border px-4 py-2 rounded"
                                            placeholder="Enter Trade Exchange Rate"
                                        />
                                        <label>Date: </label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="border px-4 py-2 rounded"
                                        />
                                        <button onClick={handleToTradePay} className="bg-green-500 text-white px-4 py-2 rounded ml-4">
                                            Confirm Payment
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
                {/* Purchase Product in Boxes */}
                <h3 className="text-xl font-bold mb-4 text-center underline">Products In Boxes</h3>
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
                        {financeDetailsData.financeProductInBoxes && financeDetailsData.financeProductInBoxes.map((product, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-1">{product.hscode}</td>
                                <td className="py-2 px-1">{product.productName}</td>
                                <td className="py-2 px-1">{product.productModel}</td>
                                <td className="py-2 px-1">{product.quantity}</td>
                                <td className="py-2 px-1">{product.truckNumber}</td>
                                <td className="py-2 px-1">{product.totalPallet}</td>
                                <td className="py-2 px-1">{product.totalBox}</td>
                                <td className="py-2 px-1">{product.weightPerBox}</td>
                                <td className="py-2 px-1">{product.individualTotalBoxWeight}</td>
                                <td className="py-2 px-1">{product.c_FUS}</td>
                                <td className="py-2 px-1">{product.c_FUSD}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-semibold text-gray-700">
                            <td colSpan="8" className="py-2 px-4 text-left">All Total Weight</td>
                            <td className="py-2 px-4 text-start">{financeDetailsData.allTotalBoxWeight}</td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                        </tr>
                    </tfoot>
                </table>

                {/* Container Expense Names */}
                <h3 className="text-xl font-bold mb-4 text-center underline"><span>{financeDetailsData?.containerServiceProvider}</span> CARRIER SERVICE</h3>
                <table className="min-w-full bg-white mb-6 shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-left text-gray-700 font-semibold">
                            <th className="py-2 px-2">S/L No</th>
                            <th className="py-2 px-2">Date</th>
                            <th className="py-2 px-2">Container No</th>
                            <th className="py-2 px-2">Container T/S</th>
                            <th className="py-2 px-2">Invoice No</th>
                            <th className="py-2 px-2">EP NO</th>
                            <th className="py-2 px-2">Fare Amount</th>
                            <th className="py-2 px-2">Ait/Vat 5%</th>
                            <th className="py-2 px-2">Total Amount/TK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {financeDetailsData.financeContainerExpenseNames && financeDetailsData.financeContainerExpenseNames.map((container, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100">
                                <td className="py-2 px-2">{container.slNo}</td>
                                <td className="py-2 px-2">{container.date}</td>
                                <td className="py-2 px-2">{container.containerNo}</td>
                                <td className="py-2 px-2">{container.containerTypeSize}</td>
                                <td className="py-2 px-2">{container.invoiceNo}</td>
                                <td className="py-2 px-2">{container.epNumber}</td>
                                <td className="py-2 px-2">{container.fareAmount}</td>
                                <td className="py-2 px-2">{container.aitVat}</td>
                                <td className="py-2 px-2">{container.individualTotalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-semibold text-gray-700">
                            <td colSpan="6" className="py-2 px-4 text-left">Gross Total Amount</td>
                            <td className="py-2 px-4">{financeDetailsData.totalFareAmount}</td>
                            <td className="py-2 px-4">{financeDetailsData.totalAitVat}</td>
                            <td className="py-2 px-4">{financeDetailsData.totalCarrierAmount}</td>
                        </tr>
                    </tfoot>
                </table>
                <div className="text-right mb-16 flex justify-between">
                    {
                        financeDetailsData.carrierExpanseDate
                        &&
                        <div className="my-2"><strong>Carrier Payment Data:</strong> {financeDetailsData.carrierExpanseDate
                        }</div>
                    }
                    {
                        financeDetailsData.carrierExpanseStatus ? (
                            <button className="bg-green-500 text-white px-4 py-2 rounded">Paid</button>
                        ) : (
                            <div>
                                <button onClick={() => setDateInputVisible(!isDateInputVisible)} className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black">
                                    Container Pay
                                </button>
                                {isDateInputVisible && (
                                    <div className="mt-4">
                                        <label>Select Date: </label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="border px-4 py-2 rounded"
                                        />
                                        <button onClick={handleToContainerPay} className="bg-green-500 text-white px-4 py-2 rounded ml-4">
                                            Confirm Payment
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>


                {/* Ocean info */}
                <h3 className="text-xl font-bold mb-4 text-center underline"><span>{financeDetailsData.seaServiceProvider}</span> FREIGHT SERVICE</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-white">
                    <div>
                        <strong>Shipper:</strong> {financeDetailsData.shipper}
                    </div>
                    <div>
                        <strong>B/L No:</strong> {financeDetailsData.blNo}
                    </div>
                    <div>
                        <strong>Container No:</strong> {financeDetailsData.containerNo}
                    </div>
                    <div>
                        <strong>Destination:</strong> {financeDetailsData.destination}
                    </div>
                    <div>
                        <strong>VSL/VOY:</strong> {financeDetailsData.vslVoy}
                    </div>
                    <div>
                        <strong>ETD:</strong> {financeDetailsData.etd}
                    </div>
                    <div>
                        <strong>ETA:</strong> {financeDetailsData.eta}
                    </div>
                    <div>
                        <strong>Sea Exchange Rate:</strong> {financeDetailsData.exchangeRate}
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
                        {financeDetailsData.financeCharges && financeDetailsData.financeCharges.map((charge, index) => (
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
                            <td class="border border-gray-300 px-6 py-4">{financeDetailsData.totalAmountUSD} USD</td>
                            <td class="border border-gray-300 px-6 py-4">{financeDetailsData.totalAmountBDT} TK</td>
                        </tr>
                    </tfoot>
                </table>
                <div className="text-right mb-16 flex justify-between">
                    {
                        financeDetailsData.seaExpanseDate &&
                        <div><strong>Shipment Payment Data:</strong> {financeDetailsData.seaExpanseDate}</div>
                    }
                    {
                        financeDetailsData.seaExpanseStatus ? (
                            <button className="bg-green-500 text-white px-4 py-2 rounded">Paid</button>
                        ) : (
                            <div>
                                <button onClick={() => setDateInputVisible(!isDateInputVisible)} className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black">
                                    Shipping Pay
                                </button>
                                {isDateInputVisible && (
                                    <div className="mt-4">
                                        <label>Select Date: </label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="border px-4 py-2 rounded"
                                        />
                                        <button onClick={handleToShippingPay} className="bg-green-500 text-white px-4 py-2 rounded ml-4">
                                            Confirm Payment
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
                {
                    <div>
                        {financeDetailsData?.image && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-center underline mt-10">
                                    All Available Images Related To This Export Data
                                </h3>

                                {/* Image Grid - 3 Images per Row */}
                                <div className="grid grid-cols-3 gap-6 py-10">
                                    {financeDetailsData?.image && financeDetailsData?.image?.split("+")[1].split(",").map((image, index) => (
                                        <div key={index} className="p-4 bg-white shadow-lg rounded-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                            {/* Title - Image Name */}
                                            <h3 className="text-center font-semibold text-lg text-gray-700 mb-2 truncate">
                                                {financeDetailsData.image.split("+")[0].split(",")[index]}
                                            </h3>

                                            {/* Image */}
                                            <img
                                                src={`https://grozziieget.zjweiting.com:3091/web-api-tht-1/fileUpload/${image}/view`}
                                                alt={`Export image ${index + 1}`}
                                                className="w-full h-40 object-cover rounded-lg"
                                                onClick={() => openModal(image)} // Open modal on click
                                            />
                                        </div>
                                    ))}
                                </div>




                            </div>
                        )}
                    </div>
                }

                {/* Modal for Full-Size Image */}
                {selectedImage && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                        <div className="relative">
                            <img
                                src={`https://grozziieget.zjweiting.com:3091/web-api-tht-1/fileUpload/${selectedImage}/view`} // Replace with actual image path
                                alt="Full-size"
                                className="w-auto h-auto max-h-screen max-w-[1600px]"
                            />
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-1 bg-red-500 text-white rounded-3xl p-2 text-2xl"
                            >
                                ✖
                            </button>
                        </div>
                    </div>
                )}
                {
                    financeDetailsData.finalStatus === "finalData" ? "" :
                        <MultipleImageUpload
                            setFinanceDetailsData={setFinanceDetailsData}
                            financeDetailsData={financeDetailsData}
                        ></MultipleImageUpload>
                }
                {/* Payment Options */}
                <div className="flex justify-end mb-4">
                    {
                        (!financeDetailsData.tradeExpanseStatus || !financeDetailsData.seaExpanseStatus || !financeDetailsData.carrierExpanseStatus) ? (
                            <button
                                onClick={() => setShowModal(true)}
                                className="mr-5 btn btn-error px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-red-500 text-white font-bold hover:text-black">
                                Send Back
                            </button>
                        ) : ""
                    }
                    {
                        financeDetailsData.finalStatus === "finalData" ? "" : (
                            <button
                                onClick={handleUpdate}
                                className="btn btn-accent px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-green-500 text-white font-bold hover:text-black">
                                Update
                            </button>
                        )
                    }

                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
                                <h2 className="text-lg font-bold mb-4">Reason for Sending Back</h2>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full border border-gray-300 p-2 rounded-lg mb-4"
                                    placeholder="Enter reason here"
                                ></textarea>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="mr-4 btn bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleToReject}
                                        className="btn bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                                        Send Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div >

    );
};

export default FinanceDetails;
