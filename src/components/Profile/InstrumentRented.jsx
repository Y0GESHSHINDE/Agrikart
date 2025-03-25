import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useUser } from "@clerk/clerk-react";

const InstrumentRented = () => {
  const [rentedInstruments, setRentedInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
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
              {/* Add image at the top of card */}
              <div className="h-48 overflow-hidden">
                <img
                  src={instrument.images.primaryImage.url}
                  alt={instrument.equipmentName}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  {instrument.equipmentName} ({instrument.equipmentType})
                </h3>
                <p className="text-sm text-gray-700">
                  📍 Location: {instrument.pickupLocation}
                </p>
                <p className="text-sm text-gray-700">
                  ⚙️ Condition: {instrument.condition || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  💰 Rent/Day: ₹{instrument.rentalPerDay}
                </p>
                <p className="text-sm text-gray-700">
                  💳 Payment Status: {instrument.paymentStatus || "N/A"}
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

        {/* Modal for Detailed View */}
        {selectedInstrument && (
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 z-50"
            onClick={() => setSelectedInstrument(null)} // Close modal when clicking outside
          >
            <div
              className="bg-white rounded-lg shadow-lg border border-gray-300 w-full max-w-4xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl z-10 bg-white bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={() => setSelectedInstrument(null)}
              >
                ✕
              </button>

              {/* Flex container for side-by-side layout on larger screens */}
              <div className="flex flex-col md:flex-row">
                {/* Image container - full width on mobile, ~40% width on desktop */}
                <div className="md:w-2/5">
                  <div className="h-64 md:h-full md:min-h-[320px] overflow-hidden">
                    <img
                      src={selectedInstrument.images.primaryImage.url}
                      alt={selectedInstrument.equipmentName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Details container - full width on mobile, ~60% width on desktop */}
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-semibold text-green-600 mb-3">
                    {selectedInstrument.equipmentName} (
                    {selectedInstrument.equipmentType})
                  </h3>

                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      📍 <span className="font-semibold">Location:</span>{" "}
                      {selectedInstrument.pickupLocation}
                    </p>
                    <p>
                      ⚙️ <span className="font-semibold">Condition:</span>{" "}
                      {selectedInstrument.condition || "N/A"}
                    </p>

                    <h4 className="text-md font-semibold text-gray-800 mt-4">
                      📅 Rental Details
                    </h4>
                    <p>
                      💰 <span className="font-semibold">Rent/Day:</span> ₹
                      {selectedInstrument.rentalPerDay}
                    </p>
                    <p>
                      💳 <span className="font-semibold">Payment Status:</span>{" "}
                      {selectedInstrument.paymentStatus || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentRented;