import React, { useState, useEffect } from "react";

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
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg border border-gray-300 w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl z-10 bg-white bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="p-6">
          {loading ? (
            <p className="text-center">Loading renter information...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : renterData ? (
            <>
              <div className="flex items-center mb-4">
                <img
                  src={renterData.imgUrl}
                  alt={renterData.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">{renterData.name}</h3>
                  <p className="text-gray-600">{renterData.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800">Address</h4>
                  <p className="text-gray-700">
                    {renterData.address?.village}, {renterData.address?.city}
                    <br />
                    {renterData.address?.state} - {renterData.address?.pincode}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Farm Info</h4>
                  <p className="text-gray-700">
                    Farm Size: {renterData.personalInfo?.farmSize || "N/A"}
                    <br />
                    Soil Type: {renterData.personalInfo?.soilType || "N/A"}
                    <br />
                    Water Source: {renterData.personalInfo?.waterSource || "N/A"}
                    <br />
                    Farming Methods: {renterData.personalInfo?.farmingMethods || "N/A"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center">No renter information available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RenterModal;