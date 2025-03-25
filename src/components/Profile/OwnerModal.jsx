import React, { useState, useEffect } from "react";
import { FiX, FiMapPin, FiMail, FiUser, FiHome, FiDroplet, FiLayers } from "react-icons/fi";
import { FaLeaf, FaTractor } from "react-icons/fa";

const OwnerModal = ({ ownerId, onClose }) => {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await fetch(
          `https://main-backend-agrikart.vercel.app/api/users/${ownerId}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Failed to fetch owner data.");
        }

        setOwnerData(data.data);
      } catch (err) {
        console.error("Error fetching owner data:", err);
        setError("Failed to load owner information.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [ownerId]);

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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
              <p className="text-gray-600">Loading owner information...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : ownerData ? (
            <>
              {/* Header with avatar */}
              <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
                <div className="relative">
                  <img
                    src={ownerData.imgUrl}
                    alt={ownerData.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-white shadow-md"
                  />
                  <div className="absolute bottom-0 right-4 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{ownerData.name}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <FiMail className="mr-2 text-sm" />
                    <span className="text-sm">{ownerData.email}</span>
                  </div>
                </div>
              </div>

              {/* Content sections */}
              <div className="space-y-5">
                {/* Address section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FiMapPin className="text-green-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Address</h4>
                  </div>
                  <div className="pl-6">
                    <p className="text-gray-700">
                      {ownerData.address.village}, {ownerData.address.city}
                      <br />
                      {ownerData.address.state} - {ownerData.address.pincode}
                    </p>
                  </div>
                </div>

                {/* Farm Info section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaTractor className="text-green-600 mr-2" />
                    <h4 className="font-semibold text-gray-800">Farm Information</h4>
                  </div>
                  <div className="pl-6 space-y-3">
                    <div className="flex items-start">
                      <FiHome className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Farm Size</span>
                        <p className="text-gray-700">{ownerData.personalInfo.farmSize}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiLayers className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Soil Type</span>
                        <p className="text-gray-700">{ownerData.personalInfo.soilType}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiDroplet className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Water Source</span>
                        <p className="text-gray-700">{ownerData.personalInfo.waterSource}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaLeaf className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Farming Methods</span>
                        <p className="text-gray-700">{ownerData.personalInfo.farmingMethods}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OwnerModal;