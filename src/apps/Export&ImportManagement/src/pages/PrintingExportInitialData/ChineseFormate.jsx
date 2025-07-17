import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ChineseFormate = ({ finalData, handlePrint, closeModal, setProductList }) => {
    const [productNameFormate, setProductNameFormate] = useState([]);
    const [printData, setPrintData] = useState(finalData?.printData || []);
    const [newRows, setNewRows] = useState([]);
    const [totalChinese, setTotalChinese] = useState('');
    console.log(finalData);


    useEffect(() => {
        // Fetch product list on mount
        const fetchProductList = async () => {
            try {
                const response = await axios.get(
                    'https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/newproduct'
                );
                setProductNameFormate(response.data);
            } catch (error) {
                console.error('Failed to fetch product list:', error);
            }
        };

        fetchProductList();
    }, []);

    const addRow = () => {
        setNewRows([...newRows, { productModel: '', totalBox: '', remark: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...newRows];
        updatedRows[index][field] = value;
        setNewRows(updatedRows);
    };

    const calculateTotalBoxes = () => {
        const newRowsTotal = newRows.reduce((sum, row) => sum + parseInt(row.totalBox || 0, 10), 0);
        const existingTotal = printData.reduce((sum, data) => sum + (data?.totalBox || 0), 0);
        return newRowsTotal + existingTotal;
    };

    const calculateTotalChinese = () => {
        const total = calculateTotalBoxes();
        setTotalChinese(numberToChinese(total));
    };

    useEffect(() => {
        calculateTotalChinese();
    }, [newRows, printData]);

    const numberToChinese = (num) => {
        const units = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿'];
        const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

        let str = '';
        const numStr = num.toString();
        for (let i = 0; i < numStr.length; i++) {
            const digit = parseInt(numStr[i], 10);
            const unit = units[numStr.length - i - 1];

            if (digit === 0) {
                if (!str.endsWith('零') && i < numStr.length - 1) str += digits[digit];
            } else {
                str += digits[digit] + unit;
            }
        }
        return str.replace(/^一十/, '十');
    };

    const productNames = () => {
        const uniqueNames = new Set();
        return printData
            .map((product) => {
                const matched = productNameFormate.find((item) => item.productName === product.productName);
                const name = matched ? matched.malaysiaName : product.productName;
                if (!uniqueNames.has(name)) {
                    uniqueNames.add(name);
                    return name;
                }
                return null;
            })
            .filter(Boolean)
            .join('+');
    };

    const productNameList = productNames();
    setProductList(productNameList);

    const marks = finalData?.mark && finalData?.mark.trim() ? finalData?.mark.split(',') : [];
    const totalBoxesChinese = numberToChinese(calculateTotalBoxes());
    console.log(marks, "length");


    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-24 mb-1">
            <div id="pdf-content" className="space-y-4">
                <div className="border-4 px-3 mx-8 border-slate-800 min-h-[900px] text-black">
                    <h1 className="text-7xl font-semibold text-center tracking-widest">唛头</h1>
                    <div className="flex justify-start mb-10 mt-8">
                        <h3 className="text-5xl ml-1 font-medium tracking-widest">品名:</h3>
                        {productNameList.length > 10 ? (
                            productNameList.length < 20 ? (
                                <div>
                                    <p className="text-5xl ml-1 font-medium tracking-widest">{productNameList.slice(0, 10)}</p>
                                    <p className="text-5xl ml-1 font-medium tracking-widest">{productNameList.slice(10)}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-5xl ml-1 font-medium tracking-widest">{productNameList.slice(0, 10)}</p>
                                    <p className="text-5xl ml-1 font-medium tracking-widest">{productNameList.slice(10, 20)}</p>
                                    <p className="text-5xl ml-1 font-medium tracking-widest">{productNameList.slice(20)}</p>
                                </div>
                            )
                        ) : (
                            <p className="text-5xl ml-1 font-medium tracking-widest">{productNameList}</p>
                        )}
                    </div>

                    <div className="flex justify-start items-center mb-8">
                        <h3 className="text-5xl ml-1 font-medium tracking-widest">每托盘箱数:</h3>
                        {/* <p className="text-5xl ml-1 font-medium tracking-widest">{finalData?.totalBoxes}</p> */}
                        <p className="text-5xl ml-1 font-medium tracking-widest">
                            {totalBoxesChinese}
                        </p>

                    </div>

                    <h2 className="text-4xl font-medium ml-1 mb-10">
                        {marks?.map((mark, index) => (
                            <p key={index}>
                                {mark.trim()}
                            </p>
                        ))}
                    </h2>

                    <h3 className="text-3xl ml-1 text-center font-semibold mb-10">Made in Bangladesh</h3>

                    <div className="flex justify-center items-center mb-10">
                        <h3 className="text-5xl ml-1 font-medium tracking-widest">托盘号:</h3>
                        <p className="text-5xl ml-1 font-medium">{finalData?.printData[0]?.totalPallet}</p>
                    </div>

                    <table className="w-full border-collapse mt-12 pb-2">
                        <thead className="text-center">
                            <tr className="bg-gray-200 text-sm">
                                <th className="border-x-2 border-gray-300 py-2 w-72">型号</th>
                                <th className="border-x-2 border-gray-300 py-2 w-30">日期</th>
                                <th className="border-x-2 border-gray-300 py-2 w-20">托盘总箱数</th>
                                <th className="border-x-2 border-gray-300 py-2 w-12">托盘号</th>
                                <th className="border-x-2 border-gray-300 py-2 w-12">总卡板</th>
                                <th className="border-x-2 border-gray-300 py-2 w-12">备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            {printData.map((product, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border px-4 py-2 text-center">{product.productModel}</td>
                                    <td className="border px-4 py-2">{product.date}</td>
                                    <td className="border px-4 py-2">{product.totalBox} 箱</td>
                                    <td className="border px-4 py-2">{product.totalPallet}</td>
                                    <td className="border px-4 py-2">{finalData?.totalPalletNo}</td>
                                    <td className="border px-4 py-2">{finalData.remark}</td>
                                </tr>
                            ))}
                            {newRows.map((product, index) => (
                                <tr key={`new-${index}`} className="hover:bg-gray-100">
                                    <td className="border h-8">

                                        <textarea
                                            value={product.productModel}
                                            onChange={(e) => handleInputChange(index, 'productModel', e.target.value)}
                                            className=" border-t w-full h-full resize-none pl-3 whitespace-pre-wrap text-center"
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
                <button onClick={addRow} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Add Row
                </button>
                <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition" onClick={closeModal}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ChineseFormate;
