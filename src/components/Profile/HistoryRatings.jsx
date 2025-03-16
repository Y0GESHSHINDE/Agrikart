import React from "react";
import Navbar from "../Navbar/Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const rentalData = [
  { month: "Jan", rentals: 4 },
  { month: "Feb", rentals: 7 },
  { month: "Mar", rentals: 6 },
  { month: "Apr", rentals: 5 },
  { month: "May", rentals: 8 },
];

const HistoryRatings = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Rental History & Ratings</h2>

        {/* Rental History Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Rental History</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Date</th>
                <th className="border p-3">Instrument</th>
                <th className="border p-3">Rented By</th>
                <th className="border p-3">Duration</th>
                <th className="border p-3">Amount</th>
                <th className="border p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">15 Mar 2025</td>
                <td className="border p-3">Tractor</td>
                <td className="border p-3">Ramesh Patil</td>
                <td className="border p-3">3 Days</td>
                <td className="border p-3">₹6,000</td>
                <td className="border p-3 text-green-600">Completed</td>
              </tr>
              <tr>
                <td className="border p-3">10 Mar 2025</td>
                <td className="border p-3">Seeder</td>
                <td className="border p-3">Suresh More</td>
                <td className="border p-3">5 Hours</td>
                <td className="border p-3">₹2,500</td>
                <td className="border p-3 text-yellow-500">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ratings Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Ratings & Reviews</h3>
          <div className="border p-4 rounded-lg mb-4">
            <p className="font-semibold">Tractor - Ramesh Patil</p>
            <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
            <p className="text-gray-600">"Great service, well-maintained equipment!"</p>
          </div>
          <div className="border p-4 rounded-lg">
            <p className="font-semibold">Seeder - Suresh More</p>
            <p className="text-yellow-500">⭐⭐⭐⭐</p>
            <p className="text-gray-600">"Good but late delivery."</p>
          </div>
        </div>

        {/* Graph Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Rental Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rentalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rentals" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HistoryRatings;
