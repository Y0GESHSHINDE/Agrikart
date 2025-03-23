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
  FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "../Navbar/Navbar";
import { useUser, useAuth } from "@clerk/clerk-react";
import NotificationItem from "./NotificationItem";
import { toast } from "react-toastify";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

  // Filter option configurations
  const filterOptions = {
    type: [
      { value: 'all', label: 'All', icon: FaList },
      { value: 'rental', label: 'Rental Requests', icon: FaTractor },
      { value: 'payment', label: 'Payments', icon: FaMoneyBillWave }
    ],
    status: [
      { value: 'pending', label: 'Pending', icon: FaClock },
      { value: 'accepted', label: 'Accepted', icon: FaCheckCircle },
      { value: 'rejected', label: 'Rejected', icon: FaTimesCircle }
    ]
  };

  // Get active filter labels
  const getActiveFilterLabel = () => {
    const activeFilter = [...filterOptions.type, ...filterOptions.status]
      .find(filter => filter.value === activeTab);
    return activeFilter?.label || 'All';
  };

  // Animation variants for filter container
  const filterContainerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };
  
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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
          const notificationsWithDetails = await Promise.all(
            result.data.map(async (notification) => {
              if (notification.relatedTo === "rental_request") {
                const rentalDetails = await fetchRentalDetails(
                  notification.relatedId,
                  token
                );
                return { ...notification, rentalDetails };
              }
              return notification;
            })
          );
          setNotifications(notificationsWithDetails);
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
  }, [user, getToken]); // Only re-run when user or getToken changes

  // Fetch rental details using relatedId
  const fetchRentalDetails = async (relatedId, token) => {
    try {
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/rental-requests/${relatedId}`,
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
      return result.data;
    } catch (error) {
      console.error("Error fetching rental details:", error);
      return null;
    }
  };

  // Handle Accept/Reject actions
  const handleDecision = async (id, decision) => {
    try {
      const notification = notifications.find((notif) => notif._id === id);
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
        throw new Error(result.message || "Failed to update rental request status");
      }

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, status: decision } : notif
        )
      );

      toast.success(`Rental request ${decision} successfully!`);
    } catch (error) {
      console.error("Error updating rental request status:", error);
      toast.error(error.message || "Failed to update request. Please try again.");
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
            Authorization: `Bearer ${token}`
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
        description: `Rental payment for ${orderData.data.equipmentName || "equipment"}`,
        order_id: orderData.data.orderId,
        handler: function (response) {
          verifyPayment(response, orderData.data.paymentId, token);
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
  const verifyPayment = async (razorpayResponse, paymentId, token) => {
    try {
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/payments/verify`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
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
            notif.relatedId === paymentId
              ? { ...notif, paymentStatus: "completed" }
              : notif
          )
        );
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
  const filteredNotifications = notifications
    .filter(notification => {
      const matchesSearch = 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());

      switch (activeTab) {
        case 'all':
          return matchesSearch;
        case 'rental':
          return matchesSearch && notification.relatedTo === 'rental_request';
        case 'payment':
          return matchesSearch && 
            (notification.relatedTo === 'rental_response' || notification.relatedTo === 'payment_confirmation');
        case 'pending':
          return matchesSearch && notification.status === 'pending';
        case 'accepted':
          return matchesSearch && notification.status === 'accepted';
        case 'rejected':
          return matchesSearch && notification.status === 'rejected';
        default:
          return false;
      }
    });

  // Filter button component with hover effect
  const FilterButton = ({ icon: Icon, label, value }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-4 py-2 rounded-lg flex items-center justify-center transition-all duration-200
        ${activeTab === value 
          ? 'bg-green-100 text-green-700 ring-1 ring-green-200 shadow-sm' 
          : 'text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
      onClick={() => setActiveTab(value)}
    >
      <Icon className={`mr-2 ${activeTab === value ? 'text-green-600' : ''}`} />
      <span className="font-medium">{label}</span>
    </motion.button>
  );

  // Reset filters
  const resetFilters = () => {
    setActiveTab('all');
    setSearchTerm('');
  };

  // Render filters
  const renderFilters = () => (
    <div className="mb-6 space-y-4">
      {/* Search Bar and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-all duration-200 hover:border-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-base"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Active Filter Badge */}
          {activeTab !== 'all' && (
            <div className="flex items-center rounded-xl bg-green-100 px-3 py-2 text-green-700">
              <span className="text-sm font-medium">{getActiveFilterLabel()}</span>
              <button
                onClick={resetFilters}
                className="ml-2 transition-colors hover:text-green-800"
              >
                <FaTimes />
              </button>
            </div>
          )}
          
          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2
              ${showFilters 
                ? 'bg-green-100 text-green-700 ring-1 ring-green-200 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FaFilter className="text-lg" />
            <span className="text-sm font-medium">Filters</span>
            <FaChevronDown 
              className={`text-sm transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
            />
          </motion.button>
        </div>
      </div>

      {/* Animated Filter Groups */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            variants={filterContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="rounded-xl border border-gray-200/80 bg-white shadow-sm backdrop-blur-sm"
          >
            {/* Type Filters */}
            <div className="border-b border-gray-100 p-4">
              <h3 className="mb-3 flex items-center text-sm font-medium text-gray-500">
                <FaList className="mr-2" />
                Filter by Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.type.map(filter => (
                  <FilterButton 
                    key={filter.value}
                    icon={filter.icon}
                    label={filter.label}
                    value={filter.value}
                  />
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div className="p-4">
              <h3 className="mb-3 flex items-center text-sm font-medium text-gray-500">
                <FaClock className="mr-2" />
                Filter by Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.status.map(filter => (
                  <FilterButton 
                    key={filter.value}
                    icon={filter.icon}
                    label={filter.label}
                    value={filter.value}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-2 py-6 sm:px-6 sm:py-12">
          <h2 className="mb-6 text-center text-2xl font-bold text-green-700 sm:text-4xl">
            <FaBell className="mr-2 inline-block" />
            Rental Requests & Notifications
          </h2>
          <p className="text-center text-gray-600">Loading notifications...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-2 py-6 sm:px-6 sm:py-12">
          <h2 className="mb-6 text-center text-2xl font-bold text-green-700 sm:text-4xl">
            <FaBell className="mr-2 inline-block" />
            Rental Requests & Notifications
          </h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-2 py-6 sm:px-6 sm:py-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-700 sm:text-4xl">
          <FaBell className="mr-2 inline-block" />
          Rental Requests & Notifications
        </h2>

        {/* Search and Filters */}
        {renderFilters()}

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
