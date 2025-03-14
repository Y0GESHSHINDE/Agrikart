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
      securityDeposit: "Yes" 
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
      securityDeposit: "No" 
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
      securityDeposit: "Yes" 
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
      securityDeposit: "No" 
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
      securityDeposit: "Yes" 
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
      securityDeposit: "No" 
    }
  ]);

  const [selectedInstrument, setSelectedInstrument] = useState(null);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Rented Instruments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentedInstruments.map((instrument) => (
            <div key={instrument.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-300">
              <h3 className="text-lg font-semibold mb-2">{instrument.name} ({instrument.type})</h3>
              <p className="text-sm text-gray-600">Condition: {instrument.condition}</p>
              <p className="text-sm text-gray-600">Location: {instrument.location}</p>
              <p className="text-sm text-gray-600">Rental Period: {instrument.rentalStart} - {instrument.rentalEnd}</p>
              <p className="text-sm text-gray-600">Total Rent: {instrument.totalRent}</p>
              <button 
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
                onClick={() => setSelectedInstrument(instrument)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Modal for Details */}
        {selectedInstrument && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={() => setSelectedInstrument(null)}
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold mb-2">{selectedInstrument.name} ({selectedInstrument.type})</h3>
              <p className="text-sm text-gray-600">Condition: {selectedInstrument.condition}</p>
              <p className="text-sm text-gray-600">Location: {selectedInstrument.location}</p>
              <h4 className="text-md font-semibold mt-3">Farmer Details</h4>
              <p className="text-sm text-gray-600">Name: {selectedInstrument.farmer}</p>
              <p className="text-sm text-gray-600">Contact: {selectedInstrument.contact}</p>
              <p className="text-sm text-gray-600">Farm Size: {selectedInstrument.farmSize}</p>
              <h4 className="text-md font-semibold mt-3">Rental Details</h4>
              <p className="text-sm text-gray-600">Start Date: {selectedInstrument.rentalStart}</p>
              <p className="text-sm text-gray-600">End Date: {selectedInstrument.rentalEnd}</p>
              <p className="text-sm text-gray-600">Total Rent: {selectedInstrument.totalRent}</p>
              <p className="text-sm text-gray-600">Payment Status: {selectedInstrument.paymentStatus}</p>
              <p className="text-sm text-gray-600">Security Deposit: {selectedInstrument.securityDeposit}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentRented;