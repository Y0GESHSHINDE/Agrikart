import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useUser } from "@clerk/clerk-react";
import OwnerModal from "./OwnerModal"; // Import the new modal

const InstrumentRented = () => {
  const [rentedInstruments, setRentedInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [currentOwnerId, setCurrentOwnerId] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchRentedInstruments = async () => {
      if (!user) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://main-backend-agrikart.vercel.app/api/equipment/renter/${user.id}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Failed to fetch rented instruments.");
        }

        setRentedInstruments(data.data);
      } catch (err) {
        console.error("Error fetching rented instruments:", err);
        setError("Failed to load rented instruments.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentedInstruments();
  }, [user]);

  const handleViewOwner = (ownerId) => {
    setCurrentOwnerId(ownerId);
    setShowOwnerModal(true);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="container mx-auto p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎯 Your Rented Instruments
          </h2>
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="container mx-auto p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎯 Instrument rented by me
          </h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">
          🎯 Your Rented Instruments
        </h2>

        {/* Instrument Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentedInstruments.map((instrument) => (
            <div
              key={instrument._id}
              className="bg-white rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={instrument.images.primaryImage.url}
                  alt={instrument.equipmentName}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  {instrument.equipmentName} ({instrument.equipmentType})
                </h3>
                <p className="text-sm text-gray-700">
                  📍 Location: {instrument.pickupLocation}
                </p>
                <p className="text-sm text-gray-700">
                  💰 Rent/Day: ₹{instrument.rentalPerDay}
                </p>

                <button
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full transition"
                  onClick={() => setSelectedInstrument(instrument)}
                >
                  🔍 View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Instrument Details Modal */}
        {selectedInstrument && (
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 z-50"
            onClick={() => setSelectedInstrument(null)}
          >
            <div
              className="bg-white rounded-lg shadow-lg border border-gray-300 w-full max-w-4xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl z-10 bg-white bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={() => setSelectedInstrument(null)}
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5">
                  <div className="h-64 md:h-full md:min-h-[320px] overflow-hidden">
                    <img
                      src={selectedInstrument.images.primaryImage.url}
                      alt={selectedInstrument.equipmentName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-semibold text-green-600 mb-3">
                    {selectedInstrument.equipmentName} (
                    {selectedInstrument.equipmentType})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                    <div>
                      <p>
                        <span className="font-semibold">Brand:</span>{" "}
                        {selectedInstrument.brand}
                      </p>
                      <p>
                        <span className="font-semibold">Model:</span>{" "}
                        {selectedInstrument.model}
                      </p>
                      <p>
                        <span className="font-semibold">Chassis Number:</span>{" "}
                        {selectedInstrument.chassisNumber}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold">Number Plate:</span>{" "}
                        {selectedInstrument.numberPlateNumber}
                      </p>
                      <p>
                        <span className="font-semibold">Rent/Hour:</span> ₹
                        {selectedInstrument.rentalPerHour}
                      </p>
                      <p>
                        <span className="font-semibold">Rent/Day:</span> ₹
                        {selectedInstrument.rentalPerDay}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-700">
                      {selectedInstrument.description}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Pickup Location
                    </h4>
                    <p className="text-gray-700">
                      {selectedInstrument.pickupLocation}
                    </p>
                  </div>

                  <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    onClick={() => {
                      handleViewOwner(selectedInstrument.ownerId);
                      setSelectedInstrument(null);
                    }}
                  >
                    👤 View Owner Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Owner Modal */}
        {showOwnerModal && (
          <OwnerModal
            ownerId={currentOwnerId}
            onClose={() => setShowOwnerModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InstrumentRented;