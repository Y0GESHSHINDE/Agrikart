import React, { useState } from 'react';
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
  FaChevronUp
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import ProfilePopup from './ProfilePopup';

const NotificationItem = ({ 
  notification, 
  onAccept, 
  onReject, 
  onPayment 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Sample profile data (replace with actual API call in production)
  const requesterProfile = {
    name: "John Doe",
    phone: "+91 98765 43210",
    email: "john.doe@example.com",
    address: {
      village: "Green Valley Farm",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001"
    },
    totalRentals: 5,
    memberSince: "January 2024",
    rating: 4.5
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          text: 'text-green-800',
          headerBg: 'bg-white',
          detailsBg: 'bg-white',
          buttonHover: 'hover:bg-gray-50',
          iconColor: 'text-green-600',
          shadow: 'shadow-md-blur',
          statusBadge: 'bg-green-100 text-green-800 border border-green-200',
          divider: 'border-gray-200',
          headerText: 'text-green-900',
          contentText: 'text-green-700',
          hoverEffect: 'shadow-md-blur',
          buttonBg: 'bg-green-600 hover:bg-green-700'
        };
      case 'rejected':
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          text: 'text-red-800',
          headerBg: 'bg-white',
          detailsBg: 'bg-white',
          buttonHover: 'hover:bg-gray-50',
          iconColor: 'text-red-600',
          shadow: 'shadow-md-blur',
          statusBadge: 'bg-red-100 text-red-800 border border-red-200',
          divider: 'border-gray-200',
          headerText: 'text-red-900',
          contentText: 'text-red-700',
          hoverEffect: 'shadow-md-blur',
          buttonBg: 'bg-red-500 hover:bg-red-600'
        };
      default: // Pending
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          text: 'text-teal-800',
          headerBg: 'bg-white',
          detailsBg: 'bg-white',
          buttonHover: 'hover:bg-gray-50',
          iconColor: 'text-teal-600',
          shadow: 'shadow-md-blur',
          statusBadge: 'bg-teal-100 text-teal-800 border border-teal-200',
          divider: 'border-gray-200',
          headerText: 'text-teal-900',
          contentText: 'text-teal-700',
          hoverEffect: 'shadow-md-blur',
          buttonBg: 'bg-teal-600 hover:bg-teal-700'
        };
    }
  };

  const colors = getStatusColor(notification.status);

  // Check if actions section should be shown
  const shouldShowActions = () => {
    if (notification.relatedTo === "rental_request") {
      return notification.status !== 'accepted' && notification.status !== 'rejected';
    }
    if (notification.relatedTo === "rental_response") {
      return !notification.paymentStatus || notification.paymentStatus !== 'completed';
    }
    return false;
  };

  return (
    <>
      <motion.div
        className={`rounded-xl overflow-hidden ${colors.shadow} ${colors.bg} border ${colors.border} transition-transform duration-200 ${colors.hoverEffect}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0 }}
      >
        {/* Notification Header */}
        <div className={`p-4 border-b ${colors.divider} ${colors.headerBg}`}>
          <div className="mb-2 flex items-start justify-between">
            <h3 className={`text-lg font-semibold ${colors.headerText}`}>
              {notification.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${colors.statusBadge}`}>
              {notification.status}
            </span>
          </div>
          <p className={colors.contentText}>{notification.message}</p>
        </div>

        {/* View Request Button */}
        <div className={`px-4 py-2 ${colors.detailsBg}`}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`w-full text-left flex items-center justify-between p-1 ${colors.text}`}
          >
            <div className="flex items-center space-x-2">
              <FaUser className={colors.iconColor} />
              <span>{showDetails ? 'Hide Details' : 'View Request Details'}</span>
            </div>
            {showDetails ?
              <FaChevronUp className={colors.iconColor} /> :
              <FaChevronDown className={colors.iconColor} />
            }
          </button>
        </div>

        {/* Rental Details Section */}
        {showDetails && notification.relatedTo === "rental_request" && notification.rentalDetails && (
          <div className={`px-4 pt-0.5 pb-4 ${colors.detailsBg}`}>
            <div className="space-y-3 px-2">
              <div className="flex items-start space-x-1.5">
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className={colors.iconColor} />
                  <p className={`text-sm font-medium ${colors.headerText}`}>Duration:</p>
                </div>
                <p className={`text-sm ${colors.contentText}`}>
                  {formatDate(notification.rentalDetails.requestStartDate)} - {formatDate(notification.rentalDetails.requestEndDate)}
                </p>
              </div>
              
              <div className="flex items-center space-x-1.5">
                <div className="flex items-center space-x-2">
                  <FaClock className={colors.iconColor} />
                  <p className={`text-sm font-medium ${colors.headerText}`}>Total Days:</p>
                </div>
                <p className={`text-sm ${colors.contentText}`}>{notification.rentalDetails.totalDays} days</p>
              </div>

              <div className="flex items-center space-x-1.5">
                <div className="flex items-center space-x-2">
                  <FaRupeeSign className={colors.iconColor} />
                  <p className={`text-sm font-medium ${colors.headerText}`}>Total Cost:</p>
                </div>
                <p className={`text-sm ${colors.contentText}`}>₹{notification.rentalDetails.totalCost}</p>
              </div>

              <div className="text-sm">
                <p className={`font-medium ${colors.headerText}`}>Message:</p>
                <p className={colors.contentText}>{notification.rentalDetails.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* View Profile Button */}
        <div className={`px-4 py-2 ${colors.detailsBg} border-t ${colors.divider}`}>
          <button
            onClick={() => setShowProfile(true)}
            className={`w-full text-left flex items-center space-x-2 ${colors.text} ${colors.buttonHover} rounded p-1 transition-colors`}
          >
            <FaUserCircle className={colors.iconColor} />
            <span>View Requester Profile</span>
          </button>
        </div>

        {/* Action Buttons - Only shown when needed */}
        {shouldShowActions() && (
          <div className={`p-4 bg-white border-t ${colors.divider}`}>
            {notification.relatedTo === "rental_request" && (
              <div className="flex space-x-3">
                <button
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition
                    ${notification.status === 'accepted' || notification.status === 'rejected'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'}`}
                  onClick={() => onAccept(notification._id)}
                  disabled={notification.status === 'accepted' || notification.status === 'rejected'}
                >
                  <FaCheckCircle />
                  <span>Accept</span>
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition
                    ${notification.status === 'accepted' || notification.status === 'rejected'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'}`}
                  onClick={() => onReject(notification._id)}
                  disabled={notification.status === 'accepted' || notification.status === 'rejected'}
                >
                  <FaTimesCircle />
                  <span>Reject</span>
                </button>
              </div>
            )}

            {notification.relatedTo === "rental_response" && (
              <button
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition text-white ${colors.buttonBg}`}
                onClick={() => onPayment(notification)}
              >
                <FaMoneyBillWave />
                <span>Make Payment</span>
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Profile Popup */}
      <ProfilePopup
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        profile={requesterProfile}
      />
    </>
  );
};

export default NotificationItem;