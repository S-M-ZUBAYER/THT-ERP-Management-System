// import { Link } from 'react-router-dom';
// import { HiRefresh } from 'react-icons/hi';
// import { IoIosRefresh } from "react-icons/io";
// import BtnSpinner from '../../../Shared/Loading/BtnSpinner';
// import DynamicBarChart from './DeviceTypeChart';
// import DynamicBarChart2 from './PrinterModelChart';
// import DeviceTypeChart from './DeviceTypeChart';
// import PrinterModelChart from './PrinterModelChart';

// const Dashboard = ({
//     user,
//     userInfo,
//     todayAppSignUpUser,
//     yesterdayAppSignUpUser,
//     DBYAppSignUpUser,
//     dateWiseSignUpLoading,
//     totalAppUser,
//     totalAppUserLoading,
//     handleCount,
//     userLoading,
//     allUsers,
//     categoriesLoading,
//     categories,
//     mallLoading,
//     mallProduct,
//     eventLoading,
//     eventProduct,
//     todayLoginApiCountLoading,
//     todayLoginApiCount,
//     modelLoginApiCountLoading,
//     loginApiCount,
//     modelApiCountLoading,
//     modelApiCount,
//     deviceTypeCountLoading,
//     deviceTypeTotalCount,
//     deviceTypeTotalCountLoading,
//     deviceTypeCount,
//     usersLogo,
//     IconsLogo,
//     mallLogo,
//     eventLogo,
//     loginLogo,
//     wifiLogo,
//     wifiManyLogo,
//     BluetoothLogo,
//     BluetoothManyLogo,
//     androidLogo,
//     iosLogo,
// }) => {

//     const singleCard = [
//         { link: '/admin/users', logo: usersLogo, label: 'Total User', count: userLoading ? <BtnSpinner /> : allUsers?.length || 0 },
//         { link: '/admin/icon', logo: IconsLogo, label: 'Icon Categories', count: categoriesLoading ? <BtnSpinner /> : categories?.length || 0 },
//         { link: '/admin/mallProduct', logo: mallLogo, label: 'Mall Product', count: mallLoading ? <BtnSpinner /> : mallProduct?.length || 0 },
//         { link: '/admin/eventProduct', logo: eventLogo, label: 'Event Product', count: eventLoading ? <BtnSpinner /> : eventProduct?.length || 0 },
//         { logo: androidLogo, label: 'Android User', count: deviceTypeTotalCountLoading ? <BtnSpinner /> : deviceTypeTotalCount.Android || 0 },
//         { logo: iosLogo, label: 'IOS User', count: deviceTypeTotalCountLoading ? <BtnSpinner /> : deviceTypeTotalCount.iOS || 0 }
//     ];

//     const secondRowCard = [
//         {
//             title: "Sign Up Count",
//             logo: loginLogo,
//             data: [
//                 {
//                     logo: usersLogo,
//                     label: "D-B-Y",
//                     count: dateWiseSignUpLoading ? <BtnSpinner /> : DBYAppSignUpUser,
//                 },
//                 {
//                     logo: usersLogo,
//                     label: "Yesterday",
//                     count: dateWiseSignUpLoading ? (
//                         <BtnSpinner />
//                     ) : (
//                         yesterdayAppSignUpUser
//                     ),
//                 },
//                 {
//                     logo: loginLogo,
//                     label: "Today",
//                     count: dateWiseSignUpLoading ? <BtnSpinner /> : todayAppSignUpUser,
//                 },
//             ],
//         },
//         {
//             title: "Log In Count",
//             logo: loginLogo,
//             data: [
//                 {
//                     logo: loginLogo,
//                     label: "Today",
//                     count: todayLoginApiCountLoading ? (
//                         <BtnSpinner />
//                     ) : (
//                         todayLoginApiCount
//                     ),
//                 },
//                 {
//                     logo: usersLogo,
//                     label: "Total",
//                     count: modelLoginApiCountLoading ? <BtnSpinner /> : loginApiCount,
//                 },
//             ],
//         },
//         {
//             title: "Wi-Fi Count",
//             logo: wifiLogo,
//             data: [
//                 {
//                     logo: wifiLogo,
//                     label: "Today",
//                     count: modelApiCountLoading ? (
//                         <BtnSpinner />
//                     ) : (
//                         modelApiCount?.wifiCount
//                     ),
//                 },
//                 {
//                     logo: wifiManyLogo,
//                     label: "Total",
//                     count: modelApiCountLoading ? (
//                         <BtnSpinner />
//                     ) : (
//                         modelApiCount?.wifiTotalCount
//                     ),
//                 },
//             ],
//         },
//         {
//             title: "Bluetooth Count",
//             logo: BluetoothLogo,
//             data: [
//                 {
//                     logo: BluetoothLogo,
//                     label: "Today",
//                     count: modelApiCountLoading ? (
//                         <BtnSpinner />
//                     ) : (
//                         modelApiCount?.bluetoothCount
//                     ),
//                 },
//                 {
//                     logo: BluetoothManyLogo,
//                     label: "Total",
//                     count: modelApiCountLoading ? (
//                         <BtnSpinner />
//                     ) : (
//                         modelApiCount?.bluetoothTotalCount
//                     ),
//                 },
//             ],
//         },
//     ];

//     return (
//         <div>
//             <div className="flex justify-between items-start pt-5">
//                 <section className="ml-5 flex justify-start items-center">
//                     <div>
//                         <img className="w-20 h-20 rounded-full" src={user?.image} alt={`${user?.name} logo`} />
//                     </div>
//                     <div className="text-start ml-2">
//                         <p className="font-base text-base text-black">Welcome to your dashboard</p>
//                         <p className="font-bold text-2xl">{user?.name}</p>
//                     </div>

//                 </section>
//                 <div className="pt-2  pr-6">
//                     <button onClick={handleCount} className="flex justify-center items-center bg-white py-1 px-2 rounded-xl cursor-pointer">
//                         <IoIosRefresh />
//                         <p className="ml-1 cursor-pointer"> Refresh</p>
//                     </button>
//                 </div>
//             </div>

//             <section className="relative p-6 py-6 pt-7 text-gray-800 mb-16 ">

//                 <div className="container mb-6 grid grid-cols-2 mx-auto sm:grid-cols-2 xl:grid-cols-6 md:grid-cols-4 gap-3 xl:mb-3">

//                     {singleCard?.map((item, index) => (
//                         <Link
//                             key={index}
//                             to={item.link || '#'}
//                             data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
//                             data-aos-duration="2000"
//                             className="flex w-48 h-24 justify-start items-center rounded-2xl  bg-white text-gray-800 shadow-slate-100 shadow-md hover:shadow-lg transition-shadow md:mb-2 sm:w-full"
//                         >
//                             <div className="flex justify-center items-center pl-3 ">
//                                 <img className="w-12 h-12 rounded-full " src={item.logo} alt={`${item.label} logo`} />
//                             </div>
//                             <div className="flex flex-col justify-start items-center pl-2">
//                                 <p className="capitalize font-normal">{item.label}</p>
//                                 <p className="text-2xl font-bold text-start w-full">{item.count}</p>
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//                 <div className="container grid grid-cols-1 mt-6 md:mt-0  sm:grid-cols-2 xl:grid-cols-4 xl:mt-0 gap-6 mx-auto">
//                     {secondRowCard.map((item, index) => (
//                         <div
//                             key={index}
//                             data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
//                             data-aos-duration="2000"
//                             className="flex flex-col p-6 bg-white rounded-2xl shadow-md shadow-slate-100 hover:shadow-lg transition-shadow"
//                         >
//                             {/* Icon and Title */}
//                             <div className="flex items-center space-x-4 mb-4">
//                                 <div className="">
//                                     <img
//                                         className="w-12 h-12"
//                                         src={item.logo}
//                                         alt={`${item.title} logo`}
//                                     />
//                                 </div>
//                                 <p className="text-xl font-semibold text-gray-500">
//                                     {item.title}
//                                 </p>
//                             </div>

