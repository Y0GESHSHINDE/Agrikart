import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";

const AddInstrument = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    condition: "",
    rentPerDay: "",
    rentPerHour: "",
    location: "",
    rentalDuration: "",
    purpose: "",
    paymentMethod: "",
    securityDeposit: false,
    idProof: null,
  });

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Instrument added:", formData);
    // Implement backend API call to save the instrument data
  };

  return (
    <div>
      <div className="container mx-auto ">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Instrument</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Instrument Name" value={formData.name} onChange={handleChange} className="border p-3 rounded-lg w-full" required />
            <input type="text" name="type" placeholder="Type (e.g., Tractor, Seeder)" value={formData.type} onChange={handleChange} className="border p-3 rounded-lg w-full" required />
            <input type="text" name="condition" placeholder="Condition (New/Used)" value={formData.condition} onChange={handleChange} className="border p-3 rounded-lg w-full" required />
            <input type="number" name="rentPerDay" placeholder="Rent Price per Day" value={formData.rentPerDay} onChange={handleChange} className="border p-3 rounded-lg w-full" required />
            <input type="number" name="rentPerHour" placeholder="Rent Price per Hour" value={formData.rentPerHour} onChange={handleChange} className="border p-3 rounded-lg w-full" required />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="border p-3 rounded-lg w-full" required />
            
            {/* Rental Information */}
            <input type="text" name="rentalDuration" placeholder="Rental Duration (e.g., 3 days)" value={formData.rentalDuration} onChange={handleChange} className="border p-3 rounded-lg w-full" required />
            <input type="text" name="purpose" placeholder="Purpose of Rental" value={formData.purpose} onChange={handleChange} className="border p-3 rounded-lg w-full" required />
            <input type="text" name="paymentMethod" placeholder="Payment Method (Cash, UPI, Bank Transfer)" value={formData.paymentMethod} onChange={handleChange} className="border p-3 rounded-lg w-full" required />
            
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="securityDeposit" checked={formData.securityDeposit} onChange={handleChange} className="w-4 h-4" />
              <span>Agree to Security Deposit</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input type="file" name="idProof" accept="image/*,.pdf" onChange={handleChange} className="border p-3 rounded-lg w-full" required />
              <span>Upload ID Proof (Aadhaar/PAN)</span>
            </label>
          </div>
          
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mt-4 w-full">
            Add Instrument
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInstrument;
