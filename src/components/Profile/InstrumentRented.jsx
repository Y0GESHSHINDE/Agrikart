import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";

const InstrumentRented = () => {
  const [rentedInstruments, setRentedInstruments] = useState([
    {
      id: 1,
      name: "Tractor",
      type: "Agricultural",
      condition: "Good",
      location: "Pune",
      farmer: "Rajesh Sharma",
      contact: "+91 9876543210",
      farmSize: "10 Acres",
      rentalStart: "2025-03-01",
      rentalEnd: "2025-03-10",
      totalRent: "₹5000",
      paymentStatus: "Paid",
      securityDeposit: "Yes",
      imageUrl: "https://source.unsplash.com/random/800x600/?tractor",
    },
    {
      id: 2,
      name: "Seeder",
      type: "Equipment",
      condition: "New",
      location: "Nashik",
      farmer: "Suresh Patil",
      contact: "+91 9876501234",
      farmSize: "15 Acres",
      rentalStart: "2025-02-20",
      rentalEnd: "2025-02-28",
      totalRent: "₹3000",
      paymentStatus: "Pending",
      securityDeposit: "No",
      imageUrl: "https://source.unsplash.com/random/800x600/?seeder,farming",
    },
    {
      id: 3,
      name: "Plough",
      type: "Tillage Equipment",
      condition: "Used",
      location: "Nagpur",
      farmer: "Vikas Deshmukh",
      contact: "+91 9876512345",
      farmSize: "8 Acres",
      rentalStart: "2025-03-05",
      rentalEnd: "2025-03-15",
      totalRent: "₹4000",
      paymentStatus: "Paid",
      securityDeposit: "Yes",
      imageUrl: "https://source.unsplash.com/random/800x600/?plough,farming",
    },
    {
      id: 4,
      name: "Harvester",
      type: "Harvesting Equipment",
      condition: "Excellent",
      location: "Mumbai",
      farmer: "Anil More",
      contact: "+91 9876523456",
      farmSize: "20 Acres",
      rentalStart: "2025-03-10",
      rentalEnd: "2025-03-20",
      totalRent: "₹7000",
      paymentStatus: "Pending",
      securityDeposit: "No",
      imageUrl: "https://source.unsplash.com/random/800x600/?harvester,combine",
    },
    {
      id: 5,
      name: "Sprayer",
      type: "Irrigation Equipment",
      condition: "New",
      location: "Kolhapur",
      farmer: "Sunil Pawar",
      contact: "+91 9876534567",
      farmSize: "12 Acres",
      rentalStart: "2025-02-25",
      rentalEnd: "2025-03-05",
      totalRent: "₹2000",
      paymentStatus: "Paid",
      securityDeposit: "Yes",
      imageUrl: "https://source.unsplash.com/random/800x600/?sprayer,farming",
    },
    {
      id: 6,
      name: "Rotavator",
      type: "Soil Preparation",
      condition: "Good",
      location: "Satara",
      farmer: "Dilip Shinde",
      contact: "+91 9876545678",
      farmSize: "18 Acres",
      rentalStart: "2025-03-02",
      rentalEnd: "2025-03-12",
      totalRent: "₹4500",
      paymentStatus: "Pending",
      securityDeposit: "No",
      imageUrl: "https://source.unsplash.com/random/800x600/?rotavator,tiller",
    },
  ]);

  const [selectedInstrument, setSelectedInstrument] = useState(null);

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
              key={instrument.id}
              className="bg-white rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition overflow-hidden"
            >
              {/* Add image at the top of card */}
              <div className="h-48 overflow-hidden">
                <img
                  src={instrument.imageUrl}
                  alt={instrument.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  {instrument.name} ({instrument.type})
                </h3>
                <p className="text-sm text-gray-700">
                  📍 Location: {instrument.location}
                </p>
                <p className="text-sm text-gray-700">
                  ⚙️ Condition: {instrument.condition}
                </p>
                <p className="text-sm text-gray-700">
                  📅 {instrument.rentalStart} - {instrument.rentalEnd}
                </p>
                <p className="text-sm text-gray-700 font-semibold">
                  💰 Total Rent: {instrument.totalRent}
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
                      src={selectedInstrument.imageUrl}
                      alt={selectedInstrument.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Details container - full width on mobile, ~60% width on desktop */}
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-semibold text-green-600 mb-3">
                    {selectedInstrument.name} ({selectedInstrument.type})
                  </h3>

                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      📍 <span className="font-semibold">Location:</span>{" "}
                      {selectedInstrument.location}
                    </p>
                    <p>
                      ⚙️ <span className="font-semibold">Condition:</span>{" "}
                      {selectedInstrument.condition}
                    </p>

                    <h4 className="text-md font-semibold text-gray-800 mt-4">
                      👨‍🌾 Farmer Details
                    </h4>
                    <p>
                      👤 <span className="font-semibold">Name:</span>{" "}
                      {selectedInstrument.farmer}
                    </p>
                    <p>
                      📞 <span className="font-semibold">Contact:</span>{" "}
                      {selectedInstrument.contact}
                    </p>
                    <p>
                      🏡 <span className="font-semibold">Farm Size:</span>{" "}
                      {selectedInstrument.farmSize}
                    </p>

                    <h4 className="text-md font-semibold text-gray-800 mt-4">
                      📅 Rental Details
                    </h4>
                    <p>
                      🗓 <span className="font-semibold">Start Date:</span>{" "}
                      {selectedInstrument.rentalStart}
                    </p>
                    <p>
                      🗓 <span className="font-semibold">End Date:</span>{" "}
                      {selectedInstrument.rentalEnd}
                    </p>
                    <p>
                      💰 <span className="font-semibold">Total Rent:</span>{" "}
                      {selectedInstrument.totalRent}
                    </p>
                    <p>
                      💳 <span className="font-semibold">Payment Status:</span>{" "}
                      {selectedInstrument.paymentStatus}
                    </p>
                    <p>
                      🔒{" "}
                      <span className="font-semibold">Security Deposit:</span>{" "}
                      {selectedInstrument.securityDeposit}
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
