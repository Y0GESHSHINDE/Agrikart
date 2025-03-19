import React from 'react';
import { FaChartLine, FaStar } from 'react-icons/fa';
import { HiChevronDown } from 'react-icons/hi';

const EarningsGraph = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-green-700">
          <span className="rounded-full bg-green-50 p-2 text-green-600">
            <FaChartLine className="text-xl" />
          </span>
          Earnings Over Time
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              defaultValue="month"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
              <HiChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Placeholder for the actual graph implementation */}
        <div className="flex h-40 w-full items-center justify-center rounded-lg bg-green-50 transition-all duration-300 hover:shadow-md">
          <div className="text-center">
            <p className="mb-2 text-green-600">Graph Placeholder</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-green-50 p-3 transition-all duration-300 hover:shadow-md">
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-lg font-bold text-green-600">$1,500</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 transition-all duration-300 hover:shadow-md">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-lg font-bold text-green-600">$500</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 transition-all duration-300 hover:shadow-md">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-lg font-bold text-green-600">$200</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1">
            Active Rentals: <span className="font-semibold text-green-600">3</span>
          </span>
          <span className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1">
            Average Rating: <span className="font-semibold text-green-600">4.5</span>
            <FaStar className="text-green-600" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default EarningsGraph;