// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// // const DeviceTypeChart = ({ totalAppUser, deviceTypeCount = [] }) => {
// const DeviceTypeChart = ({ totalAppUser }) => {
//     const [deviceTypeCountLoading, setDeviceTypeCountLoading] = useState(true);
//     const [chartData, setChartData] = useState([]);


//     // Static data with more countries for demonstration
//     const deviceTypeCount = [
//         { country: "China", deviceTypeCounts: [{ deviceType: "Android", count: 25 }, { deviceType: "IOS", count: 19 }] },
//         { country: "Bangladesh", deviceTypeCounts: [{ deviceType: "Android", count: 13 }, { deviceType: "IOS", count: 12 }] },
//         { country: "Indonesia", deviceTypeCounts: [{ deviceType: "Android", count: 20 }, { deviceType: "IOS", count: 20 }] },
//         { country: "Malaysia", deviceTypeCounts: [{ deviceType: "Android", count: 20 }, { deviceType: "IOS", count: 10 }] },
//         { country: "Singapore", deviceTypeCounts: [{ deviceType: "Android", count: 10 }, { deviceType: "IOS", count: 22 }] },
//         { country: "Thailand", deviceTypeCounts: [{ deviceType: "Android", count: 18 }, { deviceType: "IOS", count: 16 }] },
//         { country: "Vietnam", deviceTypeCounts: [{ deviceType: "Android", count: 22 }, { deviceType: "IOS", count: 17 }] },
//         { country: "Philippines", deviceTypeCounts: [{ deviceType: "Android", count: 19 }, { deviceType: "IOS", count: 15 }] },
//     ];

//     const getChartWidth = (dataLength) => {
//         const minWidth = 800;
//         const widthPerItem = 100; // Reduced from 160 to 100 to bring bars closer
//         return Math.max(minWidth, dataLength * widthPerItem);
//     };

//     useEffect(() => {
//         if (deviceTypeCount) {
//             loadChartData();
//         }
//     }, [deviceTypeCount]);


//     const loadChartData = () => {
//         setDeviceTypeCountLoading(true);
//         try {
//             if (Array.isArray(deviceTypeCount)) {
//                 const formattedData = deviceTypeCount.map(country => ({
//                     name: country?.country,
//                     Android: country?.deviceTypeCounts.find(d => d?.deviceType === "Android")?.count || 0,
//                     IOS: country?.deviceTypeCounts.find(d => d?.deviceType === "IOS")?.count || 0
//                 }));
//                 setChartData(formattedData);
//             } else {
//                 console.error("deviceTypeCount is not an array:", deviceTypeCount);
//             }
//         } catch (error) {
//             console.error("Error loading chart data:", error);
//         } finally {
//             setDeviceTypeCountLoading(false);
//         }
//     };

//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active && payload && payload.length) {
//             return (
//                 <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
//                     <p className="font-semibold text-gray-800">{label}</p>
//                     {payload.map((entry, index) => (
//                         <p key={index} className="text-sm" style={{ color: entry.color }}>
//                             {entry.name}: {entry.value.toLocaleString()}
//                         </p>
//                     ))}
//                 </div>
//             );
//         }
//         return null;
//     };

//     const CustomLegend = ({ payload }) => {
//         return (
//             <div className="flex justify-start gap-6 mt-4 pl-8">
//                 {payload.map((entry, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                         <div
//                             className="w-5 h-5 rounded-full"
//                             style={{ backgroundColor: entry.color }}
//                         />
//                         <span className="text-base text-gray-600">{entry.value}</span>
//                     </div>
//                 ))}
//             </div>
//         );
//     };

//     const scrollbarStyles = `
//         .custom-scrollbar::-webkit-scrollbar {
//             height: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//             background: #F3F4F6;
//             border-radius: 3px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//             background: #D1D5DB;
//             border-radius: 3px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background: #9CA3AF;
//         }
//     `;

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md shadow-slate-100 hover:shadow-slate-300">
//             <style>{scrollbarStyles}</style>
//             <h3 className="text-xl font-semibold text-gray-800 mb-6">
//                 Device type counts by country
//                 {totalAppUser && <span className="font-bold">{` (Total Users: ${totalAppUser})`}</span>}
//             </h3>
//             <div className="h-[400px] overflow-x-auto custom-scrollbar">
//                 {deviceTypeCountLoading ? (
//                     <div className="flex items-center justify-center h-full">
//                         <div className="text-gray-500">Loading...</div>
//                     </div>
//                 ) : (
//                     <div style={{ width: `${getChartWidth(chartData.length)}px`, height: "100%" }}>
//                         <ResponsiveContainer width="100%" height="100%">

