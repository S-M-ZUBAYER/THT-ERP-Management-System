// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../../../../context/UserContext';

// const DynamicBarChart2 = () => {
//     const { user } = useContext(AuthContext);
//     const [totalModelLoading, setTotalModelLoading] = useState(true);
//     const [totalModel, setTotalModel] = useState({});
//     const [totalUser, setTotalUser] = useState(10);

//     // Array of 20 different colors for the bars
//     const barColors = [
//         'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
//         'bg-indigo-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-lime-500',
//         'bg-emerald-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-rose-500', 'bg-violet-500',
//         'bg-amber-500', 'bg-zinc-500', 'bg-sky-500', 'bg-slate-500', 'bg-neutral-500'
//     ];

//     // useEffect to call the data fetching functions on user login
//     useEffect(() => {
//         if (user?.email) {
//             fetchTotalPrinterModel();
//             fetchTotalUser();
//         }
//     }, [user?.email]);

//     // Fetches printer model data
//     const fetchTotalPrinterModel = async () => {
//         setTotalModelLoading(true);
//         try {
//             const response = await fetch('https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/logininfo/user/by/printerModel');
//             if (!response.ok) throw new Error('Failed to fetch printer model data');
//             const data = await response.json();
//             setTotalModel(data);
//         } catch (error) {
//             console.error("Error fetching printer model data:", error);
//         } finally {
//             setTotalModelLoading(false);
//         }
//     };

//     // Fetches total user count data
//     const fetchTotalUser = async () => {
//         try {
//             const response = await fetch('https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/user/page?page=1&size=1');
//             if (!response.ok) throw new Error('Failed to fetch total user count');
//             const data = await response.json();
//             // setTotalUser(data.totalElements);
//         } catch (error) {
//             console.error("Error fetching total user count:", error);
//         }
//     };

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//             <h3 className="text-3xl text-gray-500 font-bold mb-5">Printer Model Counts</h3>
//             <div className="space-y-4">
//                 {totalModelLoading ? (
//                     <div>Loading...</div>
//                 ) : (
//                     Object.keys(totalModel).map((model, index) => {
//                         const count = totalModel[model];
//                         const widthPercentage = (count / totalUser) * 100;

//                         // Cycle through the color array based on the index of the model
//                         const barColor = barColors[index % barColors.length];

//                         return (
//                             <div key={index} className="mb-4">
//                                 <div className="flex justify-between items-center">
//                                     <span>{model}</span>
//                                     <span className="font-semibold">{count}</span>
//                                 </div>
//                                 <div className="bg-gray-200 h-4 rounded-full">
//                                     <div
//                                         className={`h-full rounded-full ${barColor}`}
//                                         style={{ width: `${widthPercentage}%` }}
//                                     ></div>
//                                 </div>
//                             </div>
//                         );
//                     })
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DynamicBarChart2;
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context/UserContext';

const PrinterModelChart = () => {
    const { user } = useContext(AuthContext);
    const [totalModelLoading, setTotalModelLoading] = useState(true);
    const [printerModels, setPrinterModels] = useState([]);
    const [hoveredModel, setHoveredModel] = useState(null);


    // Static data for demonstration
    const staticPrinterModels = [
        { model: "TP580", count: 23400 },
        { model: "TP581", count: 45600 },
        { model: "TP582", count: 67800 },
        { model: "TP583", count: 89100 },
        { model: "TP584", count: 110300 },
        { model: "TP585", count: 132500 },
        { model: "TP586", count: 154700 },
        { model: "TP587", count: 175900 }
    ];

    // Array of 20 different colors for the bars
    const barColors = [
        'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-[#F5F4B3]', 'bg-purple-200',
        'bg-indigo-200', 'bg-pink-200', 'bg-teal-200', 'bg-orange-200', 'bg-lime-200',
        'bg-emerald-200', 'bg-cyan-200', 'bg-fuchsia-200', 'bg-rose-200', 'bg-violet-200',
        'bg-amber-200', 'bg-zinc-200', 'bg-sky-200', 'bg-slate-200', 'bg-neutral-200'
    ];

    useEffect(() => {
        if (user?.email) {
            fetchTotalPrinterModel();
        }
    }, [user?.email]);

    const fetchTotalPrinterModel = async () => {
        setTotalModelLoading(true);
        try {
            setPrinterModels(staticPrinterModels);
        } catch (error) {
            console.error("Error fetching printer model data:", error);
        } finally {
            setTotalModelLoading(false);
        }
    };
    // Fetches printer model data
    // const fetchTotalPrinterModel = async () => {
    //     setTotalModelLoading(true);
    //     try {
    //         const response = await fetch('https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/logininfo/user/by/printerModel');
    //         if (!response.ok) throw new Error('Failed to fetch printer model data');
    //         const data = await response.json();
    //         console.log(data);
    //         const printerModels = Object.entries(data).map(([model, count]) => ({
    //             model,
    //             count,
    //         }));
    //         setPrinterModels(printerModels);
    //     } catch (error) {
    //         console.error("Error fetching printer model data:", error);
    //     } finally {
    //         setTotalModelLoading(false);
    //     }
    // };
    const maxCount = Math.max(...printerModels.map(model => model.count));

    // Custom scroll styling
    const scrollbarStyles = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #F3F4F6;
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #D1D5DB;
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9CA3AF;
        }
    `;
    console.log(printerModels);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md shadow-slate-100 hover:shadow-slate-300 relative">
            <style>{scrollbarStyles}</style>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Printer Model Counts
            </h3>
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                {totalModelLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="text-gray-500">Loading...</div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {printerModels.map((model, index) => (
                            <div
                                key={index}
                                className="space-y-2"
                                onMouseEnter={() => setHoveredModel(model)}
                                onMouseLeave={() => setHoveredModel(null)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-700">
                                        {model.model}
                                    </span>
                                    <span className="text-gray-600">
                                        {model.count.toLocaleString()}
                                    </span>
                                </div>
                                <div className="bg-gray-100 h-2 rounded-full overflow-hidden relative">
                                    <div
                                        className={`${barColors[index % barColors.length]} h-full rounded-full transition-all duration-500 ease-in-out`}
                                        style={{
                                            width: `${(model.count / maxCount) * 100}%`,
                                        }}
                                    />
                                    {/* Tooltip on hover */}
                                    {hoveredModel === model && (
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                                            {model.model}: {model.count.toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrinterModelChart;
