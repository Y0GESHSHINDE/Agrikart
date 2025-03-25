import React, { useState, useEffect } from 'react';
import Navbar from './../Navbar/Navbar';
import Footer from '../LandingPage/Footer';
import { useUser } from "@clerk/clerk-react";
import RenterModal from './RenterModal'; // Import the new modal

function MyInstrumentByOther() {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [showRenterModal, setShowRenterModal] = useState(false);
  const [currentRenterId, setCurrentRenterId] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchInstruments = async () => {
      if (!user) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://main-backend-agrikart.vercel.app/api/equipment/owner/${user.id}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Failed to fetch instruments.");
        }

        setInstruments(data.data);
      } catch (err) {
        console.error("Error fetching instruments:", err);
        setError("Failed to load instruments.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, [user]);

  const handleViewRenter = (renterId) => {
    setCurrentRenterId(renterId);
    setShowRenterModal(true);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="container mx-auto p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🛠️ Instruments Rented by Others
          </h2>
          <p className="text-center text-gray-600">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="container mx-auto p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🛠️ Instruments Rented by Others
          </h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">
          🛠️ Instruments Rented by Others
        </h2>

        {instruments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No instruments are currently rented by others.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instruments.map((instrument) => (
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
                  <p className="text-sm text-gray-700">
                    {instrument.isRented ? (
                      <span className="text-yellow-600">Currently Rented</span>
                    ) : (
                      <span className="text-green-600">Available</span>
                    )}
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
        )}

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

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Rental Status
                    </h4>
                    <p className="text-gray-700">
                      {selectedInstrument.isRented ? (
                        <span className="text-yellow-600">Currently Rented</span>
                      ) : (
                        <span className="text-green-600">Available</span>
                      )}
                    </p>
                  </div>

                  {selectedInstrument.isRented && selectedInstrument.renterId && (
                    <button
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => {
                        handleViewRenter(selectedInstrument.renterId);
                        setSelectedInstrument(null);
                      }}
                    >
                      👤 View Renter Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Renter Modal */}
        {showRenterModal && (
          <RenterModal
            renterId={currentRenterId}
            onClose={() => setShowRenterModal(false)}
          />
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default MyInstrumentByOther;