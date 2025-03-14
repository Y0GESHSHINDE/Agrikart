import React from "react";
import Navbar from "../Navbar/Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", earnings: 5000 },
  { month: "Feb", earnings: 7000 },
  { month: "Mar", earnings: 8000 },
  { month: "Apr", earnings: 6000 },
  { month: "May", earnings: 9000 },
];

const MoneyEarned = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Money Earned</h2>
        
        {/* Earnings Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Total Earnings</h3>
            <p className="text-xl font-bold text-green-600">₹50,000</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Pending Payments</h3>
            <p className="text-xl font-bold text-yellow-500">₹5,000</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Completed Transactions</h3>
            <p className="text-xl font-bold text-blue-600">₹45,000</p>
          </div>
        </div>

        {/* Graphs Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Earnings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Table */}
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Date</th>
                <th className="border p-3">Instrument</th>
                <th className="border p-3">Earnings</th>
                <th className="border p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">12 Mar 2025</td>
                <td className="border p-3">Tractor</td>
                <td className="border p-3">₹5,000</td>
                <td className="border p-3 text-green-600">Completed</td>
              </tr>
              <tr>
                <td className="border p-3">10 Mar 2025</td>
                <td className="border p-3">Seeder</td>
                <td className="border p-3">₹3,000</td>
                <td className="border p-3 text-yellow-500">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoneyEarned;
