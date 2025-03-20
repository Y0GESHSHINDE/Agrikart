import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = "user_2uajmjiaxjtTSB0LE4eX8lA0FDa"; // Replace with dynamic user ID if needed

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `https://main-backend-agrikart.vercel.app/api/notifications/user/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const result = await response.json();
        console.log("API Response:", result);

        // Ensure the response contains a valid data array
        if (result.success && Array.isArray(result.data)) {
          setNotifications(result.data);
        } else {
          console.error("API response is not an array:", result);
          setNotifications([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching Notifications:", error);
        setError("Failed to fetch notifications. Please try again later.");
        setNotifications([]); // Fallback to an empty array
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchNotifications();
  }, [userId]);

  // Function to handle Accept/Reject actions
  const handleDecision = async (id, decision) => {
    try {
      // Simulate an API call to update the notification status
      // Replace this with your actual API call
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/notifications/${id}/decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ decision }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update notification status");
      }

      // Update the local state to reflect the new status
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, status: decision } : notif
        )
      );
    } catch (error) {
      console.error("Error updating notification status:", error);
      setError("Failed to update notification status. Please try again later.");
    }
  };

  // Render loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
            📩 Rental Requests & Notifications
          </h2>
          <p className="text-center text-gray-600">Loading notifications...</p>
        </div>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
            📩 Rental Requests & Notifications
          </h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </>
    );
  }

  // Render notifications
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
          📩 Rental Requests & Notifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Loop through notifications and show dynamic UI */}
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <motion.div
                key={notification._id}
                className={`bg-white shadow-md rounded-xl p-6 border ${
                  notification.status === "accepted"
                    ? "border-green-500"
                    : notification.status === "rejected"
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {notification.title}
                </h3>
                <p className="text-gray-600 mb-3">{notification.message}</p>

                {/* If relatedTo is rental_request, show Accept/Reject buttons */}
                {notification.relatedTo === "rental_request" && (
                  <div className="flex space-x-4">
                    <button
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition"
                      onClick={() =>
                        handleDecision(notification._id, "accepted")
                      }
                    >
                      <FaCheckCircle className="mr-2" /> Accept
                    </button>
                    <button
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-red-600 transition"
                      onClick={() =>
                        handleDecision(notification._id, "rejected")
                      }
                    >
                      <FaTimesCircle className="mr-2" /> Reject
                    </button>
                  </div>
                )}

                {/* If relatedTo is rental_response, show Make Payment button */}
                {notification.relatedTo === "rental_response" && (
                  <button className="w-full bg-blue-600 text-white py-2 mt-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition">
                    <FaMoneyBillWave className="mr-2" /> Make Payment
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No notifications found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}