import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaMedal,
  FaChartLine,
  FaAward,
  FaEdit,
  FaSync,
} from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { toast } from "react-toastify";

const ProfileHeader = ({ userInfo }) => {
  // console.log(userInfo);

  // Local state for operator status
  const [isOperator, setIsOperator] = useState(userInfo.isEquipmentOperator);

  // Handle optional profile fields with defaults
  const location = userInfo.location || "Not specified";
  const joinDate = userInfo.joinDate || "January 2023";
  const occupation = userInfo.occupation || "Professional";
  const bio =
    userInfo.bio || "No bio available. Tell us something about yourself!";
  const metrics = userInfo.metrics || {
    activityStatus: "Very Active",
    reputation: 750,
  };
  const badges = userInfo.badges || [
    "Verified",
    "Premium Member",
    "Top Contributor",
  ];

  // Function to toggle operator status
  const toggleOperatorStatus = async () => {
    try {
      // Construct the API URL
      const apiUrl = `https://main-backend-agrikart.vercel.app/api/users/${userInfo.userId}/operator-status`;

      // Log the API URL and token for debugging
      console.log("API URL:", apiUrl);
      console.log("Authorization Token:", userInfo.token);

      // Determine the new operator status
      const newStatus = !isOperator;

      // Make the API call
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`, // Pass the user's token
        },
        body: JSON.stringify({
          isEquipmentOperator: newStatus, // Toggle the operator status
        }),
      });

      // Log the response status for debugging
      console.log("Response Status:", response.status);

      // Check if the response is not OK
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Data:", errorData);
        throw new Error(errorData.message || "Failed to update operator status");
      }

      // Parse the response JSON
      const data = await response.json();
      console.log("Response Data:", data);

      // Handle success
      if (data.success) {
        toast.success(
          newStatus
            ? "You have successfully registered as an operator!"
            : "You have successfully unregistered as an operator!"
        );

        // Update the local state
        setIsOperator(newStatus);
      } else {
        throw new Error(data.message || "Failed to update operator status");
      }
    } catch (error) {
      // Log and display the error
      console.error("Error:", error);
      toast.error(
        error.message || "An error occurred while updating operator status"
      );
    }
  };

  // Sync the local state with the initial userInfo when the component mounts
  useEffect(() => {
    setIsOperator(userInfo.isEquipmentOperator);
  }, [userInfo.isEquipmentOperator]);

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="flex flex-col items-center justify-between gap-4 text-center md:gap-6 md:text-left lg:flex-row">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="group relative flex-shrink-0">
            <img
              src={userInfo.profilePhoto}
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-green-500 shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-28 md:h-32 md:w-32"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20">
              <span className="text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-sm">
                Update Photo
              </span>
            </div>
            {/* Status indicator */}
            <div
              className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"
              title="Online"></div>
          </div>

          <div className="flex-grow space-y-3 md:min-w-0 md:max-w-2xl md:pr-6">
            <div className="flex flex-col items-center md:flex-row md:items-center md:gap-3">
              <h2 className="mb-1 text-xl font-bold text-green-700 sm:text-2xl md:mb-0 md:text-3xl">
                {userInfo.username}
              </h2>
              {/* Verification badge */}
              {userInfo.isVerified && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  <svg
                    className="-ml-0.5 mr-1.5 h-3 w-3 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:text-base md:grid-cols-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="flex-shrink-0 text-green-600">
                  <FaEnvelope className="text-lg" />
                </span>
                <span className="truncate font-medium">{userInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="flex-shrink-0 text-green-600">
                  <FaPhone className="text-lg" />
                </span>
                <span className="truncate font-medium">
                  {userInfo.mobileNumber}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="flex-shrink-0 text-green-600">
                  <FaMapMarkerAlt className="text-lg" />
                </span>
                <span className="truncate font-medium">{location}</span>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="flex-shrink-0 text-green-600">
                  <FaCalendarAlt className="text-lg" />
                </span>
                <span className="truncate font-medium">Joined {joinDate}</span>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="flex-shrink-0 text-green-600">
                  <FaBriefcase className="text-lg" />
                </span>
                <span className="truncate font-medium">{occupation}</span>
              </div>
            </div>

            <div className="flex-wrap gap-2 pt-1 md:flex">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  <FaMedal className="mr-1 text-green-600" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-56 flex-col justify-between gap-4 md:max-w-lg md:flex-row md:gap-12 lg:w-fit lg:flex-col lg:gap-6 xl:max-w-full">
          {/* Metrics card */}
          <div className="group flex w-full flex-col rounded-xl bg-gradient-to-br from-white to-green-50 p-4 shadow-lg ring-1 ring-green-100/50 transition-all duration-300 hover:shadow-xl hover:ring-green-200 xl:w-64">
            <div className="mb-4 transform transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="flex items-center justify-center gap-2.5">
                <div className="rounded-full bg-blue-100 p-1.5">
                  <FaChartLine className="text-lg text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  Activity
                </span>
              </div>
              <div className="mt-2 text-center text-base font-bold text-green-700">
                {metrics.activityStatus}
              </div>
            </div>

            {/* Elegant gradient divider */}
            <div className="my-1 flex w-full justify-center opacity-80 transition-opacity duration-300 group-hover:opacity-100">
              <div className="h-1 w-full rounded-full bg-gradient-to-l from-emerald-600/60 via-green-500/60 to-teal-400/60"></div>
            </div>

            <div className="mt-4 transform transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="flex items-center justify-center gap-2.5">
                <div className="rounded-full bg-purple-100 p-1.5">
                  <FaAward className="text-lg text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  Reputation
                </span>
              </div>
              <div className="mt-2 text-center text-base font-bold text-green-700">
                {metrics.reputation}
                <span className="ml-1 text-center text-xs font-medium text-gray-500">
                  points
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="md flex justify-between gap-2 md:h-fit md:flex-col md:items-center md:self-center lg:flex-row lg:items-stretch lg:self-auto">
            <div className="flex flex-col gap-2 p-2">
              <button
                className="flex transform whitespace-nowrap rounded-lg bg-green-500 px-3 py-1.5 text-sm text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 sm:px-4 sm:py-2 sm:text-base md:px-10"
                onClick={userInfo.onEdit}>
                <div className="mx-auto inline-flex items-center gap-2">
                  <FaEdit className="text-lg" />
                  <span className="text-xs sm:text-base">Edit Profile</span>
                </div>
              </button>
              <button
                className="flex transform whitespace-nowrap rounded-lg bg-green-500 px-3 py-1.5 text-sm text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 sm:px-4 sm:py-2 sm:text-base md:px-10"
                onClick={toggleOperatorStatus} // Call the toggle function
              >
                <div className="mx-auto inline-flex items-center gap-2">
                  <FaScrewdriverWrench className="text-lg" />
                  <span className="text-xs sm:text-base">
                    {isOperator
                      ? "Unregister as Operator"
                      : "Register as Operator"}
                  </span>
                </div>
              </button>
            </div>
            <div className="self-center">
              <button
                className="w-full transform rounded-lg bg-green-200 p-1.5 text-green-600 transition duration-300 ease-in-out hover:scale-105 hover:bg-green-300 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 sm:p-2"
                onClick={userInfo.onRefresh}
                title="Refresh profile data">
                <FaSync className="mx-auto h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
