import React, { useEffect, useState } from "react";
import HomeCharts from "./HomeChart";
import axios from "axios";

function Home() {
  const [pending, setPending] = useState({
    pendingAccount: 0,
    createdAccount: 0,
    disabledAccount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://grozziieget.zjweiting.com:8033/tht/multiVendorPaymentInfo/all"
        );
        const result = response.data.data || [];

        const pendingData = result.filter(
          (item) => item.account_creation_status === 0
        ).length;

        const createdData = result.filter(
          (item) => item.account_creation_status === 1
        ).length;

        const disabledData = result.filter(
          (item) => item.disableStatus === 1
        ).length;

        setPending({
          pendingAccount: pendingData,
          createdAccount: createdData,
          disabledAccount: disabledData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5 space-y-10 w-full flex flex-col md:flex-row gap-5">
      <div className="w-full md:w-[80%]">
        <h1 className="font-[600] text-gray-800">Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg text-center">
            <h2 className="text-gray-700 mb-2">Pending Account</h2>
            <p className="text-3xl font-bold text-blue-900">
              {pending.pendingAccount}
            </p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg text-center">
            <h2 className="text-gray-700 mb-2">Created Account</h2>
            <p className="text-3xl font-bold text-green-900">
              {pending.createdAccount}
            </p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg text-center">
            <h2 className="text-gray-700 mb-2">Disabled Account</h2>
            <p className="text-3xl font-bold text-red-900">
              {pending.disabledAccount}
            </p>
          </div>
        </div>

        <HomeCharts />
      </div>

      <div className="w-full md:w-[20%] bg-white p-4 rounded-lg shadow-sm">
        {/* Notification & Recent Seller section */}
        <div className="space-y-6">
          {/* Notification */}
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Notification</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 mt-2 rounded-full bg-green-500"></span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">
                    New subscription added
                  </h3>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 mt-2 rounded-full bg-blue-500"></span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">
                    Seller request received
                  </h3>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-2 w-2 mt-2 rounded-full bg-red-500"></span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">
                    Account disabled
                  </h3>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Recent Seller */}
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Recent Seller</h2>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">
                      John Doe
                    </h3>
                    <p className="text-xs text-gray-500">
                      Joined: Apr 20, 2025
                    </p>
                  </div>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">
                      Jane Smith
                    </h3>
                    <p className="text-xs text-gray-500">
                      Joined: Apr 22, 2025
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
