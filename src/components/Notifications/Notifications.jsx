import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaSearch,
  FaTractor,
  FaMoneyBillWave,
  FaList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import { useUser, useAuth } from "@clerk/clerk-react";
import NotificationItem from "./NotificationItem";
import { toast } from "react-toastify";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setNotifications([]);
        return;
      }

      try {
        const token = await getToken();
        const response = await fetch(
          `https://main-backend-agrikart.vercel.app/api/notifications/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setNotifications(result.data);
        } else {
          console.error("API response is not an array:", result);
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications. Please try again later.");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, getToken]);

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      console.log("Marking notification as read:", notificationId);
      const token = await getToken();
      console.log("Using Token:", token); // Debugging token

      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/notifications/${notificationId}/read`, // ✅ Fixed URL
        {
          method: "PATCH", // ✅ PATCH is correct
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark notification as read.");
      }

      console.log("✅ Notification marked as read successfully!");
      toast.success("Notification marked as read successfully!"); // ✅ Toast message for success
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
      toast.error("Failed to mark notification as read. Please try again!"); // ✅ Toast message for error
    }
  };

  // Handle Accept/Reject actions
  const handleDecision = async (notificationId, decision) => {
    try {
      const notification = notifications.find(
        (notif) => notif._id === notificationId
      );
      if (!notification) {
        throw new Error("Notification not found");
      }

      const requestId = notification.relatedId;
      const token = await getToken();

      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/rental-requests/${requestId}/respond`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: decision === "accepted" ? "approved" : "rejected",
            message: "Your request has been processed",
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update rental request status"
        );
      }

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, status: decision } : notif
        )
      );

      // Mark notification as read
      await markNotificationAsRead(notificationId);

      toast.success(`Rental request ${decision} successfully!`);
    } catch (error) {
      console.error("Error updating rental request status:", error);
      toast.error(
        error.message || "Failed to update request. Please try again."
      );
    }
  };

  // Initiate payment
  const initiatePayment = async (notification) => {
    try {
      const token = await getToken();
      const rentalRequestId = notification.relatedId;

      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rentalRequestId }),
        }
      );

      const orderData = await response.json();
      if (!orderData.success) throw new Error(orderData.message);

      const options = {
        key: "rzp_test_3y3gCTGT3JZaFY",
        amount: orderData.data.amount,
        currency: orderData.data.currency || "INR",
        name: "Agrikart",
        description: `Rental payment for ${
          orderData.data.equipmentName || "equipment"
        }`,
        order_id: orderData.data.orderId,
        handler: function (response) {
          verifyPayment(
            response,
            orderData.data.paymentId,
            token,
            notification._id
          );
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: "",
        },
        theme: {
          color: "#16a34a",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Could not initiate payment. Please try again.");
    }
  };

  // Verify payment
  const verifyPayment = async (
    razorpayResponse,
    paymentId,
    token,
    notificationId
  ) => {
    try {
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/payments/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId
              ? { ...notif, paymentStatus: "completed" }
              : notif
          )
        );

        // Mark notification as read
        await markNotificationAsRead(notificationId);

        toast.success("Payment successful!");
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    switch (activeTab) {
      case "all":
        return matchesSearch;
      case "rental":
        return matchesSearch && notification.relatedTo === "rental_request";
      case "payment":
        return (
          matchesSearch &&
          (notification.relatedTo === "rental_response" ||
            notification.relatedTo === "payment_confirmation")
        );
      case "pending":
        return matchesSearch && notification.status === "pending";
      case "accepted":
        return matchesSearch && notification.status === "accepted";
      case "rejected":
        return matchesSearch && notification.status === "rejected";
      default:
        return false;
    }
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-2 py-6 sm:px-6 sm:py-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-700 sm:text-4xl">
          <FaBell className="mr-2 inline-block" />
          Rental Requests & Notifications
        </h2>

        {/* Notifications List */}
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onAccept={(id) => handleDecision(id, "accepted")}
                onReject={(id) => handleDecision(id, "rejected")}
                onPayment={initiatePayment}
              />
            ))
          ) : (
            <p className="py-4 text-center text-gray-600">
              No notifications found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
