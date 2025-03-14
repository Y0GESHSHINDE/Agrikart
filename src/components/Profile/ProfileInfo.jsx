import React from "react";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";

const ProfileInfo = () => {
  const userInfo = {
    profilePhoto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ9W15Hh_7mgF-oO3Dl_M32EWBjJUo_cA8Uw&s",
    username: "Farmer John",
    email: "farmer.john@example.com",
    mobileNumber: "+91-9876543210",
    farmSize: "10 acres",
    soilType: "Loamy",
    cropsGrown: ["Wheat", "Rice", "Sugarcane"],
    livestock: ["Cows", "Goats"],
    equipmentOwned: ["Tractor", "Seeder", "Harvester"],
    waterSource: "Borewell",
    annualYield: "20 tons",
    farmingMethod: "Organic",
  };

  return (
    <div>
      {/* Full-width Navbar */}
      <Navbar className="w-full" />
      
      {/* Main content in a container for desktop */}
      <div className="container mx-auto p-6 mt-10">
        {/* Basic Information Section with Stylish UI */}
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center text-center md:text-left border border-gray-300 w-full">
          <img src={userInfo.profilePhoto} alt="Profile" className="w-32 h-32 rounded-full border-4 border-green-500 shadow-lg mb-4 md:mb-0 md:mr-8" />
          <div className="space-y-2 w-full">
            <h2 className="text-2xl font-bold text-gray-800">{userInfo.username}</h2>
            <p className="text-md text-gray-700 font-medium">📧 {userInfo.email}</p>
            <p className="text-md text-gray-700 font-medium">📞 {userInfo.mobileNumber}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm font-medium w-full bg-gray-100 p-4 rounded-lg mt-4">
              <p>🌱 <span className="font-semibold">Farm Size:</span> {userInfo.farmSize}</p>
              <p>🧑‍🌾 <span className="font-semibold">Soil Type:</span> {userInfo.soilType}</p>
              <p>🌾 <span className="font-semibold">Crops Grown:</span> {userInfo.cropsGrown.join(", ")}</p>
              <p>🐄 <span className="font-semibold">Livestock:</span> {userInfo.livestock.join(", ")}</p>
              <p>🚜 <span className="font-semibold">Equipment Owned:</span> {userInfo.equipmentOwned.join(", ")}</p>
              <p>💧 <span className="font-semibold">Water Source:</span> {userInfo.waterSource}</p>
              <p>📊 <span className="font-semibold">Annual Yield:</span> {userInfo.annualYield}</p>
              <p>🌍 <span className="font-semibold">Farming Method:</span> {userInfo.farmingMethod}</p>
            </div>
          </div>
        </div>

        {/* Other Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {/* Add & Delete Instruments */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-300">
            <h2 className="text-lg font-semibold mb-3">Manage Instruments</h2>
            <p className="text-gray-700 mb-5 ">Manage your all instruments</p>
            <Link to={"/manage-instruments"} className="bg-gray-700 text-white px-5 py-2 rounded-lg ">Manage Instruments</Link>
          </div>

          {/* Instrument Rented */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-300">
            <h2 className="text-lg font-semibold mb-3">Instrument Rented</h2>
            <p className="text-gray-700">You have rented 3 instruments.</p>
            <button className="bg-gray-700 text-white px-5 py-2 rounded-lg mt-3">View Rentals</button>
          </div>

          {/* Instrument to Put on Rent */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-300">
            <h2 className="text-lg font-semibold mb-3">Instrument to Put on Rent</h2>
            <p className="text-gray-700">You have 2 instruments available for rent.</p>
            <button className="bg-gray-700 text-white px-5 py-2 rounded-lg mt-3">List Instruments</button>
          </div>

          {/* Money Earned */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-300">
            <h2 className="text-lg font-semibold mb-3">Money Earned</h2>
            <p className="text-gray-700">Total: $1500</p>
            <button className="bg-gray-700 text-white px-5 py-2 rounded-lg mt-3">View Earnings</button>
          </div>

          {/* Contracts */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-300">
            <h2 className="text-lg font-semibold mb-3">Contracts</h2>
            <p className="text-gray-700">Active Contracts: 5</p>
            <button className="bg-gray-700 text-white px-5 py-2 rounded-lg mt-3">View Contracts</button>
          </div>

          {/* History & Rating */}
          <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-300">
            <h2 className="text-lg font-semibold mb-3">History & Rating</h2>
            <p className="text-gray-700">Rating: 4.5 ⭐</p>
            <button className="bg-gray-700 text-white px-5 py-2 rounded-lg mt-3">View History</button>
          </div>

          {/* Graphs */}
          <div className="bg-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2 lg:col-span-3 text-center border border-gray-300">
            <h2 className="text-lg font-semibold mb-3">Earnings Over Time</h2>
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">Graph Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;