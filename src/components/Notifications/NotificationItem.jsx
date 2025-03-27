import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ProfilePopup from "./ProfilePopup";

const NotificationItem = ({
  notification,
  onAccept,
  onReject,
  onPayment,
  notificationId,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [rentalDetails, setRentalDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [requesterProfile, setRequesterProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const { getToken } = useAuth();

  // Fetch rental request details
  const fetchRentalDetails = async () => {
    if (!notification.relatedId) return;

    try {
      setLoadingDetails(true);
      const token = await getToken();
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/rental-requests/${notification.relatedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rental details");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch rental details");
      }

      setRentalDetails(result.data);
    } catch (error) {
      console.error("Error fetching rental details:", error);
      toast.error("Failed to load rental details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Toggle details and fetch rental details if not already fetched
  const toggleDetails = () => {
    setShowDetails(!showDetails);
    if (!showDetails && !rentalDetails) {
      fetchRentalDetails();
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return {
          bg: "bg-white",
          border: "border-gray-200",
          text: "text-green-800",
          headerBg: "bg-white",
          detailsBg: "bg-white",
          buttonHover: "hover:bg-gray-50",
          iconColor: "text-green-600",
          shadow: "shadow-md-blur",
          statusBadge: "bg-green-100 text-green-800 border border-green-200",
          divider: "border-gray-200",
          headerText: "text-green-900",
          contentText: "text-green-700",
          hoverEffect: "shadow-md-blur",
          buttonBg: "bg-green-600 hover:bg-green-700",
        };
      case "rejected":
        return {
          bg: "bg-white",
          border: "border-gray-200",
          text: "text-red-800",
          headerBg: "bg-white",
          detailsBg: "bg-white",
          buttonHover: "hover:bg-gray-50",
          iconColor: "text-red-600",
          shadow: "shadow-md-blur",
          statusBadge: "bg-red-100 text-red-800 border border-red-200",
          divider: "border-gray-200",
          headerText: "text-red-900",
          contentText: "text-red-700",
          hoverEffect: "shadow-md-blur",
          buttonBg: "bg-red-500 hover:bg-red-600",
        };
      default: // Pending
        return {
          bg: "bg-white",
          border: "border-gray-200",
          text: "text-teal-800",
          headerBg: "bg-white",
          detailsBg: "bg-white",
          buttonHover: "hover:bg-gray-50",
          iconColor: "text-teal-600",
          shadow: "shadow-md-blur",
          statusBadge: "bg-teal-100 text-teal-800 border border-teal-200",
          divider: "border-gray-200",
          headerText: "text-teal-900",
          contentText: "text-teal-700",
          hoverEffect: "shadow-md-blur",
          buttonBg: "bg-teal-600 hover:bg-teal-700",
        };
    }
  };

  const colors = getStatusColor(notification.status);

  // Check if actions section should be shown
  const shouldShowActions = () => {
    if (notification.relatedTo === "rental_request") {
      return (
        notification.status !== "accepted" && notification.status !== "rejected"
      );
    }
    if (notification.relatedTo === "negotiation_request") {
      return (
        notification.status !== "accepted" && notification.status !== "rejected"
      );
    }
    if (notification.relatedTo === "rental_response") {
      return (
        !notification.paymentStatus ||
        notification.paymentStatus !== "completed"
      );
    }
    return false;
  };

  return (
    <>
      <motion.div
        className={`rounded-xl overflow-hidden ${colors.shadow} ${colors.bg} border ${colors.border} transition-transform duration-200 ${colors.hoverEffect}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0 }}>
        {/* Notification Header */}
        <div className={`p-4 border-b ${colors.divider} ${colors.headerBg}`}>
          <div className="mb-2 flex items-start justify-between">
            <h3 className={`text-lg font-semibold ${colors.headerText}`}>
              {notification.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${colors.statusBadge}`}>
              {notification.status}
            </span>
          </div>
          <p className={colors.contentText}>{notification.message}</p>
        </div>

        {/* View Request Button */}
        <div className={`px-4 py-2 ${colors.detailsBg}`}>
          <button
            onClick={toggleDetails}
            className={`w-full text-left flex items-center justify-between p-1 ${colors.text}`}>
            <div className="flex items-center space-x-2">
              <FaUser className={colors.iconColor} />
              <span>
                {showDetails ? "Hide Details" : "View Request Details"}
              </span>
            </div>
            {showDetails ? (
              <FaChevronUp className={colors.iconColor} />
            ) : (
              <FaChevronDown className={colors.iconColor} />
            )}
          </button>
        </div>

        {/* Rental Details Section */}
        {showDetails && rentalDetails && (
          <div className={`px-4 pt-0.5 pb-4 ${colors.detailsBg}`}>
            <div className="space-y-3 px-2">
              {/* Duration */}
              <div className="flex items-start space-x-1.5">
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className={colors.iconColor} />
                  <p className={`text-sm font-medium ${colors.headerText}`}>
                    Duration:
                  </p>
                </div>
                <p className={`text-sm ${colors.contentText}`}>
                  {formatDate(rentalDetails.requestStartDate)} -{" "}
                  {formatDate(rentalDetails.requestEndDate)}
                </p>
              </div>

              {/* Total Days */}
              <div className="flex items-center space-x-1.5">
                <div className="flex items-center space-x-2">
                  <FaClock className={colors.iconColor} />
                  <p className={`text-sm font-medium ${colors.headerText}`}>
                    Total Days:
                  </p>
                </div>
                <p className={`text-sm ${colors.contentText}`}>
                  {rentalDetails.totalDays} days
                </p>
              </div>

              {/* Total Cost */}
              <div className="flex items-center space-x-1.5">
                <div className="flex items-center space-x-2">
                  <FaRupeeSign className={colors.iconColor} />
                  <p className={`text-sm font-medium ${colors.headerText}`}>
                    Total Cost:
                  </p>
                </div>
                <p className={`text-sm ${colors.contentText}`}>
                  ₹{rentalDetails.totalCost}
                </p>
              </div>

              {/* Message */}
              <div className="text-sm">
                <p className={`font-medium ${colors.headerText}`}>Message:</p>
                <p className={colors.contentText}>{rentalDetails.message}</p>
              </div>

              {/* Equipment Details */}
              <div className="space-y-2">
                <p className={`text-sm font-medium ${colors.headerText}`}>
                  Equipment Details:
                </p>
                <p className={`text-sm ${colors.contentText}`}>
                  <strong>Description:</strong>{" "}
                  {rentalDetails.equipmentId.description}
                </p>
                <p className={`text-sm ${colors.contentText}`}>
                  <strong>Rental Per Hour:</strong> ₹
                  {rentalDetails.equipmentId.rentalPerHour}
                </p>
                <p className={`text-sm ${colors.contentText}`}>
                  <strong>Rental Per Day:</strong> ₹
                  {rentalDetails.equipmentId.rentalPerDay}
                </p>
                <p className={`text-sm ${colors.contentText}`}>
                  <strong>Pickup Location:</strong>{" "}
                  {rentalDetails.equipmentId.pickupLocation}
                </p>
                <p className={`text-sm ${colors.contentText}`}>
                  <strong>Number Plate:</strong>{" "}
                  {rentalDetails.equipmentId.numberPlateNumber}
                </p>
                <p className={`text-sm ${colors.contentText}`}>
                  <strong>Equipment Type:</strong>{" "}
                  {rentalDetails.equipmentId.equipmentType}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {shouldShowActions() && (
          <div className={`p-4 bg-white border-t ${colors.divider}`}>
            {(notification.relatedTo === "rental_request"  ||
              notification.relatedTo === "negotiation_request") && (
              <div className="flex space-x-3">
                <button
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition
                    ${
                      notification.status === "accepted" ||
                      notification.status === "rejected"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  onClick={() => onAccept(notification._id)}
                  disabled={
                    notification.status === "accepted" ||
                    notification.status === "rejected"
                  }>
                  <FaCheckCircle />
                  <span>Accept</span>
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition
                    ${
                      notification.status === "accepted" ||
                      notification.status === "rejected"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  onClick={() => onReject(notification._id)}
                  disabled={
                    notification.status === "accepted" ||
                    notification.status === "rejected"
                  }>
                  <FaTimesCircle />
                  <span>Reject</span>
                </button>
              </div>
            )}

            {notification.relatedTo === "rental_response" && (
              <button
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition text-white ${colors.buttonBg}`}
                onClick={() => onPayment(notification, notificationId)} // Ensure this function is correctly passed
              >
                <FaMoneyBillWave />
                <span>Make Payment</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default NotificationItem;