//                             <BarChart
//                                 data={chartData}
//                                 margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
//                                 barCategoryGap="30%" // Adjust spacing between bars
//                             >
//                                 <CartesianGrid
//                                     strokeDasharray="3 3"
//                                     vertical={false}
//                                     stroke="#E5E7EB"
//                                 />
//                                 <XAxis
//                                     dataKey="name"
//                                     axisLine={false}
//                                     tickLine={false}
//                                     tick={{ fill: '#6B7280' }}
//                                     interval={0} // Force show all labels
//                                 />
//                                 <YAxis
//                                     axisLine={false}
//                                     tickLine={false}
//                                     tick={{ fill: '#6B7280' }}
//                                     // tickFormatter={value => `${(value / 1000).toFixed(0)}k`}
//                                     tickFormatter={value => `${(value / 1).toFixed(0)}`}
//                                 />
//                                 <Tooltip
//                                     content={<CustomTooltip />}
//                                     cursor={{ fill: 'rgba(229, 231, 235, 0.1)' }}
//                                 />
//                                 <Legend content={<CustomLegend />} />
//                                 <Bar
//                                     dataKey="IOS"
//                                     fill="#E4E2FF"
//                                     barSize={16}
//                                     radius={[4, 4, 0, 0]}
//                                 />
//                                 <Bar
//                                     dataKey="Android"
//                                     fill="#6C5DD3"
//                                     barSize={16}
//                                     radius={[4, 4, 0, 0]}
//                                 />
//                             </BarChart>


//                         </ResponsiveContainer>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DeviceTypeChart;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    Tooltip, Legend, LabelList
} from 'recharts';
import DisplaySpinner from '../../../Shared/Loading/DisplaySpinner';

const DeviceTypeChart = ({ totalAppUser }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBarValues, setShowBarValues] = useState(false);
    const [unknownDeviceTotal, setUnknownDeviceTotal] = useState(0);


    const getChartWidth = (dataLength) => {
        const minWidth = 800;
        const widthPerItem = 100;
        return Math.max(minWidth, dataLength * widthPerItem);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    'https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/logininfo/user/by/countrywise/deviceTypeandtotal'
                );

                const rawData = response.data?.data || [];
                const countryMap = {};
                let unknownTotal = 0;

                rawData.forEach(({ country, deviceTypeCounts }) => {
                    const countryKey = (country || 'Unknown').trim().toLowerCase();
                    let android = 0;
                    let ios = 0;

                    deviceTypeCounts.forEach(({ deviceType, count }) => {
                        const type = deviceType?.trim().toLowerCase();
                        if (type === 'android') {
                            android += count;
                        } else if (type === 'ios') {
                            ios += count;
                        } else {
                            unknownTotal += count; // Sum all unknowns
                        }
                    });

                    if (android > 0 || ios > 0) {
                        if (!countryMap[countryKey]) {
                            countryMap[countryKey] = {
                                name: country.trim(),
                                Android: 0,
                                iOS: 0
                            };
                        }
                        countryMap[countryKey].Android += android;
                        countryMap[countryKey].iOS += ios;
                    }
                });

                const formatted = Object.values(countryMap)
                    .sort((a, b) => (b.Android + b.iOS) - (a.Android + a.iOS));

                setChartData(formatted);
                setUnknownDeviceTotal(unknownTotal); // ⬅️ Save unknown total
            } catch (err) {
                console.error("Error fetching device type data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);







    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        return (
            <div className="flex justify-start gap-6 mt-4 pl-8">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-base text-gray-600">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
  `;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md shadow-slate-100 hover:shadow-slate-300">
            <style>{scrollbarStyles}</style>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Device type counts by country
                {totalAppUser && (
                    <span className="font-bold ml-2">{`(Total Users: ${totalAppUser})`}</span>
                )}
                {unknownDeviceTotal > 0 && (
                    <p className="text-sm text-gray-500 ml-4">
                        Unknown device types: <strong>{unknownDeviceTotal.toLocaleString()}</strong>
                    </p>
                )}
            </h3>


            {/* Toggle for showing bar values */}
            <div className="flex items-center gap-2 mb-4">
                <input
                    id="showValuesToggle"
                    type="checkbox"
                    checked={showBarValues}
                    onChange={() => setShowBarValues(!showBarValues)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="showValuesToggle" className="text-sm text-gray-700 select-none">
                    Show bar values
                </label>
            </div>

            <div className="h-[400px] overflow-x-auto custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Loading...</div>
                    </div>
                ) : (
                    <div style={{ width: `${getChartWidth(chartData.length)}px`, height: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                                barCategoryGap="30%"
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280' }}
                                    interval={0}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280' }}
                                    tickFormatter={value => `${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(229, 231, 235, 0.1)' }} />
                                <Legend content={<CustomLegend />} />
                                {/* iOS Bar */}
                                <Bar dataKey="iOS" fill="#E4E2FF" barSize={16} radius={[4, 4, 0, 0]}>
                                    {showBarValues && (
                                        <LabelList dataKey="iOS" position="top" formatter={(val) => val.toLocaleString()} />
                                    )}
                                </Bar>

                                {/* Android Bar */}
                                <Bar dataKey="Android" fill="#6C5DD3" barSize={16} radius={[4, 4, 0, 0]}>
                                    {showBarValues && (
                                        <LabelList dataKey="Android" position="top" formatter={(val) => val.toLocaleString()} />
                                    )}
                                </Bar>

                                {/* Total Unknown Device Type Bar (Single) */}
                                {/* <Bar dataKey="Unknown" fill="#9CA3AF" barSize={16} radius={[4, 4, 0, 0]}>
                                    {showBarValues && (
                                        <LabelList dataKey="Unknown" position="top" formatter={(val) => val.toLocaleString()} />
                                    )}
                                </Bar> */}


                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeviceTypeChart;
