import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

const ProfileInfo = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [formData, setFormData] = useState({
    farmSize: "",
    soilType: "",
    waterSource: "",
    farmingMethods: "",
    village: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to fetch user data from API (cache functionality removed)
  const fetchUserData = async () => {
    try {
      if (!isSignedIn || !user) return;

      setIsLoading(true);
      const token = await getToken();

      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const result = await response.json();
      console.log("API Response:", result);

      setUserData(result.data);

      // Initialize form data with current values
      setFormData({
        farmSize: result.data?.personalInfo?.farmSize || "",
        soilType: result.data?.personalInfo?.soilType || "",
        waterSource: result.data?.personalInfo?.waterSource || "",
        farmingMethods: result.data?.personalInfo?.farmingMethods || "",
        village: result.data?.address?.village || "",
        city: result.data?.address?.city || "",
        state: result.data?.address?.state || "",
        pincode: result.data?.address?.pincode || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user data
  const updateUserData = async (e) => {
    e.preventDefault();

    try {
      setIsUpdating(true);

      const token = await getToken();

      // Prepare data for the API - separate farm info and address
      const updatedData = {
          farmSize: formData.farmSize,
          soilType: formData.soilType,
          waterSource: formData.waterSource,
          farmingMethods: formData.farmingMethods,
          village: formData.village,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
      };

      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/users/${user.id}/personal-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );
       console.log(updatedData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update profile data: ${errorData.message}`);
      }

      // Refresh user data
      await fetchUserData();

      toast.success("Profile updated successfully");
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error(`Failed to update profile data: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch user data when component mounts and user is signed in
  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserData();
    }
  }, [isSignedIn, user]);

  // Notification function
  const notify = (message) =>
    toast.success(message, { position: "top-right", autoClose: 2000 });

  // Combine API data with defaults when needed
  const userInfo = {
    profilePhoto:
      userData?.imgUrl ||
      (isLoaded && isSignedIn
        ? user.imageUrl
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ9W15Hh_7mgF-oO3Dl_M32EWBjJUo_cA8Uw&s"),
    username:
      userData?.name ||
      (isLoaded && isSignedIn ? user.fullName || user.username : "Loading..."),
    email:
      userData?.email ||
      (isLoaded && isSignedIn
        ? user.primaryEmailAddress?.emailAddress
        : "Loading..."),
    mobileNumber:
      isLoaded && isSignedIn
        ? user.primaryPhoneNumber?.phoneNumber || "0000"
        : "Loading...",
    farmSize: userData?.personalInfo?.farmSize || "Not specified",
    soilType: userData?.personalInfo?.soilType || "Not specified",
    waterSource: userData?.personalInfo?.waterSource || "Not specified",
    farmingMethod: userData?.personalInfo?.farmingMethods || "Not specified",
    // Address information
    village: userData?.address?.village || "Not specified",
    city: userData?.address?.city || "Not specified",
    state: userData?.address?.state || "Not specified",
    pincode: userData?.address?.pincode || "Not specified",
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto p-6 mt-10">
        {/* Profile Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center text-center md:text-left border border-gray-300 w-full">
          {isLoading ? (
            <div className="w-full text-center py-4">
              Loading profile data...
            </div>
          ) : (
            <>
              <div>
                <img
                  src={userInfo.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-green-500 shadow-lg mb-4 md:mb-0 md:mr-8"
                />
              </div>
              <div className="space-y-2 w-full">
                <h2 className="text-3xl font-bold text-green-700">
                  {userInfo.username}
                </h2>
                <p className="text-md text-gray-600 font-medium">
                  📧 {userInfo.email}
                </p>
                <p className="text-md text-gray-600 font-medium">
                  📞 {userInfo.mobileNumber}
                </p>

                {/* Farm Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm font-medium w-full bg-green-50 p-4 rounded-lg mt-4">
                  <h3 className="text-green-800 font-semibold text-lg col-span-full">
                    Farm Information
                  </h3>
                  <p>
                    🌱 <span className="font-semibold">Farm Size:</span>
                    {userInfo.farmSize}
                  </p>
                  <p>
                    🧑‍🌾 <span className="font-semibold">Soil Type:</span>
                    {userInfo.soilType}
                  </p>
                  <p>
                    💧 <span className="font-semibold">Water Source:</span>
                    {userInfo.waterSource}
                  </p>
                  <p>
                    🌍 <span className="font-semibold">Farming Method:</span>
                    {userInfo.farmingMethod}
                  </p>
                </div>

                {/* Address Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm font-medium w-full bg-green-50 p-4 rounded-lg mt-4">
                  <h3 className="text-green-800 font-semibold text-lg col-span-full">
                    Address Information
                  </h3>
                  <p>
                    🏡 <span className="font-semibold">Village:</span>
                    {userInfo.village}
                  </p>
                  <p>
                    🏙️ <span className="font-semibold">City:</span>
                    {userInfo.city}
                  </p>
                  <p>
                    🗺️ <span className="font-semibold">State:</span>
                    {userInfo.state}
                  </p>
                  <p>
                    📮 <span className="font-semibold">Pincode:</span>
                    {userInfo.pincode}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="text-green-500 px-5 py-2 rounded-lg hover:text-green-800"
                    onClick={() => setShowEditPopup(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-800"
                    onClick={() => fetchUserData()}
                    title="Refresh profile data"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Edit Profile Popup */}
        {showEditPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg max-h-90vh overflow-y-auto">
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                Edit Profile
              </h2>
              <form onSubmit={updateUserData}>
                <h3 className="text-lg font-medium text-green-600 mb-2 mt-4">
                  Farm Information
                </h3>
                <div className="mb-4">
                  <label className="block text-gray-700">Farm Size</label>
                  <input
                    type="text"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Soil Type</label>
                  <input
                    type="text"
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Water Source</label>
                  <input
                    type="text"
                    name="waterSource"
                    value={formData.waterSource}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Farming Methods</label>
                  <input
                    type="text"
                    name="farmingMethods"
                    value={formData.farmingMethods}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <h3 className="text-lg font-medium text-green-600 mb-2 mt-4">
                  Address Information
                </h3>
                <div className="mb-4">
                  <label className="block text-gray-700">Village</label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition"
                    onClick={() => setShowEditPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rest of your component remains the same */}
        {/* Action Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[
            {
              title: "Manage Instruments",
              desc: "Manage your all instruments",
              link: "/manage-instruments",
            },
            {
              title: "Instrument Rented",
              desc: "You have rented 3 instruments.",
              link: "/rented-instruments",
            },
            {
              title: "Money Earned",
              desc: "Total: $1500",
              link: "/money-earned",
            },
            { title: "Contracts", desc: "Active Contracts: 5", link: "#" },
            {
              title: "History & Rating",
              desc: "Rating: 4.5 ⭐",
              link: "/history-ratings",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md text-center border border-gray-300 hover:shadow-lg transition duration-300"
            >
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                {item.title}
              </h2>
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
          <h2 className="text-lg font-semibold text-green-700 mb-3">
            Earnings Over Time
          </h2>
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
