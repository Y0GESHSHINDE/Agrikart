import React, { useState, useEffect } from "react";
import { FiX, FiMapPin, FiMail, FiUser, FiHome, FiDroplet, FiLayers, FiPhone } from "react-icons/fi";
import { FaLeaf, FaTractor, FaHandshake } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";

const RenterModal = ({ renterId, onClose }) => {
  const [renterData, setRenterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRenterData = async () => {
      try {
        const response = await fetch(
          `https://main-backend-agrikart.vercel.app/api/users/${renterId}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Failed to fetch renter data.");
        }

        setRenterData(data.data);
      } catch (err) {
        console.error("Error fetching renter data:", err);
        setError("Failed to load renter information.");
      } finally {
        setLoading(false);
      }
    };

    if (renterId) {
      fetchRenterData();
    }
  }, [renterId]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md relative overflow-hidden transform transition-all duration-300 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors duration-200 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:shadow-md"
          onClick={onClose}
        >
          <FiX className="text-lg" />
        </button>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading renter information...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : renterData ? (
            <>
              {/* Header with avatar */}
              <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
                <div className="relative">
                  <img
                    src={renterData.imgUrl}
                    alt={renterData.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-white shadow-md"
                  />
                  <div className="absolute bottom-0 right-4 bg-blue-500 rounded-full w-4 h-4 border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{renterData.name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <FiMail className="mr-2 text-sm" />
                    <span className="text-sm">{renterData.email}</span>
                  </div>
                  {renterData.phone && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <FiPhone className="mr-2 text-sm" />
                      <span className="text-sm">{renterData.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content sections */}
              <div className="space-y-5">
                {/* Address section */}
                {renterData.address && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiMapPin className="text-blue-600 mr-2" />
                      <h4 className="font-semibold text-gray-800">Address</h4>
                    </div>
                    <div className="pl-6">
                      <p className="text-gray-700">
                        {renterData.address.village}, {renterData.address.city}
                        <br />
                        {renterData.address.state} - {renterData.address.pincode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Farm Info section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <GiFarmer className="text-green-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Farming Details</h4>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start">
                      <FiHome className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Farm Size</span>
                        <p className="text-gray-700">{renterData.personalInfo?.farmSize || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiLayers className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Soil Type</span>
                        <p className="text-gray-700">{renterData.personalInfo?.soilType || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiDroplet className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Water Source</span>
                        <p className="text-gray-700">{renterData.personalInfo?.waterSource || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaLeaf className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Farming Methods</span>
                        <p className="text-gray-700">{renterData.personalInfo?.farmingMethods || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental-specific info (if any) */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaHandshake className="text-purple-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Rental Information</h4>
                  </div>
                  <div className="pl-6">
                    <p className="text-gray-700 text-sm italic">
                      {renterData.rentalInfo || "No additional rental information available."}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <FiUser className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-600">No renter information available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RenterModal;