import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, Clock, Zap, Users, Calendar } from 'lucide-react';

const Revenue = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('monthly');
  const [selectedStation, setSelectedStation] = useState('all');

  // Temporary data - replace with API calls when connected to database
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 125000,
    monthlyGrowth: 12.5,
    activeStations: 15,
    totalSessions: 2840,
    averageSessionValue: 45.67,
    peakHours: '6 PM - 8 PM',
    utilizationRate: 78.5,
    topPerformingStation: 'Central Plaza Station'
  });

  const [stationRevenueData, setStationRevenueData] = useState([
    { name: 'Central Plaza', revenue: 28500, sessions: 450, uptime: 98.5, avgSessionTime: 45 },
    { name: 'Tech Park Hub', revenue: 24800, sessions: 380, uptime: 95.2, avgSessionTime: 52 },
    { name: 'Mall Gateway', revenue: 22100, sessions: 420, uptime: 97.8, avgSessionTime: 38 },
    { name: 'Airport Express', revenue: 19700, sessions: 290, uptime: 94.1, avgSessionTime: 35 },
    { name: 'City Center', revenue: 18200, sessions: 350, uptime: 96.7, avgSessionTime: 41 },
    { name: 'University Campus', revenue: 15800, sessions: 280, uptime: 93.4, avgSessionTime: 48 },
    { name: 'Highway Stop', revenue: 12400, sessions: 210, uptime: 91.8, avgSessionTime: 55 }
  ]);

  const [monthlyTrends, setMonthlyTrends] = useState([
    { month: 'Jan', revenue: 95000, sessions: 1200, growth: 8.2 },
    { month: 'Feb', revenue: 102000, sessions: 1350, growth: 7.4 },
    { month: 'Mar', revenue: 108000, sessions: 1480, growth: 5.9 },
    { month: 'Apr', revenue: 115000, sessions: 1620, growth: 6.5 },
    { month: 'May', revenue: 122000, sessions: 1780, growth: 6.1 },
    { month: 'Jun', revenue: 125000, sessions: 1890, growth: 2.5 }
  ]);

  const [hourlyUsage, setHourlyUsage] = useState([
    { hour: '6 AM', usage: 15, revenue: 450 },
    { hour: '8 AM', usage: 45, revenue: 1350 },
    { hour: '10 AM', usage: 35, revenue: 1050 },
    { hour: '12 PM', usage: 55, revenue: 1650 },
    { hour: '2 PM', usage: 42, revenue: 1260 },
    { hour: '4 PM', usage: 38, revenue: 1140 },
    { hour: '6 PM', usage: 78, revenue: 2340 },
    { hour: '8 PM', usage: 82, revenue: 2460 },
    { hour: '10 PM', usage: 35, revenue: 1050 }
  ]);

  const [connectorTypeRevenue, setConnectorTypeRevenue] = useState([
    { name: 'Type2', value: 35000, percentage: 28, color: '#0088FE' },
    { name: 'CCS', value: 42000, percentage: 34, color: '#00C49F' },
    { name: 'CHAdeMO', value: 28000, percentage: 22, color: '#FFBB28' },
    { name: 'Bharat AC', value: 15000, percentage: 12, color: '#FF8042' },
    { name: 'Bharat DC', value: 5000, percentage: 4, color: '#8884D8' }
  ]);

  const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1">{Math.abs(change)}%</span>
            </p>
          )}
        </div>
        <Icon className={`h-8 w-8 text-${color}-500`} />
      </div>
    </div>
  );

  const filteredData = selectedStation === 'all' 
    ? stationRevenueData 
    : stationRevenueData.filter(station => station.name === selectedStation);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Revenue & Analytics Dashboard</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold px-4 py-2 rounded transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="all">All Stations</option>
            {stationRevenueData.map(station => (
              <option key={station.name} value={station.name}>{station.name}</option>
            ))}
          </select>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${revenueData.totalRevenue.toLocaleString()}`}
            change={revenueData.monthlyGrowth}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Active Stations"
            value={revenueData.activeStations}
            change={8.5}
            icon={Zap}
            color="blue"
          />
          <StatCard
            title="Total Sessions"
            value={revenueData.totalSessions.toLocaleString()}
            change={15.3}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Avg Session Value"
            value={`₹${revenueData.averageSessionValue}`}
            change={-2.1}
            icon={Activity}
            color="orange"
          />
        </div>

        {/* Revenue Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Monthly Revenue Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Hourly Usage Pattern</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usage" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Station Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Station Performance Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Station Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Revenue</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Sessions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Uptime</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Avg Session Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Performance</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((station, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{station.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{station.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{station.sessions}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        station.uptime > 95 ? 'bg-green-100 text-green-800' : 
                        station.uptime > 90 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {station.uptime}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{station.avgSessionTime} min</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(station.revenue / 30000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round((station.revenue / 30000) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue by Station */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Revenue by Station</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stationRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Connector Type Revenue */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Revenue by Connector Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={connectorTypeRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {connectorTypeRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Peak Hours</h3>
              <p className="text-sm text-blue-700">Highest usage between {revenueData.peakHours}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Top Performer</h3>
              <p className="text-sm text-green-700">{revenueData.topPerformingStation} leads in revenue</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900">Utilization Rate</h3>
              <p className="text-sm text-purple-700">{revenueData.utilizationRate}% average utilization across all stations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;