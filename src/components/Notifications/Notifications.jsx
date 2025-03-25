import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaSearch,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import { useUser, useAuth } from "@clerk/clerk-react";
import NotificationItem from "./NotificationItem";
import { toast } from "react-toastify";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUser();
  const { getToken } = useAuth();

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay SDK Loaded");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch notifications
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
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setNotifications(result.data);
        } else {
          console.error("Invalid API response:", result);
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications.");
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
      const token = await getToken();
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) throw new Error("Failed to mark as read");
  
      // Update local state to reflect read status
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read.");
    }
  };

  // Handle Accept/Reject actions
  const handleDecision = async (notificationId, decision) => {
    try {
      const notification = notifications.find((notif) => notif._id === notificationId);
      if (!notification) throw new Error("Notification not found");

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

      if (!response.ok) throw new Error("Failed to update rental request");

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, status: decision } : notif
        )
      );

      await markNotificationAsRead(notificationId);

      toast.success(`Rental request ${decision} successfully!`);
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Failed to update request.");
    }
  };

  // Initiate payment
  const initiatePayment = async (notification ,notificationId) => {
    try {
      markNotificationAsRead(notificationId);
      if (!window.Razorpay) {
        toast.error("Payment gateway not available. Refresh the page.");
        return;
      }

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
        currency: "INR",
        name: "Agrikart",
        description: `Rental payment for ${orderData.data.equipmentName || "equipment"}`,
        order_id: orderData.data.orderId,
        handler: (response) => verifyPayment(response, orderData.data.paymentId, token, notification._id),
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: "",
        },
        theme: { color: "#16a34a" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Payment initiation failed.");
    }
  };

  // Verify payment
  const verifyPayment = async (razorpayResponse, paymentId, token) => {
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
            paymentId,
          }),
        }
      );
  
      const result = await response.json();
      if (!result.success) throw new Error("Payment verification failed");
  
      // First update payment status in state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId 
            ? { ...notif, paymentStatus: "completed" } 
            : notif
        )
      );
  

  
      toast.success("Payment successful!");
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-700">
          <FaBell className="mr-2 inline-block" /> Rental Requests & Notifications
        </h2>

        {/* Notifications List */}
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                notificationId={notification._id}
                onAccept={() => handleDecision(notification._id, "accepted")}
                onReject={() => handleDecision(notification._id, "rejected")}
                onPayment={() => initiatePayment(notification, notification._id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-600">No notifications found.</p>
          )}
        </div>
      </div>
    </>
  );
}
