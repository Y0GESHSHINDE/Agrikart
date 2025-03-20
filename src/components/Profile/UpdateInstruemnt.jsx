import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateInstrumentModal = ({ instrument, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...instrument });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/equipment/${instrument._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update equipment");

      const updatedData = await response.json();
      onUpdate(updatedData);
      toast.success("Equipment updated successfully! ✅"); // Success toast
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update equipment. ❌"); // Error toast
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Equipment</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              name="equipmentName"
              value={formData.equipmentName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              placeholder="Equipment Name"
              required
            />
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              placeholder="Brand"
              required
            />
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              placeholder="Model"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              placeholder="Description"
              rows="3"
            />
            <input
              type="number"
              name="rentalPerHour"
              value={formData.rentalPerHour}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              placeholder="Hourly Rate"
              required
            />
            <input
              type="number"
              name="rentalPerDay"
              value={formData.rentalPerDay}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              placeholder="Daily Rate"
              required
            />
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              placeholder="Pickup Location"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-300 hover:bg-gray-400 p-2 rounded transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInstrumentModal;
