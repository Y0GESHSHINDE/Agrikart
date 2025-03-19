import { useState, useCallback, useEffect } from 'react';
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

export const useProfile = () => {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      if (!isSignedIn || !user) {
        setUserData(null);
        return;
      }

      setIsLoading(true);
      const token = await getToken();

      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const result = await response.json();
      setUserData(result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, user, getToken]);

  const updateUserData = useCallback(async (updatedData) => {
    try {
      if (!isSignedIn || !user) {
        throw new Error("User not authenticated");
      }

      const token = await getToken();

      // Clean and restructure data
      const cleanValue = (value) => {
        if (!value || value === "Not specified") return "";
        return value.trim();
      };

      // Restructure data to match API expectations
      const apiData = {
        personalInfo: {
          farmSize: cleanValue(updatedData.farmSize),
          soilType: cleanValue(updatedData.soilType),
          waterSource: cleanValue(updatedData.waterSource),
          farmingMethods: cleanValue(updatedData.farmingMethods)
        },
        address: {
          village: cleanValue(updatedData.village),
          city: cleanValue(updatedData.city),
          state: cleanValue(updatedData.state),
          pincode: cleanValue(updatedData.pincode)
        }
      };

      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/users/${user.id}/personal-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update profile data: ${errorData.message}`);
      }

      await fetchUserData();
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error(`Failed to update profile data: ${error.message}`);
      return false;
    }
  }, [isSignedIn, user, getToken, fetchUserData]);

  // Fetch user data on mount and when auth state changes
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    userData,
    isLoading,
    fetchUserData,
    updateUserData,
    user,
    isSignedIn
  };
};