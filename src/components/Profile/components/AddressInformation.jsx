import React from 'react';
import { FaHome, FaCity, FaMapMarkerAlt, FaMapPin, FaPen } from 'react-icons/fa';

const AddressInformation = ({ addressInfo }) => {
  const addressItems = [
    {
      icon: <FaHome className="text-2xl text-green-600 sm:text-3xl" />,
      label: 'Village',
      value: addressInfo.village,
      color: 'bg-green-50'
    },
    {
      icon: <FaCity className="text-2xl text-green-600 sm:text-3xl" />,
      label: 'City',
      value: addressInfo.city,
      color: 'bg-green-50'
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-green-600 sm:text-3xl" />,
      label: 'State',
      value: addressInfo.state,
      color: 'bg-green-50'
    },
    {
      icon: <FaMapPin className="text-2xl text-green-600 sm:text-3xl" />,
      label: 'Pincode',
      value: addressInfo.pincode,
      color: 'bg-green-50'
    }
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-green-700">
        <span className="rounded-full bg-green-50 p-2 text-green-600">
          <FaMapMarkerAlt className="text-2xl" />
        </span>
        Address Information
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {addressItems.map((item, index) => (
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

      {/* Location Map Preview */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h4 className="mb-3 flex items-center gap-2 text-lg font-medium text-green-700">
          <span className="rounded-full bg-green-50 p-1.5 text-green-600">
            <FaMapMarkerAlt className="text-xl" />
          </span>
          Location Map
        </h4>
        <div className="flex h-48 items-center justify-center rounded-lg bg-green-50 p-4 transition-all duration-300 hover:shadow-md">
          <p className="text-gray-500">
            {addressInfo.village && addressInfo.city ? (
              "Map view available"
            ) : (
              "Add address details to view map"
            )}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex justify-end">
        <button
          className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-600 transition-all duration-300 hover:bg-green-100 hover:shadow-md"
          onClick={addressInfo.onEdit}
        >
          <FaPen className="text-lg" />
          Update Address
        </button>
      </div>
    </div>
  );
};

export default AddressInformation;