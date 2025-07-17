import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

const MalaysiaFormate = ({ finalData, handlePrint, closeModal, setProductList }) => {
    const [productNameFormate, setProductNameFormate] = useState([]);
    const [printData, setPrintData] = useState(finalData?.printData || []);
    const [newRows, setNewRows] = useState([]); // Track new rows separately
    // Fetch user data from API
    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const response = await axios.get(
                    "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newproduct"
                );
                setProductNameFormate(response.data);
            } catch (error) {
                console.error("Failed to fetch users");
            }
        };
        fetchProductList();
    }, []);

    const marks = finalData?.mark ? finalData?.mark?.split(",") || [] : [];

    const calculateTotals = useCallback(() => {
        const allData = [...(finalData?.printData || []), ...newRows];

        const totalQuantity = allData.reduce((acc, data) => {
            return acc + (parseInt(data?.quantity || data?.totalBox || 0, 10));
        }, 0);

        const totalBoxes = allData.reduce((acc, data) => {
            return acc + (parseInt(data?.totalBox || 0, 10));
        }, 0);

        return { totalQuantity, totalBoxes };
    }, [finalData, newRows]);

    const { totalQuantity, totalBoxes } = calculateTotals();

    const productNames = () => {

        const uniqueNames = new Set();

        return finalData?.printData
            ?.map(product => {
                const matchedProduct = productNameFormate?.find(
                    item => item.productName === product.productName
                );

                const productName = matchedProduct ? matchedProduct.malaysiaName : product.productName;

                // Add only if the name is not already in the Set
                if (!uniqueNames.has(productName)) {
                    uniqueNames.add(productName);
                    return productName;
                }
                return null; // Skip duplicates
            })
            .filter(name => name !== null) // Remove nulls (duplicate names)
            .join('+');
    };

    setProductList(productNames())

    const addRow = () => {
        const newRow = { productModel: '', totalBox: '', remark: '' };
        setNewRows([...newRows, newRow]);

    };
    const handleInputChange = (index, field, value) => {
        const updatedData = [...newRows];
        updatedData[index][field] = value;
        setNewRows(updatedData);
    };

    return (

        <div className="bg-white p-6 rounded-lg shadow-lg ">
            <div id="pdf-content" className="space-y-4 ">
                <div className="border-4 p-3 mx-8 border-slate-800  min-h-[800px] ">

                    <h1 className="text-4xl font-medium text-center mb-6">MARKS & NOTES</h1>
                    <h1 className="text-4xl font-medium text-center mb-6">唛头</h1>
                    <h2 className="text-xl ml-1 mb-6 mt-6">
                        {marks.map((mark, index) => (
                            <p key={index}>
                                {index + 1}. {mark.trim()}
                            </p>
                        ))}
                    </h2>

                    <div className="flex justify-start items-center mb-4">
                        <h3 className="text-xl ml-1   mr-2">品名:</h3>
                        <p className="text-xl ml-1">{productNames()}</p>
                    </div>

                    <div className="flex justify-start items-center mb-4">
                        <h3 className="text-xl ml-1    mr-2">每托盘箱数:  </h3>
                        <p className="text-xl ml-1">{totalBoxes} 箱</p>
                    </div>
                    <div className="flex justify-start items-center mb-4">
                        <h3 className="text-xl ml-1    mr-2">入库单号:  </h3>
                        <p className="text-xl ml-1">{finalData?.receiptNumber}</p>
                    </div>

                    <div className="flex justify-start items-center mb-6">
                        <h3 className="text-xl ml-1    mr-2">数量:  </h3>
                        <p className="text-xl ml-1">{totalQuantity} 台</p>
                    </div>



                    <div className="flex justify-center items-center mb-2">
                        <h3 className="text-xl ml-1 mr-2">{finalData?.company}</h3>
                        <p className="text-xl ml-1">Company</p>
                    </div>

                    <h3 className="text-2xl font-semibold ml-1 text-center">Made in Bangladesh</h3>

                    <div className="flex justify-center items-center mt-4 mb-2">
                        <h3 className="text-4xl ml-1 font-medium">托盘号/</h3>
                        <p className="text-4xl ml-1">{finalData?.printData[0]?.totalPallet}</p>
                    </div>
                    <table className="w-full border-collapse mt-4">
                        <thead>
                            {
                                finalData?.language === "EN" ? <tr className="bg-gray-200 text-sm">
                                    <th className="border-x-2 border-gray-300  py-2 w-72">Model</th>
                                    <th className="border-x-2 border-gray-300  py-2 w-30">Date</th>
                                    <th className="border-x-2 border-gray-300  py-2 w-20">Pallet Total Box</th>
                                    <th className="border-x-2 border-gray-300  py-2 w-12">Pallet No</th>
                                    <th className="border-x-2 border-gray-300  py-2 w-12">Total Pallet No</th>
                                    <th className="border-x-2 border-gray-300 py-2 w-12">Remark</th>
                                </tr> : <tr className="bg-gray-200 text-sm">
                                    <th className="border-x-2 border-gray-300  py-2 w-72">型号</th>
                                    <th className="border-x-2 border-gray-300  py-2 w-30">日期</th>
                                    <th className="border-x-2 border-gray-300  py-2 w-20">托盘总箱数</th>
                                    <th className="border-x-2 border-gray-300  py-2 w-12">托盘号</th>
                                    <th className="border-x-2 border-gray-300  py-2 w-12">总卡板</th>
                                    <th className="border-x-2 border-gray-300 py-2 w-12">备注</th>
                                </tr>
                            }

                        </thead>
                        <tbody>
                            {finalData?.printData?.map((product, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2">{product?.productModel}</td>
                                    <td className="border px-4 py-2">{product?.date}</td>
                                    <td className="border px-4 py-2">{product?.totalBox} 箱</td>
                                    <td className="border px-4 py-2">{product?.totalPallet}</td>
                                    <td className="border px-4 py-2">{finalData?.totalPalletNo}</td>
                                    <td className="border px-4 py-2">{finalData?.remark}</td>
                                </tr>
                            ))}
                            {newRows.map((product, index) => (
                                <tr key={`new-${index}`} className="hover:bg-gray-100">
                                    <td className="border h-8">

                                        <textarea
                                            value={product.productModel}
                                            onChange={(e) => handleInputChange(index, 'productModel', e.target.value)}
                                            className=" border-t w-full h-full resize-none pl-3 whitespace-pre-wrap text-start"
                                            rows="1"
                                        ></textarea>
                                    </td>


                                    <td className="border px-4 py-2">{printData[0].date}</td>
                                    <td className="my-auto border">
                                        <div className="flex justify-center items-center">
                                            <input
                                                type="text"
                                                value={product.totalBox}
                                                onChange={(e) => handleInputChange(index, 'totalBox', e.target.value)}
                                                className="w-8 h-8 pt-1"
                                            /> 箱
                                        </div>

                                    </td>
                                    <td className="border px-4 py-2">{printData[0].totalPallet}</td>
                                    <td className="border px-4 py-2">{finalData?.totalPalletNo}</td>
                                    <td className="border">
                                        <input
                                            type="text"
                                            value={product.remark}
                                            onChange={(e) => handleInputChange(index, 'remark', e.target.value)}
                                            className="w-full h-8"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            <div className="flex justify-between mt-4">
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition" onClick={handlePrint}>
                    Print PDF
                </button>
                <button onClick={addRow} className="bg-blue-500 text-white  px-4 py-2 rounded hover:bg-blue-600 transition">
                    Add Row
                </button>
                <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition" onClick={closeModal}>
                    Close
                </button>
            </div>
        </div>

    );
};

export default MalaysiaFormate