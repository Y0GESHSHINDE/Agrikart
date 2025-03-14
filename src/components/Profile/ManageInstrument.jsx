import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import AddInstrument from "./AddInstrument";

const ManageInstrument = () => {
  const [instruments, setInstruments] = useState([
    { id: 1, name: "Tractor", type: "Agricultural", rentPerDay: 500, location: "Pune" },
    { id: 2, name: "Seeder", type: "Equipment", rentPerDay: 200, location: "Nashik" },
  ]);

  const handleAddInstrument = () => {
    console.log("Redirect to Add Instrument Page");
    // Implement navigation logic
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 mt-10">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left Card */}
          <div className="col-span-3" >
          <AddInstrument/>
          </div>
          {/* Right Section - Live Instruments */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 col-span-2">
            <h3 className="text-lg font-semibold mb-4">Live Instruments</h3>
            {instruments.length > 0 ? (
              <ul className="space-y-4">
                {instruments.map((instrument) => (
                  <li key={instrument.id} className="border p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-md font-semibold">{instrument.name}</h4>
                      <p className="text-sm text-gray-600">{instrument.type} - ₹{instrument.rentPerDay}/day</p>
                      <p className="text-sm text-gray-600">Location: {instrument.location}</p>
                    </div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No live instruments available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageInstrument;
