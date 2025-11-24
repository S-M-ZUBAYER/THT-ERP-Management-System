import { Link } from "react-router-dom";
import { HiRefresh } from "react-icons/hi";
import { IoIosRefresh } from "react-icons/io";
import BtnSpinner from "../../../Shared/Loading/BtnSpinner";
import DynamicBarChart from "./DeviceTypeChart";
import DynamicBarChart2 from "./PrinterModelChart";
import DeviceTypeChart from "./DeviceTypeChart";
import PrinterModelChart from "./PrinterModelChart";

const Dashboard = ({
  user,
  userInfo,
  totalAppUser,
  todayAppSignUpUser,
  yesterdayAppSignUpUser,
  DBYAppSignUpUser,
  dateWiseSignUpLoading,
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
  const singleCard = [
    {
      link: "/admin/users",
      logo: usersLogo,
      label: "Total User",
      count: userLoading ? <BtnSpinner /> : allUsers?.length || 0,
    },
    {
      link: "/admin/icon",
      logo: IconsLogo,
      label: "Icon Categories",
      count: categoriesLoading ? <BtnSpinner /> : categories?.length || 0,
    },
    {
      link: "/admin/mallProduct",
      logo: mallLogo,
      label: "Mall Product",
      count: mallLoading ? <BtnSpinner /> : mallProduct?.length || 0,
    },
    {
      link: "/admin/eventProduct",
      logo: eventLogo,
      label: "Event Product",
      count: eventLoading ? <BtnSpinner /> : eventProduct?.length || 0,
    },
    {
      logo: androidLogo,
      label: "Android User",
      count: deviceTypeTotalCountLoading ? (
        <BtnSpinner />
      ) : (
        deviceTypeTotalCount.Android || 0
      ),
    },
    {
      logo: iosLogo,
      label: "IOS User",
      count: deviceTypeTotalCountLoading ? (
        <BtnSpinner />
      ) : (
        deviceTypeTotalCount.iOS || 0
      ),
    },
  ];

  const secondRowCard = [
    {
      title: "Sign Up Count",
      logo: loginLogo,
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
      data: [
        {
          logo: loginLogo,
          label: "Today",
          count: todayLoginApiCountLoading ? (
            <BtnSpinner />
          ) : (
            todayLoginApiCount
          ),
        },
        {
          logo: usersLogo,
          label: "Total",
          count: modelLoginApiCountLoading ? <BtnSpinner /> : loginApiCount,
        },
      ],
    },
    {
      title: "Wi-Fi Count",
      logo: wifiLogo,
      data: [
        {
          logo: wifiLogo,
          label: "Today",
          count: modelApiCountLoading ? (
            <BtnSpinner />
          ) : (
            modelApiCount?.wifiCount
          ),
        },
        {
          logo: wifiManyLogo,
          label: "Total",
          count: modelApiCountLoading ? (
            <BtnSpinner />
          ) : (
            modelApiCount?.wifiTotalCount
          ),
        },
      ],
    },
    {
      title: "Bluetooth Count",
      logo: BluetoothLogo,
      data: [
        {
          logo: BluetoothLogo,
          label: "Today",
          count: modelApiCountLoading ? (
            <BtnSpinner />
          ) : (
            modelApiCount?.bluetoothCount
          ),
        },
        {
          logo: BluetoothManyLogo,
          label: "Total",
          count: modelApiCountLoading ? (
            <BtnSpinner />
          ) : (
            modelApiCount?.bluetoothTotalCount
          ),
        },
      ],
    },
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
        <div className="pt-2  pr-6">
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
        <div className="container mb-6 grid grid-cols-2 mx-auto sm:grid-cols-2 xl:grid-cols-6 md:grid-cols-4 gap-3 xl:mb-3">
          {singleCard?.map((item, index) => (
            <Link
              key={index}
              to={item.link || "#"}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-duration="2000"
              className="flex w-48 h-24 justify-start items-center rounded-2xl  bg-white text-gray-800 shadow-slate-100 shadow-md hover:shadow-lg transition-shadow md:mb-2 sm:w-full"
            >
              <div className="flex justify-center items-center pl-3 ">
                <img
                  className="w-12 h-12 rounded-full "
                  src={item.logo}
                  alt={`${item.label} logo`}
                />
              </div>
              <div className="flex flex-col justify-start items-center pl-2">
                <p className="capitalize font-normal">{item.label}</p>
                <p className="text-2xl font-bold text-start w-full">
                  {item.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="container grid grid-cols-1 mt-6 md:mt-0  sm:grid-cols-2 xl:grid-cols-4 xl:mt-0 gap-6 mx-auto">
          {secondRowCard.map((item, index) => (
            <div
              key={index}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-duration="2000"
              className="flex flex-col p-6 bg-white rounded-2xl shadow-md shadow-slate-100 hover:shadow-lg transition-shadow"
            >
              {/* Icon and Title */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="">
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
      <div className="grid grid-cols-2 gap-6 px-5 pb-10">
        <DeviceTypeChart
          totalAppUser={totalAppUser}
          totalAppUserLoading={totalAppUserLoading}
          deviceTypeCount={deviceTypeCount}
        />
        <PrinterModelChart />
      </div>
      {/* <DynamicBarChart
                deviceTypeCount={deviceTypeCount}
            />
            <DynamicBarChart2 /> */}
    </div>
  );
};

export default Dashboard;
