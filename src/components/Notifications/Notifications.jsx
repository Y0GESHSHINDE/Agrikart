import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from "react-icons/fa";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const userId = user.id;

  // Load Razorpay script when component mounts
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
          // Fetch additional details for each notification
          const notificationsWithDetails = await Promise.all(
            result.data.map(async (notification) => {
              if (notification.relatedTo === "rental_request") {
                const rentalDetails = await fetchRentalDetails(
                  notification.relatedId
                );
                return { ...notification, rentalDetails };
              }
              return notification;
            })
          );

          setNotifications(notificationsWithDetails);
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

  // Fetch rental details using relatedId
  const fetchRentalDetails = async (relatedId) => {
    try {
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/rental-requests/${relatedId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rental details");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching rental details:", error);
      return null;
    }
  };

  // Function to handle Accept/Reject actions
  const handleDecision = async (id, decision) => {
    try {
      // Find the notification to get the relatedId (requestId)
      const notification = notifications.find((notif) => notif._id === id);
      if (!notification) {
        throw new Error("Notification not found");
      }

      const requestId = notification.relatedId;

      // Log the requestId and request body for debugging
      console.log("Request ID:", requestId);
      console.log("Decision:", decision);

      // Call the API to respond to the rental request (PUT request)
      const response = await fetch(
        `http://localhost:5000/api/rental-requests/${requestId}/respond`,
        {
          method: "PUT", // Use PUT method
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: decision === "accepted" ? "approved" : "rejected", // Map frontend decision to backend status
            message: "Your request has been processed", // Optional message
          }),
        }
      );

      // Log the API response for debugging
      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update rental request status"
        );
      }

      // Update the local state to reflect the new status
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, status: decision } : notif
        )
      );

      // Show success message
      setError(null);
      alert(`Rental request ${decision} successfully!`);
    } catch (error) {
      console.error("Error updating rental request status:", error);
      setError(
        error.message ||
          "Failed to update rental request status. Please try again later."
      );
    }
  };

  // Function to initiate payment
  const initiatePayment = async (notification) => {
    try {
      // Get rental request details from the notification
      const rentalRequestId = notification.relatedId;

      // Call your backend to create a payment order
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/payments/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rentalRequestId }),
        }
      );

      const orderData = await response.json();
      if (!orderData.success) throw new Error(orderData.message);

      // Initialize Razorpay checkout
      const options = {
        key:"rzp_test_3y3gCTGT3JZaFY", // Replace with actual key
        amount: orderData.data.amount,
        currency: orderData.data.currency || "INR",
        name: "Agrikart",
        description: `Rental payment for ${
          orderData.data.equipmentName || "equipment"
        }`,
        order_id: orderData.data.orderId,
        handler: function (response) {
          verifyPayment(response, orderData.data.paymentId);
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: "",
        },
        theme: {
          color: "#16a34a", // Green color matching your theme
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setError("Could not initiate payment. Please try again.");
    }
  };

  // Function to verify payment
  const verifyPayment = async (razorpayResponse, paymentId) => {
    try {
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/payments/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
            paymentId: paymentId,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        // Update the local state to reflect payment completed
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.relatedId === paymentId
              ? { ...notif, paymentStatus: "completed" }
              : notif
          )
        );

        alert("Payment successful!");
      } else {
        setError("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setError(
        "Payment verification failed. Please try again or contact support."
      );
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

                {/* Display rental details if available */}
                {notification.relatedTo === "rental_request" &&
                  notification.rentalDetails && (
                    <div className="mb-4">
                      <p className="text-gray-600">
                        <strong>Message:</strong>{" "}
                        {notification.rentalDetails.message}
                      </p>
                      <p className="text-gray-600">
                        <strong>Start Date:</strong>{" "}
                        {new Date(
                          notification.rentalDetails.requestStartDate
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        <strong>End Date:</strong>{" "}
                        {new Date(
                          notification.rentalDetails.requestEndDate
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        <strong>Total Days:</strong>{" "}
                        {notification.rentalDetails.totalDays}
                      </p>
                      <p className="text-gray-600">
                        <strong>Rental Type:</strong>{" "}
                        {notification.rentalDetails.rentalType}
                      </p>
                      <p className="text-gray-600">
                        <strong>Total Cost:</strong> ₹
                        {notification.rentalDetails.totalCost}
                      </p>
                    </div>
                  )}

                {/* If relatedTo is rental_request, show Accept/Reject buttons */}
                {notification.relatedTo === "rental_request" && (
                  <div className="flex space-x-4">
                    <button
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition"
                      onClick={() =>
                        handleDecision(notification._id, "accepted")
                      }
                      disabled={
                        notification.status === "accepted" ||
                        notification.status === "rejected"
                      }
                    >
                      <FaCheckCircle className="mr-2" /> Accept
                    </button>
                    <button
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-red-600 transition"
                      onClick={() =>
                        handleDecision(notification._id, "rejected")
                      }
                      disabled={
                        notification.status === "accepted" ||
                        notification.status === "rejected"
                      }
                    >
                      <FaTimesCircle className="mr-2" /> Reject
                    </button>
                  </div>
                )}

                {/* If relatedTo is rental_response, show Make Payment button */}
                {notification.relatedTo === "rental_response" && (
                  <button
                    className="w-full bg-blue-600 text-white py-2 mt-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
                    onClick={() => initiatePayment(notification)}
                  >
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
