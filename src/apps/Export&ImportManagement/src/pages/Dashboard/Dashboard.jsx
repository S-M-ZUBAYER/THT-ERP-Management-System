import React from "react";
import { AiOutlineUser, AiOutlineShoppingCart, AiOutlineBarChart, AiOutlineRise } from "react-icons/ai"; // Icons
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"; // Example chart

// Sample data for the chart
const data = [
  { name: "Jan", uv: 4000 },
  { name: "Feb", uv: 3000 },
  { name: "Mar", uv: 5000 },
  { name: "Apr", uv: 4780 },
  { name: "May", uv: 5890 },
  { name: "Jun", uv: 4390 },
  { name: "Jul", uv: 4490 },
];

const Dashboard = () => {
  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-blue-900">Dashboard Overview</h1>
        <button className="btn btn-info px-10 active:scale-[.98] active:duration-75 hover:scale-[1.03] ease-in-out transition-all py-3 rounded-lg bg-violet-500 text-white font-bold hover:text-black">Generate Report</button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <AiOutlineUser className="text-4xl text-blue-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Users</h2>
            <p className="text-2xl font-bold">1,245</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <AiOutlineShoppingCart className="text-4xl text-green-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Orders</h2>
            <p className="text-2xl font-bold">530</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <AiOutlineBarChart className="text-4xl text-purple-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-2xl font-bold">$34,500</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <AiOutlineRise className="text-4xl text-red-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Growth</h2>
            <p className="text-2xl font-bold">15%</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Bar / Progress */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Purchasing Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Malaysia</span>
              <span className="font-semibold">75%</span>
            </div>
            <div className="bg-gray-200 h-4 rounded-full">
              <div className="bg-yellow-500 h-full rounded-full" style={{ width: "75%" }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span>China</span>
              <span className="font-semibold">80%</span>
            </div>
            <div className="bg-gray-200 h-4 rounded-full">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: "80%" }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span>Philippines</span>
              <span className="font-semibold">45%</span>
            </div>
            <div className="bg-gray-200 h-4 rounded-full">
              <div className="bg-green-500 h-full rounded-full" style={{ width: "45%" }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span>Indonesia</span>
              <span className="font-semibold">65%</span>
            </div>
            <div className="bg-gray-200 h-4 rounded-full">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: "65%" }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span>Thailand</span>
              <span className="font-semibold">55%</span>
            </div>
            <div className="bg-gray-200 h-4 rounded-full">
              <div className="bg-red-500 h-full rounded-full" style={{ width: "55%" }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span>Vietnam</span>
              <span className="font-semibold">70%</span>
            </div>
            <div className="bg-gray-200 h-4 rounded-full">
              <div className="bg-pink-500 h-full rounded-full" style={{ width: "70%" }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-gray-600">© 2024 THT Dashboard. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Dashboard;
