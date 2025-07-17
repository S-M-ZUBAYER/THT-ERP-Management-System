import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logDOM } from '@testing-library/react';
import FinalPurchaseModal from './FinalPurchaseModal';
import { ClipLoader } from 'react-spinners';



const FinalPurchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [finalPurchaseLoading, setFinalPurchaseLoading] = useState(true);

    // Fetch data from API
    useEffect(() => {
        setFinalPurchaseLoading(true); // Start loading before making the request
        axios.get('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase')
            .then(response => {
                const sortedData = response?.data.sort((a, b) => b.id - a.id);
                console.log(sortedData);
                const finalPurchases = sortedData.filter(purchase => purchase.status === "purchase");
                setPurchases(finalPurchases);

                setFilteredPurchases(finalPurchases);
            })
            .catch(error => {
                console.error('Failed to fetch data!');
            })
            .finally(() => {
                setFinalPurchaseLoading(false); // Ensure loading is stopped after both success or failure
            });
    }, []);


    const openModal = (purchase) => {
        setSelectedPurchase(purchase);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPurchase(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedPurchase((prevState) => ({
            ...prevState,
            [name]: value,
            status: "finalPurchase"
        }));
    };

    const handleSave = () => {
        const confirmSave = window.confirm("Do you want to Save this data to check finance?");
        if (confirmSave) {

            setSelectedPurchase((prevState) => {
                const updatedPurchase = { ...prevState, status: "finalPurchase" };
                return updatedPurchase;
            });
            const updatedPurchase = { ...selectedPurchase, status: "finalPurchase" };
            const updatedFinance = {
                ...selectedPurchase,
                status: "finalPurchase",
                financeContainerExpenseNames: selectedPurchase.containerExpenseNames,
                financeParticularExpenseNames: selectedPurchase.particularExpenseNames,
                financeProductInBoxes: selectedPurchase.purchaseProductInBoxes,
                financeCharges: selectedPurchase.chargesList
            };

            delete updatedFinance.containerExpenseNames;
            delete updatedFinance.particularExpenseNames;
            delete updatedFinance.purchaseProductInBoxes;
            delete updatedFinance.chargesList;

            // Now save to the API (you can do this after ensuring the state is correct)
            axios.put('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/purchase', updatedPurchase)
                .then(response => {
                    toast.success('Purchase Data Updated successfully!');
                    const purchaseList = purchases.filter(purchase => purchase.id !== updatedPurchase.id);
                    setFilteredPurchases(purchaseList);
                    setPurchases(purchaseList)
                    closeModal();
                })
                .catch(error => toast.error('Failed to save data!'));

            // Now save to the API (you can do this after ensuring the state is correct)
            axios.post('https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/finance', updatedFinance)
                .then(response => {
                    toast.success('Data store as finance successfully!');
                    closeModal();
                })
                .catch(error => toast.error('Failed to save data!'));
        }
    };


    const [searchValue, setSearchValue] = useState('');
    // Handle input change and filter products
    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase(); // Use the current input value
        setSearchValue(value);

        // Use `value` directly in the filter instead of `searchValue`
        const filteredProducts = purchases.filter((account) =>
            account.transportWay.toLowerCase().includes(value) ||
            account.truckNo.toLowerCase().includes(value) ||
            account.transportCountry.toLowerCase().includes(value) ||
            account.date.toLowerCase().includes(value) ||
            account.invoiceNo.toLowerCase().includes(value) ||
            account.epNo.toLowerCase().includes(value)
        );
        setFilteredPurchases(filteredProducts);
    };

    // loader css style
    const override = {
        display: "block",
        margin: "25px auto",
    };
    ;

    return (
        <div className="container mx-auto px-4">
            <div className="">
                <h1 className="flex justify-center items-center text-4xl my-4 uppercase text-cyan-600 font-bold">
                    Shipment Details Show And Update From Purchase
                </h1>
                <p className="text-red-600 text-sm text-center font-medium">
                    ** Please Fillup this form carefully & check all fields. You can't modify it later. **
                </p>

                {/* Table data fetched from accounts input database */}
                <div className="w-full lg:w-3/4 mx-auto">
                    <div className="flex justify-between items-center my-6 bg-slate-500 p-3 rounded-lg">
                        <h1 className="text-3xl text-info font-bold uppercase">
                            Check And Approve For The Finance
                        </h1>
                        <input
                            type="text"
                            placeholder="Search by date, model, pallet no, truck no"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none"
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Purchases Table */}
                    {finalPurchaseLoading ? <div>
                        <ClipLoader
                            color={"#36d7b7"}
                            loading={finalPurchaseLoading}
                            size={50}
                            cssOverride={override}
                        />
                        <p className="text-center font-extralight text-xl text-green-400">
                            Please wait ....
                        </p>
                    </div> :
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="w-full bg-gray-200 text-left">
                                    <th className="py-2 px-4">Date</th>
                                    <th className="py-2 px-4">Truck No</th>
                                    <th className="py-2 px-4">Port</th>
                                    <th className="py-2 px-4">Country</th>
                                    <th className="py-2 px-4">Invoice No</th>
                                    <th className="py-2 px-4">Total Weight</th>
                                    <th className="py-2 px-4">Total Cost</th>
                                    <th className="py-2 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPurchases.length > 0 ? (
                                    filteredPurchases.map((purchase) => (
                                        <tr key={purchase.id} className="border-b">
                                            <td className="py-2 px-4">{purchase.date}</td>
                                            <td className="py-2 px-4">{purchase.truckNo}</td>
                                            <td className="py-2 px-4">{purchase.transportPort}</td>
                                            <td className="py-2 px-4">{purchase.transportCountryName}</td>
                                            <td className="py-2 px-4">{purchase.invoiceNo}</td>
                                            <td className="py-2 px-4">{purchase.allTotalBoxWeight}</td>
                                            <td className="py-2 px-4">{purchase.totalCost}</td>
                                            <td className="py-2 px-4">
                                                <button
                                                    onClick={() => openModal(purchase)}
                                                    className=" hover:bg-cyan-400  btn btn-info px-4 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-2 rounded-lg bg-violet-500 text-white font-bold hover:text-black"
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            No matching records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>}


                    {/* Modal Component */}
                    <FinalPurchaseModal
                        isOpen={isModalOpen}
                        selectedPurchase={selectedPurchase}
                        setSelectedPurchase={setSelectedPurchase}
                        handleChange={handleChange}
                        handleSave={handleSave}
                        closeModal={closeModal}
                    />
                </div>
            </div>
        </div>

    );
};

export default FinalPurchase;

