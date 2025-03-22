import React from 'react';
import { 
  FaTimes, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaHome,
  FaCity,
  FaFlag,
  FaMapPin,
  FaStar,
  FaHistory,
  FaCalendarAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePopup = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-2 rounded-lg p-2 transition-colors hover:bg-green-50 sm:space-x-3 sm:p-3">
      <Icon className="mt-1 min-w-[1rem] text-sm text-green-600 sm:min-w-[1.25rem] sm:text-base" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 sm:text-sm">{label}</p>
        <p className="truncate text-sm font-medium text-gray-800 sm:text-base">{value}</p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="relative mx-auto max-h-[90vh] w-full max-w-[calc(100%-1rem)] overflow-y-auto rounded-xl bg-white shadow-md-blur sm:max-w-md sm:rounded-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-2 top-2 z-10 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:right-4 sm:top-4 sm:p-2"
          >
            <FaTimes className="text-lg sm:text-xl" />
          </button>

          {/* Profile Header */}
          <div className="rounded-t-xl bg-gradient-to-r from-green-500 to-green-600 p-4 text-white sm:rounded-t-2xl sm:p-6">
            <div className="mb-3 flex items-center sm:mb-4">
              <div className="mr-3 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg sm:mr-4 sm:h-20 sm:w-20">
                <FaUser className="text-3xl text-green-600 sm:text-4xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 truncate text-lg font-bold text-white sm:text-2xl">
                  {profile.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="whitespace-nowrap rounded-full bg-white bg-opacity-20 px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm">
                    Equipment Renter
                  </span>
                  <div className="flex items-center text-xs text-yellow-300 sm:text-sm">
                    <FaStar className="mr-1" />
                    <span>{profile.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {/* Contact Information */}
            <div className="mb-4 sm:mb-6">
              <h4 className="mb-2 flex items-center text-base font-semibold text-gray-800 sm:mb-4 sm:text-lg">
                <FaUser className="mr-2 text-green-600" />
                Contact Information
              </h4>
              <div className="divide-y divide-gray-100 rounded-lg bg-gray-50 sm:rounded-xl">
                <InfoItem 
                  icon={FaPhone} 
                  label="Phone Number"
                  value={profile.phone}
                />
                <InfoItem 
                  icon={FaEnvelope} 
                  label="Email Address"
                  value={profile.email}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-4 sm:mb-6">
              <h4 className="mb-2 flex items-center text-base font-semibold text-gray-800 sm:mb-4 sm:text-lg">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                Address Details
              </h4>
              <div className="divide-y divide-gray-100 rounded-lg bg-gray-50 sm:rounded-xl">
                <InfoItem 
                  icon={FaHome} 
                  label="Village/Street"
                  value={profile.address.village}
                />
                <InfoItem 
                  icon={FaCity} 
                  label="City"
                  value={profile.address.city}
                />
                <InfoItem 
                  icon={FaFlag} 
                  label="State"
                  value={profile.address.state}
                />
                <InfoItem 
                  icon={FaMapPin} 
                  label="PIN Code"
                  value={profile.address.pincode}
                />
              </div>
            </div>

            {/* Rental History */}
            <div>
              <h4 className="mb-2 flex items-center text-base font-semibold text-gray-800 sm:mb-4 sm:text-lg">
                <FaHistory className="mr-2 text-green-600" />
                Rental History
              </h4>
              <div className="space-y-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-3 sm:space-y-3 sm:rounded-xl sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaHistory className="mr-2 text-sm text-green-600 sm:text-base" />
                    <span className="text-sm text-gray-700 sm:text-base">Total Rentals</span>
                  </div>
                  <span className="text-sm font-semibold text-green-700 sm:text-base">{profile.totalRentals}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-sm text-green-600 sm:text-base" />
                    <span className="text-sm text-gray-700 sm:text-base">Member Since</span>
                  </div>
                  <span className="text-sm font-semibold text-green-700 sm:text-base">{profile.memberSince}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaStar className="mr-2 text-sm text-green-600 sm:text-base" />
                    <span className="text-sm text-gray-700 sm:text-base">Rating</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-green-700 sm:text-base">{profile.rating}</span>
                    <span className="text-sm text-gray-500 sm:text-base">/5</span>
                    <FaStar className="ml-1 text-sm text-yellow-400 sm:text-base" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfilePopup;