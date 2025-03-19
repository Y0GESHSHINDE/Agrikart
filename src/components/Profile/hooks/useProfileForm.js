import { useState, useCallback, useEffect } from 'react';

export const useProfileForm = () => {
  const [formData, setFormData] = useState({
    farmSize: "",
    soilType: "",
    waterSource: "",
    farmingMethods: "",
    village: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Only validate pincode if it's not empty
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    // Fields can be empty, so we don't need to validate them for emptiness
    // The bug was here - we were incorrectly validating fields that are intentionally left empty

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    // Prevent "Not specified" from being set as a value
    const newValue = value === "Not specified" ? "" : value;
    
    setFormData(prev => {
      const newFormData = { ...prev };
      newFormData[name] = newValue;
      return newFormData;
    });

    // Clear error when user starts typing
    setErrors(prev => {
      if (!prev[name]) return prev;
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const resetForm = useCallback((newData = {}) => {
    // Create a new object with default empty values
    const defaultFormData = {
      farmSize: "",
      soilType: "",
      waterSource: "",
      farmingMethods: "",
      village: "",
      city: "",
      state: "",
      pincode: "",
    };

    // Process newData to handle "Not specified" values
    const processedData = {};
    Object.entries(newData).forEach(([key, value]) => {
      processedData[key] = value === "Not specified" ? "" : (value || "");
    });

    // Merge the default form data with processed data
    setFormData({
      ...defaultFormData,
      ...processedData
    });
    
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    validateForm,
    resetForm
  };
};
