import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VersionInfo from './VersionInfo';
import PDFPaymentInfo from './PDFPaymentInfo';
import CropPaymentInfo from './CropPaymentInfo';

const ShopifyInfo = () => {
    const [mark, setMark] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [shopifyData, setShopifyData] = useState(null);

    useEffect(() => {
        // Fetch initial data
        const fetchData = async () => {
            try {
                const response = await axios.get('https://grozziieget.zjweiting.com:8033/tht/mallProducts/showShopify');

                if (response.status === 200) {
                    const data = response.data[0];
                    setMark(data.mark.toString());
                    setLink(data.link);
                    setShopifyData(data);
                } else {
                    toast.error('Failed to load data');
                }
            } catch (error) {
                toast.error('An error occurred while fetching data');
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleCancel = () => {
        setMark('');
        setLink('');
        toast.info('Inputs cleared');
    };

    const handleSave = async () => {
        // Validate inputs
        if (!mark || isNaN(mark)) {
            toast.error('Please enter a valid integer for Shopify Showing Mark');
            return;
        }
        if (!link || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(link)) {
            toast.error('Please enter a valid URL for Shopify Showing Link');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put('https://grozziieget.zjweiting.com:8033/tht/mallProducts/ShopifyLinkMark/update/1', {
                mark: parseInt(mark, 10),
                link,
            });

            if (response.status === 200) {
                toast.success('Data saved successfully!');
                setShopifyData({ id: 1, mark: parseInt(mark, 10), link });
                handleCancel(); // Clear inputs after successful save
            } else {
                toast.error('Failed to save data');
            }
        } catch (error) {
            toast.error('An error occurred while saving data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="p-8 max-w-2xl w-full mx-auto bg-gray-50">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                        Shopify Information for Mall Product
                    </h2>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Shopify Showing Mark</label>
                        <input
                            type="number"
                            value={mark}
                            onChange={(e) => setMark(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter mark"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Shopify Showing Link</label>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter Shopify link"
                        />
                    </section>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-3 text-white font-medium bg-gray-800 rounded hover:bg-gray-500 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className={`px-6 py-3 font-medium text-white rounded transition-colors ${loading ? 'bg-gray-400' : 'bg-[#004368]  hover:bg-blue-700'}`}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    <ToastContainer />

                    {shopifyData && (
                        <section className="mt-12 bg-gray-100 p-6">
                            <h3 className="text-2xl font-medium text-gray-800 mb-4">Current Shopify Data</h3>
                            <div className="text-gray-700">
                                <p><strong>Mark:</strong> {shopifyData.mark}</p>
                                <p><strong>Link:</strong> <a href={shopifyData.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{shopifyData.link}</a></p>
                            </div>
                        </section>
                    )}
                </div>
            </div>
            <VersionInfo></VersionInfo>
            <PDFPaymentInfo></PDFPaymentInfo>
            <CropPaymentInfo></CropPaymentInfo>
        </div>
    );
};

export default ShopifyInfo;
