import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import AddInstrument from "./AddInstrument";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageInstrument = () => {
  const [instruments, setInstruments] = useState([
    { id: 1, name: "Tractor", type: "Agricultural", rentPerDay: 500, location: "Pune" },
    { id: 2, name: "Seeder", type: "Equipment", rentPerDay: 200, location: "Nashik" },
  ]);

  // ✅ Function to Add an Instrument
  const handleAddInstrument = (newInstrument) => {
    setInstruments([...instruments, { id: Date.now(), ...newInstrument }]);
    toast.success("Instrument added successfully!", { position: "top-right", autoClose: 2000 });
  };

  // ✅ Function to Delete an Instrument
  const handleDelete = (id) => {
    setInstruments(instruments.filter((instrument) => instrument.id !== id));
    toast.error("Instrument removed!", { position: "top-right", autoClose: 2000 });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 md:p-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Section - Add Instrument */}
          <div className="w-full lg:col-span-3">
            <AddInstrument onAddInstrument={handleAddInstrument} />
          </div>

          {/* Right Section - Live Instruments */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 w-full lg:col-span-2">
            <h3 className="text-lg font-semibold text-green-700 mb-4 text-center md:text-left">
              Live Instruments
            </h3>

            {instruments.length > 0 ? (
              <ul className="space-y-4">
                {instruments.map((instrument) => (
                  <li
                    key={instrument.id}
                    className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-md transition duration-300"
                  >
                    <div className="w-full">
                      <h4 className="text-md font-semibold text-gray-800">{instrument.name}</h4>
                      <p className="text-sm text-gray-600">{instrument.type} - 
                        <span className="font-semibold"> ₹{instrument.rentPerDay}/day</span>
                      </p>
                      <p className="text-sm text-gray-600">📍 Location: {instrument.location}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(instrument.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded mt-3 md:mt-0 w-full md:w-auto hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No live instruments available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default ManageInstrument;
