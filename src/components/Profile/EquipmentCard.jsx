import React, { useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { HiPencil, HiTrash, HiLocationMarker } from "react-icons/hi";
import UpdateInstrumentModal from "./UpdateInstruemnt";

const EquipmentCard = ({ instrument, viewMode, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/equipment/${instrument._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete equipment");
      }

      onDelete(instrument._id); // Call the parent component's onDelete function
    } catch (error) {
      console.error("Error deleting equipment:", error);
      alert("Failed to delete equipment. Please try again.");
    }
  };

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-lg ${
          viewMode === "list" ? "flex flex-col sm:flex-row" : ""
        }`}>
        {/* Image Section */}
        <div
          className={`relative ${
            viewMode === "list"
              ? "h-48 sm:w-72 lg:w-80"
              : "aspect-w-16 aspect-h-9"
          } flex-shrink-0`}>
          <img
            src={instrument.images.primaryImage.url}
            alt={instrument.equipmentName}
            className="h-full w-full rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105 sm:rounded-l-lg sm:rounded-tr-none md:h-48"
            onError={(e) => {
              e.target.src =
                "https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg";
            }}
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-5">
          {/* Title & Description */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
              {instrument.equipmentName}
            </h4>
            <p className="mt-1 text-sm text-gray-600">
              {instrument.brand} {instrument.model}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {instrument.description}
            </p>
          </div>

          {/* Pricing Section */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center rounded-lg border border-gray-200 px-2 py-2 transition hover:border-green-500 hover:shadow-sm sm:px-3">
              <Clock className="mr-2 h-5 w-5 min-w-5 max-w-5 text-green-600" />
              <p className="text-xs font-semibold text-gray-900">
                ₹{instrument.rentalPerHour}/hr
              </p>
            </div>
            <div className="flex items-center rounded-lg border border-gray-200 px-2 py-2 transition hover:border-green-500 hover:shadow-sm sm:px-3">
              <Calendar className="mr-2 h-5 w-5 min-w-5 max-w-5 text-green-600" />
              <p className="text-xs font-semibold text-gray-900">
                ₹{instrument.rentalPerDay}/day
              </p>
            </div>
          </div>

          {/* Location Section */}
          <div className="mt-4 flex items-center rounded-lg border border-gray-200 px-4 py-2 text-gray-600 transition hover:border-gray-300">
            <HiLocationMarker className="mr-2 h-5 w-5 text-gray-500" />
            <span className="truncate text-sm">
              {instrument.pickupLocation}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600">
              <HiPencil className="h-5 w-5" />
              <span className="text-sm font-medium">Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
              <HiTrash className="h-5 w-5" />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <UpdateInstrumentModal
          instrument={instrument}
          onClose={() => setIsModalOpen(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default EquipmentCard;