//                             {/* Data */}
//                             <div className="flex justify-start gap-10 pl-1">
//                                 {item.data.map((dataItem, dataIndex) => (
//                                     <div key={dataIndex} className="flex flex-col items-start">
//                                         <p className="text-sm font-normal text-gray-800">
//                                             {dataItem.label}
//                                         </p>
//                                         <p className="text-xl font-bold text-gray-800">
//                                             {dataItem.count}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </section>
//             <div className="grid grid-cols-2 gap-6 px-5 pb-10">
//                 <DeviceTypeChart
//                     totalAppUser={totalAppUser}
//                     totalAppUserLoading={totalAppUserLoading}
//                     deviceTypeCount={deviceTypeCount}
//                 />
//                 <PrinterModelChart />
//             </div>
//             {/* <DynamicBarChart
//                 deviceTypeCount={deviceTypeCount}
//             />
//             <DynamicBarChart2 /> */}
//         </div>

//     )
// };

// export default Dashboard;

import { useState } from "react";
import { Link } from "react-router-dom";
import { HiRefresh } from "react-icons/hi";
import { IoIosRefresh } from "react-icons/io";
import { X } from "lucide-react";
import { Download } from "lucide-react";
import BtnSpinner from "../../../Shared/Loading/BtnSpinner";
import DynamicBarChart from "./DeviceTypeChart";
import DynamicBarChart2 from "./PrinterModelChart";
import DeviceTypeChart from "./DeviceTypeChart";
import PrinterModelChart from "./PrinterModelChart";
import ExcelJS from "exceljs";

