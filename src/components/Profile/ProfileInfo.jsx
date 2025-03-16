import React,{useState} from "react";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth,useUser } from "@clerk/clerk-react";

const ProfileInfo = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

//this is code for testing token only remove it later
  // Function to get and display bearer token
  const fetchAndDisplayToken = async () => {
      const bearerToken = await getToken();
      console.log(bearerToken);
  };
fetchAndDisplayToken();
console.log(user)
  const userInfo = {
    profilePhoto:
      isLoaded && isSignedIn
        ? user.imageUrl
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ9W15Hh_7mgF-oO3Dl_M32EWBjJUo_cA8Uw&s",
    username:
      isLoaded && isSignedIn ? user.fullName || user.username : "Loading...",
    email:
      isLoaded && isSignedIn
        ? user.primaryEmailAddress?.emailAddress
        : "Loading...",
    mobileNumber:
      isLoaded && isSignedIn
        ? user.primaryPhoneNumber?.phoneNumber || "0000"
        : "Loading...",
    farmSize: "10 acres",
    soilType: "Loamy",
    cropsGrown: ["Wheat", "Rice", "Sugarcane"],
    livestock: ["Cows", "Goats"],
    equipmentOwned: ["Tractor", "Seeder", "Harvester"],
    waterSource: "Borewell",
    annualYield: "20 tons",
    farmingMethod: "Organic",
  };

  // Notification function
  const notify = (message) => toast.success(message, { position: "top-right", autoClose: 2000 });

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto p-6 mt-10">
        {/* Profile Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center text-center md:text-left border border-gray-300 w-full">
          <img
            src={userInfo.profilePhoto}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-green-500 shadow-lg mb-4 md:mb-0 md:mr-8"
          />
          <div className="space-y-2 w-full">
            <h2 className="text-3xl font-bold text-green-700">{userInfo.username}</h2>
            <p className="text-md text-gray-600 font-medium">📧 {userInfo.email}</p>
            <p className="text-md text-gray-600 font-medium">📞 {userInfo.mobileNumber}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm font-medium w-full bg-green-50 p-4 rounded-lg mt-4">
              <p>🌱 <span className="font-semibold">Farm Size:</span> {userInfo.farmSize}</p>
              <p>🧑‍🌾 <span className="font-semibold">Soil Type:</span> {userInfo.soilType}</p>
              <p>💧 <span className="font-semibold">Water Source:</span> {userInfo.waterSource}</p>
              <p>🌍 <span className="font-semibold">Farming Method:</span> {userInfo.farmingMethod}</p>
            </div>
          </div>
        </div>

        {/* Action Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[
            { title: "Manage Instruments", desc: "Manage your all instruments", link: "/manage-instruments" },
            { title: "Instrument Rented", desc: "You have rented 3 instruments.", link: "/rented-instruments" },
            { title: "Money Earned", desc: "Total: $1500", link: "/money-earned" },
            { title: "Contracts", desc: "Active Contracts: 5", link: "#" },
            { title: "History & Rating", desc: "Rating: 4.5 ⭐", link: "/history-ratings" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-300 hover:shadow-lg transition duration-300"
            >
              <h2 className="text-lg font-semibold text-green-700 mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-4">{item.desc}</p>
              <Link
                to={item.link}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                onClick={() => notify(`${item.title} opened`)}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        {/* Earnings Graph Section */}
        <div className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-300 mt-6">
          <h2 className="text-lg font-semibold text-green-700 mb-3">Earnings Over Time</h2>
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
            <p className="text-gray-500">Graph Placeholder</p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ProfileInfo;
