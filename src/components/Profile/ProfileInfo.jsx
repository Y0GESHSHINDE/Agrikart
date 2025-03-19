import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth, useUser } from "@clerk/clerk-react";

// Custom hooks
import { useProfile } from "./hooks/useProfile";
import { useProfileForm } from "./hooks/useProfileForm";

// Components
import ProfileHeader from "./components/ProfileHeader";
import FarmInformation from "./components/FarmInformation";
import AddressInformation from "./components/AddressInformation";
import EditProfileModal from "./components/EditProfileModal";
import ActionCards from "./components/ActionCards";
import EarningsGraph from "./components/EarningsGraph";

const ProfileInfo = () => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const { userData, isLoading, fetchUserData, updateUserData } = useProfile();
  const { formData, errors, isSubmitting, setIsSubmitting, handleInputChange, validateForm, setFormData } = useProfileForm();
  
  // Set initial form data when showing the modal
  const handleShowEditPopup = () => {
    setFormData({
      farmSize: userData?.personalInfo?.farmSize || "",
      soilType: userData?.personalInfo?.soilType || "",
      waterSource: userData?.personalInfo?.waterSource || "",
      farmingMethods: userData?.personalInfo?.farmingMethods || "",
      village: userData?.address?.village || "",
      city: userData?.address?.city || "",
      state: userData?.address?.state || "",
      pincode: userData?.address?.pincode || "",
    });
    setShowEditPopup(true);
  };

  const { user, isLoaded, isSignedIn } = useUser();

  // Handle form submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    const success = await updateUserData(formData);
    if (success) {
      setShowEditPopup(false);
    }
    setIsSubmitting(false);
  };

  // Combine API data with defaults
  const userInfo = {
    profilePhoto: userData?.imgUrl || (isLoaded && isSignedIn ? user.imageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ9W15Hh_7mgF-oO3Dl_M32EWBjJUo_cA8Uw&s"),
    username: userData?.name || (isLoaded && isSignedIn ? user.fullName || user.username : "Loading..."),
    email: userData?.email || (isLoaded && isSignedIn ? user.primaryEmailAddress?.emailAddress : "Loading..."),
    mobileNumber: isLoaded && isSignedIn ? user.primaryPhoneNumber?.phoneNumber || "0000" : "Loading...",
    onEdit: () => setShowEditPopup(true),
    onRefresh: fetchUserData
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto mt-10 p-6">
        {isLoading ? (
          <div className="w-full py-8 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading profile data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-emerald-200 via-teal-200 to-green-200 p-8 shadow-lg">
              <ProfileHeader userInfo={userInfo} />
            </div>

            {/* Farm and Address Information */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FarmInformation
                farmInfo={{
                  farmSize: userData?.personalInfo?.farmSize || "",
                  soilType: userData?.personalInfo?.soilType || "",
                  waterSource: userData?.personalInfo?.waterSource || "",
                  farmingMethod: userData?.personalInfo?.farmingMethods || ""
                }}
              />
              <AddressInformation
                addressInfo={{
                  village: userData?.address?.village || "",
                  city: userData?.address?.city || "",
                  state: userData?.address?.state || "",
                  pincode: userData?.address?.pincode || "",
                  onEdit: () => setShowEditPopup(true)
                }}
              />
            </div>

            {/* Action Cards */}
            <ActionCards />

            {/* Earnings Graph */}
            <EarningsGraph />
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditPopup && (
          <EditProfileModal
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            onSubmit={handleUpdateProfile}
            onClose={() => setShowEditPopup(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProfileInfo;
