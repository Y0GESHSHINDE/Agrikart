import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth, useUser } from "@clerk/clerk-react";

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
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to fetch user data from API
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      if (!isSignedIn || !user) return;

      const token = await getToken();

      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}`,
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

      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/personal-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile data");
      }

      // Refresh user data
      await fetchUserData();

      toast.success("Profile updated successfully");
      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update profile data");
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
    // Keep these static for now as they don't appear in your API response
    cropsGrown: ["Wheat", "Rice", "Sugarcane"],
    livestock: ["Cows", "Goats"],
    equipmentOwned: ["Tractor", "Seeder", "Harvester"],
    annualYield: "20 tons",
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
              <img
                src={userInfo.profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-green-500 shadow-lg mb-4 md:mb-0 md:mr-8"
              />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm font-medium w-full bg-green-50 p-4 rounded-lg mt-4">
                  <p>
                    🌱 <span className="font-semibold">Farm Size:</span>{" "}
                    {userInfo.farmSize}
                  </p>
                  <p>
                    🧑‍🌾 <span className="font-semibold">Soil Type:</span>{" "}
                    {userInfo.soilType}
                  </p>
                  <p>
                    💧 <span className="font-semibold">Water Source:</span>{" "}
                    {userInfo.waterSource}
                  </p>
                  <p>
                    🌍 <span className="font-semibold">Farming Method:</span>{" "}
                    {userInfo.farmingMethod}
                  </p>
                </div>
                <button
                  className="text-green-600 px-5 py-2 rounded-lg"
                  onClick={() => setShowEditPopup(true)}
                >
                  Edit Profile...
                </button>
              </div>
            </>
          )}
        </div>

        {/* Edit Profile Popup */}
        {showEditPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                Edit Profile
              </h2>
              <form onSubmit={updateUserData}>
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
