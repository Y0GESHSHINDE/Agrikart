import React from 'react';
import { FaSeedling, FaLeaf, FaTint, FaUser, FaTractor } from 'react-icons/fa';

const FarmInformation = ({ farmInfo }) => {
  const farmItems = [
    {
      icon: <FaSeedling className="text-2xl text-green-600 sm:text-3xl" />,
      label: 'Farm Size',
      value: farmInfo.farmSize,
      color: 'bg-green-50'
    },
    {
      icon: <FaLeaf className="text-2xl text-green-600 sm:text-3xl" />,
      label: 'Soil Type',
      value: farmInfo.soilType,
      color: 'bg-green-50'
    },
    {
      icon: <FaTint className="text-2xl text-green-600 sm:text-3xl" />,
      label: 'Water Source',
      value: farmInfo.waterSource,
      color: 'bg-green-50'
    },
    {
      icon: <FaUser className="text-2xl text-green-600 sm:text-3xl" />,
      label: 'Farming Method',
      value: farmInfo.farmingMethod,
      color: 'bg-green-50'
    }
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-green-700">
        <span className="rounded-full bg-green-50 p-2 text-green-600">
          <FaTractor className="text-2xl" />
        </span>
        Farm Information
      </h3>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {farmItems.map((item, index) => (
          <div
            key={index}
            className={`${item.color} p-4 rounded-lg transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {item.label}
                </p>
                <p className="mt-1 font-semibold text-gray-800">
                  {item.value || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Farm Stats Preview */}
      {/* <div className="mt-6 border-t border-gray-200 pt-6">
        <h4 className="mb-3 text-lg font-medium text-green-700">
          Farm Statistics
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: 'Total Area', value: farmInfo.farmSize, unit: 'acres' },
            { label: 'Active Crops', value: '3', unit: 'types' },
            { label: 'Water Usage', value: '250', unit: 'L/day' },
            { label: 'Yield Rate', value: '92', unit: '%' }
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-lg bg-green-50 p-4 text-center transition-all duration-300 hover:bg-green-100 hover:shadow-md"
            >
              <p className="mb-1 text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-xl font-bold text-green-600">
                {stat.value}
                <span className="ml-1 text-sm text-gray-500">
                  {stat.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default FarmInformation;