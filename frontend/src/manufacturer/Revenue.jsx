import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const dummyStations = [
  {
    id: 0,
    name: "Station A",
    location: "Chennai Central",
    totalRevenue: 54000,
    activeDays: 320,
    revenueHistory: [
      { month: "Jan", revenue: 5000 },
      { month: "Feb", revenue: 5500 },
      { month: "Mar", revenue: 6200 },
      { month: "Apr", revenue: 5800 },
      { month: "May", revenue: 6200 },
      { month: "Jun", revenue: 6700 },
    ],
    portUsage: [
      { type: "Type2", value: 40 },
      { type: "CCS", value: 25 },
      { type: "CHAdeMO", value: 20 },
      { type: "Bharat AC", value: 15 },
    ],
  },
  {
    id: 1,
    name: "Station B",
    location: "Velachery",
    totalRevenue: 47000,
    activeDays: 290,
    revenueHistory: [
      { month: "Jan", revenue: 4500 },
      { month: "Feb", revenue: 4800 },
      { month: "Mar", revenue: 4900 },
      { month: "Apr", revenue: 5100 },
      { month: "May", revenue: 5400 },
      { month: "Jun", revenue: 5600 },
    ],
    portUsage: [
      { type: "Type2", value: 30 },
      { type: "CCS", value: 30 },
      { type: "CHAdeMO", value: 20 },
      { type: "Bharat AC", value: 20 },
    ],
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Revenue() {
  const [selectedStation, setSelectedStation] = useState(null);

  return (
    <div className="flex flex-col md:flex-row p-6 min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="md:w-1/4 bg-white rounded shadow p-4 mb-4 md:mb-0 md:mr-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">All Stations</h2>
        <ul className="space-y-2">
          {dummyStations.map((station) => (
            <li
              key={station.id}
              className={`cursor-pointer p-2 rounded border ${
                selectedStation?.id === station.id
                  ? "bg-blue-100 border-blue-400"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedStation(station)}
            >
              {station.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Details Section */}
      <div className="flex-1 bg-white rounded shadow p-6">
        {selectedStation ? (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">{selectedStation.name}</h2>
            <p className="text-gray-600 mb-4">📍 {selectedStation.location}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded shadow">
                <h3 className="font-semibold text-gray-600">Total Revenue</h3>
                <p className="text-2xl font-bold text-green-700">₹{selectedStation.totalRevenue.toLocaleString()}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded shadow">
                <h3 className="font-semibold text-gray-600">Days Active</h3>
                <p className="text-2xl font-bold text-blue-700">{selectedStation.activeDays} days</p>
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedStation.revenueHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Port Usage Pie Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Port Usage Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={selectedStation.portUsage}
                    dataKey="value"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {selectedStation.portUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center mt-20 text-lg">Select a station to view revenue details.</div>
        )}
      </div>
    </div>
  );
}

export default Revenue;
