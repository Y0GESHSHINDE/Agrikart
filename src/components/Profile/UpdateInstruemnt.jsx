import React, { useState } from "react";

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
      onClose();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Equipment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="equipmentName"
            value={formData.equipmentName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Equipment Name"
            required
          />
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Brand"
            required
          />
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Model"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Description"
            rows="3"
          />
          <input
            type="number"
            name="rentalPerHour"
            value={formData.rentalPerHour}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Hourly Rate"
            required
          />
          <input
            type="number"
            name="rentalPerDay"
            value={formData.rentalPerDay}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Daily Rate"
            required
          />
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Pickup Location"
            required
          />

          <div className="flex gap-3 mt-4">
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Save Changes
            </button>
            <button onClick={onClose} className="w-full bg-gray-300 p-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInstrumentModal;
  