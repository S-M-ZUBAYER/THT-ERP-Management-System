import React from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const subscriptionData = [
  { name: "Jul", subscribers: 10 },
  { name: "Aug", subscribers: 20 },
  { name: "Sep", subscribers: 30 },
  { name: "Oct", subscribers: 80 },
  { name: "Nov", subscribers: 40 },
  { name: "Dec", subscribers: 35 },
  { name: "Jan", subscribers: 65 },
];

const sellersData = [
  { name: "USA", value: 400 },
  { name: "Europe", value: 300 },
  { name: "Asia", value: 300 },
  { name: "Africa", value: 200 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

function HomeCharts() {
  return (
    <div className="space-y-8 pt-6">
      {/* Subscription History Chart */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">
          Subscription History
        </h2>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <AreaChart data={subscriptionData}>
              <defs>
                <linearGradient
                  id="colorSubscribers"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#004368" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#004368" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="subscribers"
                stroke="#004368"
                fillOpacity={1}
                fill="url(#colorSubscribers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sellers by Location & Yearly Subscription */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Pie Chart */}
        <div className="bg-white p-5 rounded-lg shadow-sm w-full md:w-1/2">
          <h2 className="font-semibold text-gray-800 mb-4">
            Sellers by Location
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sellersData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {sellersData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-5 rounded-lg shadow-sm w-full md:w-1/2">
          <h2 className="font-semibold text-gray-800 mb-4">
            Yearly Subscription
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="subscribers" fill="#004368" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeCharts;
