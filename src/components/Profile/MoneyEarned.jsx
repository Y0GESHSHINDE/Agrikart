import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const MoneyEarned = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentalData, setRentalData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);

  // Stats summary
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [completedTransactions, setCompletedTransactions] = useState(0);

  useEffect(() => {
    const fetchRentalData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userId = user.id;
        const response = await axios.get(
          `http://localhost:5000/api/rental-requests/owner/${userId}`
        );

        if (response.data.success) {
          setRentalData(response.data.data);
          processRentalData(response.data.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching rental data:", err);
        setError("An error occurred while fetching your earnings data");
      } finally {
        setLoading(false);
      }
    };

    fetchRentalData();
  }, [user]);

  // Process the rental data to extract earnings information
  const processRentalData = (data) => {
    // Calculate earnings summaries
    let total = 0;
    let pending = 0;
    let completed = 0;

    // Process the data for monthly chart
    const monthlyEarnings = {};

    data.forEach((rental) => {
      const rentalAmount = rental.totalCost || 0;
      total += rentalAmount;

      // Calculate pending and completed amounts
      if (rental.paymentStatus === "pending") {
        pending += rentalAmount;
      } else if (rental.paymentStatus === "completed") {
        completed += rentalAmount;
      }

      // Process data for chart
      const date = new Date(rental.createdAt);
      const month = date.toLocaleString("default", { month: "short" });

      if (!monthlyEarnings[month]) {
        monthlyEarnings[month] = 0;
      }

      // Only add completed payments to the chart
      if (rental.paymentStatus === "completed") {
        monthlyEarnings[month] += rentalAmount;
      }
    });

    // Convert monthly earnings to chart data format
    const chartData = Object.keys(monthlyEarnings).map((month) => ({
      month,
      earnings: monthlyEarnings[month],
    }));

    // Sort by month (assuming current year)
    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    chartData.sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );

    setEarningsData(chartData);
    setTotalEarnings(total);
    setPendingPayments(pending);
    setCompletedTransactions(completed);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Determine payment status style
  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-500";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 mt-10 text-center">
          <p className="text-gray-700">Loading your earnings data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 mt-10 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Money Earned</h2>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Total Earnings</h3>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(totalEarnings)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Pending Payments</h3>
            <p className="text-xl font-bold text-yellow-500">
              {formatCurrency(pendingPayments)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Completed Transactions</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(completedTransactions)}
            </p>
          </div>
        </div>

        {/* Graphs Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Earnings Trend</h3>
          {earningsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `${formatCurrency(value)}`,
                    "Earnings",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-10 text-gray-500">
              No earnings data available to display
            </p>
          )}
        </div>

        {/* Transaction Table */}
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          {rentalData.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Equipment</th>
                  <th className="border p-3">Rental Period</th>
                  <th className="border p-3">Earnings</th>
                  <th className="border p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rentalData.map((rental) => {
                  const startDate = new Date(
                    rental.requestStartDate
                  ).toLocaleDateString();
                  const endDate = new Date(
                    rental.requestEndDate
                  ).toLocaleDateString();

                  return (
                    <tr key={rental._id}>
                      <td className="border p-3">
                        {new Date(rental.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border p-3">
                        {rental.equipmentId?.equipmentName || "Unknown"}
                      </td>
                      <td className="border p-3">
                        {startDate} to {endDate}
                      </td>
                      <td className="border p-3">
                        {formatCurrency(rental.totalCost || 0)}
                      </td>
                      <td
                        className={`border p-3 ${getStatusStyle(
                          rental.paymentStatus
                        )}`}
                      >
                        {rental.paymentStatus
                          ? rental.paymentStatus.charAt(0).toUpperCase() +
                            rental.paymentStatus.slice(1)
                          : "Unknown"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4 text-gray-500">
              No transaction history available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoneyEarned;
