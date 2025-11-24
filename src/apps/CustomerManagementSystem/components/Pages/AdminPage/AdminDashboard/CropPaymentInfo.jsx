import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CropPaymentInfo = () => {
    const [USD, setUSD] = useState('');
    const [CNY, setCNY] = useState('');
    const [SGD, setSGD] = useState('');
    const [EUR, setEUR] = useState('');
    const [allowMark, setAllowMark] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentData, setCurrentData] = useState(null);

    useEffect(() => {
        // Fetch the current amounts
        const fetchData = async () => {
            try {
                // const response = await axios.get('http://localhost:2000/tht/cropPayment');
                const response = await axios.get('https://grozziieget.zjweiting.com:8033/tht/cropPayment');
                if (response.status === 200) {
                    const data = response.data;

                    setUSD(data[0].USD);
                    setCNY(data[0].CNY);
                    setSGD(data[0].SGD);
                    setEUR(data[0].EUR);
                    setAllowMark(data[0].allowMark);
                    setCurrentData(data[0]);
                } else {
                    console.error('Failed to load PDF payment data');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleCancel = () => {
        setUSD(currentData?.USD || 0);
        setCNY(currentData?.CNY || 0);
        setSGD(currentData?.SGD || 0);
        setEUR(currentData?.EUR || 0);
        setAllowMark(currentData?.allowMark || 0);
        toast.info('Input cleared');
    };

    const handleSave = async () => {
        // Validate inputs
        if (
            !USD || isNaN(USD) ||
            !CNY || isNaN(CNY) ||
            !SGD || isNaN(SGD) ||
            !EUR || isNaN(EUR) ||
            !allowMark || isNaN(allowMark)
        ) {
            toast.error('Please enter valid amounts');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.put(
                // 'http://localhost:2000/tht/cropPayment/update',
                'https://grozziieget.zjweiting.com:8033/tht/cropPayment/update',
                {
                    id: 1,
                    USD: parseInt(USD, 10),
                    CNY: parseInt(CNY, 10),
                    SGD: parseInt(SGD, 10),
                    EUR: parseInt(EUR, 10),
                    allowMark: parseInt(allowMark, 10),
                }
            );

            if (response.status === 200) {
                toast.success('Amounts updated successfully!');
                setCurrentData({
                    id: 1,
                    USD: parseInt(USD, 10),
                    CNY: parseInt(CNY, 10),
                    SGD: parseInt(SGD, 10),
                    EUR: parseInt(EUR, 10),
                    allowMark: parseInt(allowMark, 10),
                });
                setLoading(false);
            } else {
                toast.error('Failed to update amounts');
                setLoading(false);
            }
        } catch (error) {
            toast.error('An error occurred while updating data');
            console.error(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-center items-center min-h-screen pt-24 bg-gray-100">
                <div className="p-8 max-w-2xl w-full mx-auto bg-gray-50">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                        Crop Payment Information
                    </h2>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">USD Amount</label>
                        <input
                            type="number"
                            value={USD}
                            onChange={(e) => setUSD(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter USD amount"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">CNY Amount</label>
                        <input
                            type="number"
                            value={CNY}
                            onChange={(e) => setCNY(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter CNY amount"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">SGD Amount</label>
                        <input
                            type="number"
                            value={SGD}
                            onChange={(e) => setSGD(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter SGD amount"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">EUR Amount</label>
                        <input
                            type="number"
                            value={EUR}
                            onChange={(e) => setEUR(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter EUR amount"
                        />
                    </section>
                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Allow Mark</label>
                        <input
                            type="number"
                            value={allowMark}
                            onChange={(e) => setAllowMark(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter EUR amount"
                        />
                    </section>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-3 font-medium bg-gray-600 text-white rounded hover:bg-gray-800 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className={`px-6 py-3 font-medium text-white rounded transition-colors ${loading ? 'bg-gray-400' : 'bg-[#004368] hover:bg-blue-700'}`}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>

                    <ToastContainer />

                    {currentData && (
                        <section className="mt-12 bg-gray-100 p-6">
                            <h3 className="text-2xl font-medium text-gray-800 mb-4">Current Payment Data</h3>
                            <div className="text-gray-700">
                                <p><strong>ID:</strong> {currentData.id}</p>
                                <p><strong>USD Amount:</strong> {currentData?.USD}</p>
                                <p><strong>CNY Amount:</strong> {currentData?.CNY}</p>
                                <p><strong>SGD Amount:</strong> {currentData?.SGD}</p>
                                <p><strong>EUR Amount:</strong> {currentData?.EUR}</p>
                                <p><strong>Allow Mark:</strong> {currentData?.allowMark}</p>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CropPaymentInfo;
