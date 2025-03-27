import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function AddInstrument({ onClose }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const ownerID = user.id;
  const [formData, setFormData] = useState({
    equipmentName: "",
    brand: "",
    model: "",
    chassisNumber: "",
    description: "",
    rentalPerHour: "",
    rentalPerDay: "",
    pickupLocation: "",
    numberPlateNumber: "",
    ownerId: ownerID,
    primaryImage: null, // Store the image file
    secondaryImage: null, // Store the image file
    equipmentType: "",
    isVehicle: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      // Handle file input
      setFormData({
        ...formData,
        [name]: files[0], // Store the selected file
      });
    } else if (type === "checkbox") {
      // Handle checkbox input
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      // Handle other inputs
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send files and other data
    const payload = new FormData();
    payload.append("equipmentName", formData.equipmentName);
    payload.append("brand", formData.brand);
    payload.append("model", formData.model);
    payload.append("chassisNumber", formData.chassisNumber);
    payload.append("description", formData.description);
    payload.append("rentalPerHour", formData.rentalPerHour);
    payload.append("rentalPerDay", formData.rentalPerDay);
    payload.append("pickupLocation", formData.pickupLocation);
    payload.append("numberPlateNumber", formData.numberPlateNumber);
    payload.append("ownerId", formData.ownerId);
    payload.append("equipmentType", formData.equipmentType);
    payload.append("isVehicle", formData.isVehicle);

    // Append files
    if (formData.primaryImage) {
      payload.append("primaryImage", formData.primaryImage);
    }
    if (formData.secondaryImage) {
      payload.append("secondaryImage", formData.secondaryImage);
    }

    try {
      const response = await fetch(
        "https://main-backend-agrikart.vercel.app/api/equipment",
        {
          method: "POST",
          body: payload, // Send FormData directly
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json(); // Parse the error response
        console.error("Server Error:", errorResponse);
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
      toast.success("Equipment added successfully!");
      onClose(); // Close the form after successful submission
      // Reset form after successful submission
      setFormData({
        equipmentName: "",
        brand: "",
        model: "",
        chassisNumber: "",
        description: "",
        rentalPerHour: "",
        rentalPerDay: "",
        pickupLocation: "",
        numberPlateNumber: "",
        ownerId: ownerID,
        primaryImage: null,
        secondaryImage: null,
        equipmentType: "",
        isVehicle: false,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add equipment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Add Equipment</h2>

        <div className="space-y-4">
          {/* Equipment Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Equipment Name
            </label>
            <input
              type="text"
              name="equipmentName"
              value={formData.equipmentName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Equipment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Equipment Type
            </label>
            <select
              name="equipmentType"
              value={formData.equipmentType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required>
              <option value="" disabled>
                Select Equipment Type
              </option>
              <option value="Plows">Plows</option>
              <option value="Harrows">Harrows</option>
              <option value="Rotavators">Rotavators</option>
              <option value="Cultivators">Cultivators</option>
              <option value="Seed Drills">Seed Drills</option>
              <option value="Broadcast Seeders">Broadcast Seeders</option>
              <option value="Precision Planters">Precision Planters</option>
              <option value="Transplanters">Transplanters</option>
              <option value="Dibblers">Dibblers</option>
              <option value="Irrigation Systems">Irrigation Systems</option>
              <option value="Fertilizer Spreaders">Fertilizer Spreaders</option>
              <option value="Sprayers">Sprayers</option>
              <option value="Weeders">Weeders</option>
              <option value="Mulchers">Mulchers</option>
              <option value="Combine Harvesters">Combine Harvesters</option>
              <option value="Reapers">Reapers</option>
              <option value="Threshers">Threshers</option>
              <option value="Tractors">Tractors</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Chassis Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chassis Number
            </label>
            <input
              type="text"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Rental Per Hour */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rental Per Hour
            </label>
            <input
              type="number"
              name="rentalPerHour"
              value={formData.rentalPerHour}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Rental Per Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rental Per Day
            </label>
            <input
              type="number"
              name="rentalPerDay"
              value={formData.rentalPerDay}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pickup Location
            </label>
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Number Plate Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number Plate Number
            </label>
            <input
              type="text"
              name="numberPlateNumber"
              value={formData.numberPlateNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>

          {/* Is Vehicle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isVehicle"
              checked={formData.isVehicle}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Is Vehicle
            </label>
          </div>

          {/* Primary Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primary Image
            </label>
            <input
              type="file"
              name="primaryImage"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
          </div>

          {/* Secondary Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Secondary Image
            </label>
            <input
              type="file"
              name="secondaryImage"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddInstrument;