const Dashboard = ({
  user,
  userInfo,
  todayAppSignUpUser,
  yesterdayAppSignUpUser,
  DBYAppSignUpUser,
  dateWiseSignUpLoading,
  todayAppLogOpenUser,
  yesterdayAppLogOpenUser,
  DBYAppLogOpenUser,
  dateWiseLogOpenLoading,
  totalAppUser,
  totalAppUserLoading,
  handleCount,
  userLoading,
  allUsers,
  categoriesLoading,
  categories,
  mallLoading,
  mallProduct,
  eventLoading,
  eventProduct,
  todayLoginApiCountLoading,
  todayLoginApiCount,
  modelLoginApiCountLoading,
  loginApiCount,
  modelApiCountLoading,
  modelApiCount,
  deviceTypeCountLoading,
  deviceTypeTotalCount,
  deviceTypeTotalCountLoading,
  deviceTypeCount,
  usersLogo,
  IconsLogo,
  mallLogo,
  eventLogo,
  loginLogo,
  wifiLogo,
  wifiManyLogo,
  BluetoothLogo,
  BluetoothManyLogo,
  androidLogo,
  iosLogo,
}) => {
  // const singleCard = [
  //     { link: '/admin/users', logo: usersLogo, label: 'Total User', count: userLoading ? <BtnSpinner /> : allUsers?.length || 0 },
  //     { link: '/admin/icon', logo: IconsLogo, label: 'Icon Categories', count: categoriesLoading ? <BtnSpinner /> : categories?.length || 0 },
  //     { link: '/admin/mallProduct', logo: mallLogo, label: 'Mall Product', count: mallLoading ? <BtnSpinner /> : mallProduct?.length || 0 },
  //     { link: '/admin/eventProduct', logo: eventLogo, label: 'Event Product', count: eventLoading ? <BtnSpinner /> : eventProduct?.length || 0 },
  //     { logo: androidLogo, label: 'Android User', count: deviceTypeTotalCountLoading ? <BtnSpinner /> : deviceTypeTotalCount.Android || 0 },
  //     { logo: iosLogo, label: 'IOS User', count: deviceTypeTotalCountLoading ? <BtnSpinner /> : deviceTypeTotalCount.iOS || 0 }
  // ];

  console.log(user, "user..........");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [exportType, setExportType] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  // API functions
  const fetchSignupData = async (start, end) => {
    const response = await fetch(
      `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/dev/logininfo/signup/userCountByDateList?startDate=${start}&endDate=${end}`,
    );
    return await response.json();
  };

  const fetchLoginData = async (start, end) => {
    const response = await fetch(
      `https://grozziieget.zjweiting.com:3091/CustomerService-Chat/api/app/by-between?dateFrom=${start}&dateTo=${end}`,
    );
    return await response.json();
  };

  // Excel export functions
  const exportSignupToExcel = async (data, startDate, endDate) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sign Up Data");

    worksheet.columns = [
      { header: "Date", key: "date", width: 20 },
      { header: "Sign Up Count", key: "count", width: 20 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4CAF50" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    let totalCount = 0;
    data.forEach(([date, count]) => {
      worksheet.addRow({ date, count });
      totalCount += count;
    });

    worksheet.addRow([]);
    const summaryRow = worksheet.addRow(["SUMMARY", ""]);
    worksheet.addRow(["Date Range", `${startDate} to ${endDate}`]);
    worksheet.addRow(["Total Sign Ups", totalCount]);

    summaryRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `signup_data_${startDate}_to_${endDate}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportLoginToExcel = async (data, startDate, endDate) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Login Data");

    worksheet.columns = [
      { header: "Date", key: "date", width: 20 },
      { header: "Login Count", key: "openCount", width: 25 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2196F3" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    let totalCount = 0;
    data.forEach((item) => {
      worksheet.addRow({ date: item.date, openCount: item.openCount });
      totalCount += item.openCount;
    });

    worksheet.addRow([]);
    const summaryRow = worksheet.addRow(["SUMMARY", ""]);
    worksheet.addRow(["Date Range", `${startDate} to ${endDate}`]);
    worksheet.addRow(["Total Logins", totalCount]);

    summaryRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `login_data_${startDate}_to_${endDate}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Handler functions
  const handleExportClick = (type) => {
    setExportType(type);
    setShowDatePicker(true);
  };

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be later than end date");
      return;
    }

    setExportLoading(true);

    try {
      if (exportType === "signup") {
        const data = await fetchSignupData(startDate, endDate);
        await exportSignupToExcel(data, startDate, endDate);
      } else if (exportType === "login") {
        const data = await fetchLoginData(startDate, endDate);
        await exportLoginToExcel(data, startDate, endDate);
      }

      setShowDatePicker(false);
      setStartDate("");
      setEndDate("");
      setExportType(null);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleCancel = () => {
    setShowDatePicker(false);
    setStartDate("");
    setEndDate("");
    setExportType(null);
  };

  const secondRowCard = [
    {
      title: "Sign Up Count",
      logo: loginLogo,
      type: "signup",
      data: [
        {
          logo: usersLogo,
          label: "D-B-Y",
          count: dateWiseSignUpLoading ? <BtnSpinner /> : DBYAppSignUpUser,
        },
        {
          logo: usersLogo,
          label: "Yesterday",
          count: dateWiseSignUpLoading ? (
            <BtnSpinner />
          ) : (
            yesterdayAppSignUpUser
          ),
        },
        {
          logo: loginLogo,
          label: "Today",
          count: dateWiseSignUpLoading ? <BtnSpinner /> : todayAppSignUpUser,
        },
      ],
    },
    {
      title: "Log In Count",
      logo: loginLogo,
      type: "login",
      data: [
        {
          logo: loginLogo,
          label: "D-B-Y",
          count: dateWiseLogOpenLoading ? (
            <BtnSpinner />
          ) : (
            DBYAppLogOpenUser?.openCount
          ),
        },
        {
          logo: loginLogo,
          label: "Yesterday",
          count: dateWiseLogOpenLoading ? (
            <BtnSpinner />
          ) : (
            yesterdayAppLogOpenUser?.openCount
          ),
        },
        {
          logo: usersLogo,
          label: "Today",
          count: dateWiseLogOpenLoading ? (
            <BtnSpinner />
          ) : (
            todayAppLogOpenUser?.openCount
          ),
        },
      ],
    },
    // {
    //     title: "Wi-Fi Count",
    //     logo: wifiLogo,
    //     data: [
    //         {
    //             logo: wifiLogo,
    //             label: "Today",
    //             count: modelApiCountLoading ? (
    //                 <BtnSpinner />
    //             ) : (
    //                 modelApiCount?.wifiCount
    //             ),
    //         },
    //         {
    //             logo: wifiManyLogo,
    //             label: "Total",
    //             count: modelApiCountLoading ? (
    //                 <BtnSpinner />
    //             ) : (
    //                 modelApiCount?.wifiTotalCount
    //             ),
    //         },
    //     ],
    // },
    // {
    //     title: "Bluetooth Count",
    //     logo: BluetoothLogo,
    //     data: [
    //         {
    //             logo: BluetoothLogo,
    //             label: "Today",
    //             count: modelApiCountLoading ? (
    //                 <BtnSpinner />
    //             ) : (
    //                 modelApiCount?.bluetoothCount
    //             ),
    //         },
    //         {
    //             logo: BluetoothManyLogo,
    //             label: "Total",
    //             count: modelApiCountLoading ? (
    //                 <BtnSpinner />
    //             ) : (
    //                 modelApiCount?.bluetoothTotalCount
    //             ),
    //         },
    //     ],
    // },
  ];

  return (
    <div>
      <div className="flex justify-between items-start pt-5">
        <section className="ml-5 flex justify-start items-center">
          <div>
            <img
              className="w-20 h-20 rounded-full"
              src={user?.image}
              alt={`${user?.name} logo`}
            />
          </div>
          <div className="text-start ml-2">
            <p className="font-base text-base text-black">
              Welcome to your dashboard
            </p>
            <p className="font-bold text-2xl">{user?.name}</p>
          </div>
        </section>
        <div className="pt-2 pr-6">
          <button
            onClick={handleCount}
            className="flex justify-center items-center bg-white py-1 px-2 rounded-xl cursor-pointer"
          >
            <IoIosRefresh />
            <p className="ml-1 cursor-pointer"> Refresh</p>
          </button>
        </div>
      </div>

      <section className="relative p-6 py-6 pt-7 text-gray-800 mb-16 ">
        {/* <div className="container mb-6 grid grid-cols-2 mx-auto sm:grid-cols-2 xl:grid-cols-6 md:grid-cols-4 gap-3 xl:mb-3">
                    {singleCard?.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link || '#'}
                            data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                            data-aos-duration="2000"
                            className="flex w-48 h-24 justify-start items-center rounded-2xl  bg-white text-gray-800 shadow-slate-100 shadow-md hover:shadow-lg transition-shadow md:mb-2 sm:w-full"
                        >
                            <div className="flex justify-center items-center pl-3 ">
                                <img className="w-12 h-12 rounded-full " src={item.logo} alt={`${item.label} logo`} />
                            </div>
                            <div className="flex flex-col justify-start items-center pl-2">
                                <p className="capitalize font-normal">{item.label}</p>
                                <p className="text-2xl font-bold text-start w-full">{item.count}</p>
                            </div>
                        </Link>
                    ))}
                </div> */}

        <div className="container grid grid-cols-1 mt-6 md:mt-0 sm:grid-cols-2 xl:grid-cols-2 xl:mt-0 gap-6 mx-auto">
          {secondRowCard.map((item, index) => (
            <div
              key={index}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-duration="2000"
              className="flex flex-col p-6 bg-white rounded-2xl shadow-md shadow-slate-100 hover:shadow-lg transition-shadow"
            >
              {/* Icon and Title with Export Button */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <img
                      className="w-12 h-12"
                      src={item.logo}
                      alt={`${item.title} logo`}
                    />
                  </div>
                  <p className="text-xl font-semibold text-gray-500">
                    {item.title}
                  </p>
                </div>
                <button
                  onClick={() => handleExportClick(item.type)}
                  className="flex items-center gap-1 px-5 py-1.5 bg-[#004368] text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  title="Export to Excel"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              {/* Data */}
              <div className="flex justify-start gap-10 pl-1">
                {item.data.map((dataItem, dataIndex) => (
                  <div key={dataIndex} className="flex flex-col items-start">
                    <p className="text-sm font-normal text-gray-800">
                      {dataItem.label}
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {dataItem.count}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 px-5 pb-10">
        <DeviceTypeChart
          totalAppUser={totalAppUser}
          totalAppUserLoading={totalAppUserLoading}
          deviceTypeCount={deviceTypeCount}
          deviceTypeTotalCount={deviceTypeTotalCount}
        />
        {/* <PrinterModelChart /> */}
      </div>

      {/* <DynamicBarChart
                deviceTypeCount={deviceTypeCount}
            />
            <DynamicBarChart2 /> */}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Select Date Range
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={exportLoading}
                className="flex-1 px-5 py-2 bg-[#004368] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {exportLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
