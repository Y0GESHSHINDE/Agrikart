import React, { useState, useEffect } from "react";

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
            <p className="text-center">Loading owner information...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : ownerData ? (
            <>
              <div className="flex items-center mb-4">
                <img
                  src={ownerData.imgUrl}
                  alt={ownerData.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">{ownerData.name}</h3>
                  <p className="text-gray-600">{ownerData.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800">Address</h4>
                  <p className="text-gray-700">
                    {ownerData.address.village}, {ownerData.address.city}
                    <br />
                    {ownerData.address.state} - {ownerData.address.pincode}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800">Farm Info</h4>
                  <p className="text-gray-700">
                    Farm Size: {ownerData.personalInfo.farmSize}
                    <br />
                    Soil Type: {ownerData.personalInfo.soilType}
                    <br />
                    Water Source: {ownerData.personalInfo.waterSource}
                    <br />
                    Farming Methods: {ownerData.personalInfo.farmingMethods}
                  </p>
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