import React, { useState, useEffect, useRef } from "react";
import { HiUpload, HiCheck, HiLocationMarker, HiChevronDown, HiOutlineRefresh } from "react-icons/hi";

const HOURS_PER_DAY = 24;

const AddInstrument = ({ onAddInstrument, initialData = null, isEditing = false }) => {
  const formRef = useRef(null);
  const typeSelectRef = useRef(null);
  
  const [formData, setFormData] = useState(
    initialData || {
      equipmentName: "",
      equipmentType: "",
      brand: "",
      model: "",
      chassisNumber: "",
      description: "",
      rentalPerHour: "",
      rentalPerDay: "",
      pickupLocation: "",
      numberPlateNumber: "",
      primaryImage: null,
      secondaryImage: null,
      images: []
    }
  );

  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (isEditing && typeSelectRef.current) {
      typeSelectRef.current.focus();
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const fileList = Array.from(files);
      const imageUrls = fileList.map(file => URL.createObjectURL(file));

      if (name === "primaryImage") {
        setFormData(prev => ({
          ...prev,
          primaryImage: imageUrls[0],
          images: [imageUrls[0], ...prev.images.slice(1)]
        }));
      } else if (name === "secondaryImage") {
        setFormData(prev => ({
          ...prev,
          secondaryImage: imageUrls[0],
          images: [prev.primaryImage || "", imageUrls[0], ...prev.images.slice(2)]
        }));
      }
    } else if (name === "equipmentType") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(value === "Non-Vehicle" && {
          chassisNumber: "",
          numberPlateNumber: ""
        })
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      if (name === "rentalPerHour" && value) {
        const calculatedDaily = Number(value) * HOURS_PER_DAY;
        setFormData(prev => ({
          ...prev,
          rentalPerDay: calculatedDaily.toString()
        }));
      }
    }

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const imageUrl = URL.createObjectURL(file);

      if (!formData.primaryImage) {
        setFormData(prev => ({
          ...prev,
          primaryImage: imageUrl,
          images: [imageUrl, ...prev.images]
        }));
      } else if (!formData.secondaryImage) {
        setFormData(prev => ({
          ...prev,
          secondaryImage: imageUrl,
          images: [prev.images[0], imageUrl, ...prev.images.slice(2)]
        }));
      }
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=YOUR_API_KEY`
            );
            const data = await response.json();
            if (data.results[0]) {
              setFormData(prev => ({
                ...prev,
                pickupLocation: data.results[0].formatted
              }));
            }
          } catch (error) {
            setErrors(prev => ({
              ...prev,
              pickupLocation: "Failed to get location. Please enter manually."
            }));
          } finally {
            setIsGettingLocation(false);
          }
        },
        () => {
          setErrors(prev => ({
            ...prev,
            pickupLocation: "Location access denied. Please enter manually."
          }));
          setIsGettingLocation(false);
        }
      );
    }
  };

  const removeImage = (index) => {
    if (index === 0) {
      setFormData(prev => ({
        ...prev,
        primaryImage: null,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else if (index === 1) {
      setFormData(prev => ({
        ...prev,
        secondaryImage: null,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic Information
    if (!formData.equipmentName) newErrors.equipmentName = "Equipment name is required";
    if (!formData.equipmentType) newErrors.equipmentType = "Equipment type is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.model) newErrors.model = "Model is required";

    // Technical Details for Vehicles
    if (formData.equipmentType === "Vehicle") {
      if (!formData.chassisNumber) newErrors.chassisNumber = "Chassis number is required";
      if (!formData.numberPlateNumber) newErrors.numberPlateNumber = "Number plate is required";
    }

    // Pricing
    if (!formData.rentalPerHour) newErrors.rentalPerHour = "Hourly rate is required";
    if (!formData.rentalPerDay) newErrors.rentalPerDay = "Daily rate is required";

    // Location & Description
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.pickupLocation) newErrors.pickupLocation = "Pickup location is required";

    // Images
    if (!formData.primaryImage) newErrors.primaryImage = "Primary image is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onAddInstrument(formData, isEditing);
    if (!isEditing) {
      setFormData({
        equipmentName: "",
        equipmentType: "",
        brand: "",
        model: "",
        chassisNumber: "",
        description: "",
        rentalPerHour: "",
        rentalPerDay: "",
        pickupLocation: "",
        numberPlateNumber: "",
        primaryImage: null,
        secondaryImage: null,
        images: []
      });
    }
    setErrors({});
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6 rounded-lg bg-white px-3 py-1.5 shadow-sm md:p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        {isEditing ? 'Edit Equipment' : 'Add New Equipment'}
      </h2>

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Equipment Type*</label>
          <div className="relative">
            <select
              ref={typeSelectRef}
              name="equipmentType"
              value={formData.equipmentType}
              onChange={handleChange}
              className={`mt-1 block w-full appearance-none rounded-lg border ${errors.equipmentType ? 'border-red-500' : 'border-gray-300'} py-2 px-3 pr-10 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 [&_optgroup]:bg-white [&_option]:bg-white`}
              style={{ position: 'relative', transform: 'none !important' }}
            >
              <option value="">Select Type</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Non-Vehicle">Non-Vehicle</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <HiChevronDown className="h-5 w-5" />
            </div>
          </div>
          {errors.equipmentType && <p className="mt-1 text-sm text-red-500">{errors.equipmentType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Equipment Name*</label>
          <input
            type="text"
            name="equipmentName"
            value={formData.equipmentName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border ${errors.equipmentName ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="e.g., Sonalika Tractor"
          />
          {errors.equipmentName && <p className="mt-1 text-sm text-red-500">{errors.equipmentName}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand*</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${errors.brand ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="e.g., Sonalika"
            />
            {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Model*</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${errors.model ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="e.g., Worldtrac 75"
            />
            {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model}</p>}
          </div>
        </div>
      </div>

      {/* Technical Details for Vehicles */}
      {formData.equipmentType === "Vehicle" && (
        <div className="grid gap-4 pt-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Chassis Number*</label>
            <input
              type="text"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${errors.chassisNumber ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="e.g., SON75WT2023"
            />
            {errors.chassisNumber && <p className="mt-1 text-sm text-red-500">{errors.chassisNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number Plate*</label>
            <input
              type="text"
              name="numberPlateNumber"
              value={formData.numberPlateNumber}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${errors.numberPlateNumber ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="e.g., MH-42-AX-1234"
            />
            {errors.numberPlateNumber && <p className="mt-1 text-sm text-red-500">{errors.numberPlateNumber}</p>}
          </div>
        </div>
      )}

      {/* Rental Information */}
      <div className="grid gap-4 pt-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Rental Per Hour (₹)*</label>
          <input
            type="number"
            name="rentalPerHour"
            value={formData.rentalPerHour}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border ${errors.rentalPerHour ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="e.g., 350"
          />
          {errors.rentalPerHour && <p className="mt-1 text-sm text-red-500">{errors.rentalPerHour}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rental Per Day (₹)*</label>
          <input
            type="number"
            name="rentalPerDay"
            value={formData.rentalPerDay}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border ${errors.rentalPerDay ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="Auto-calculated"
            readOnly
          />
          {errors.rentalPerDay && <p className="mt-1 text-sm text-red-500">{errors.rentalPerDay}</p>}
        </div>
      </div>

      {/* Location & Description */}
      <div className="space-y-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Location*</label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className={`block w-full rounded-lg border ${errors.pickupLocation ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="e.g., Baramati, Maharashtra"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {isGettingLocation ? (
                <HiOutlineRefresh className="h-5 w-5 animate-spin" />
              ) : (
                <HiLocationMarker className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.pickupLocation && <p className="mt-1 text-sm text-red-500">{errors.pickupLocation}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`mt-1 block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="Describe your equipment's features and condition"
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Primary Image*</label>
          <div
            className={`mt-2 flex justify-center rounded-lg border-2 border-dashed ${dragActive ? 'border-green-500 bg-green-50' : errors.primaryImage ? 'border-red-500' : 'border-gray-300'} px-6 py-6`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              {formData.primaryImage ? (
                <div className="relative inline-block">
                  <img
                    src={formData.primaryImage}
                    alt="Primary preview"
                    className="mx-auto h-32 w-32 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(0)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <HiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm">
                    <label className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                      <span>Upload primary image</span>
                      <input type="file" name="primaryImage" className="sr-only" accept="image/*" onChange={handleChange} />
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">or drag and drop</p>
                </>
              )}
            </div>
          </div>
          {errors.primaryImage && <p className="mt-1 text-sm text-red-500">{errors.primaryImage}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Secondary Image (Optional)</label>
          <div
            className={`mt-2 flex justify-center rounded-lg border-2 border-dashed ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'} px-6 py-6`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              {formData.secondaryImage ? (
                <div className="relative inline-block">
                  <img
                    src={formData.secondaryImage}
                    alt="Secondary preview"
                    className="mx-auto h-32 w-32 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(1)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <HiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm">
                    <label className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                      <span>Upload secondary image</span>
                      <input type="file" name="secondaryImage" className="sr-only" accept="image/*" onChange={handleChange} />
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">or drag and drop</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {isEditing ? 'Save Changes' : 'Add Equipment'}
          <HiCheck className="ml-2 h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default AddInstrument;
