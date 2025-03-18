import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { HiPencil, HiTrash, HiLocationMarker } from 'react-icons/hi';

const EquipmentCard = ({
  instrument,
  viewMode,
  onEdit,
  onDelete
}) => {
  return (
    <div className={`group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
      }`}>
      <div className={`relative ${viewMode === 'list'
        ? 'h-48 sm:h-auto sm:w-72 sm:flex-shrink-0 lg:w-80'
        : 'aspect-w-16 aspect-h-9'
        }`}>
        <div className="h-full w-full overflow-hidden">
          <img
            src={instrument.images[0]}
            alt={instrument.equipmentName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg';
            }}
          />
        </div>
      </div>

      <div className={`flex-1 p-5 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
        <div className="mb-4">
          <div className="flex-1">
            <h4 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-green-600 sm:text-lg">
              {instrument.equipmentName}
            </h4>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-700 sm:text-sm">
                {instrument.brand} {instrument.model}
              </span>
              <span className="inline-flex items-center rounded-lg border border-green-100 px-2 py-0.5 text-xs font-medium text-green-600 transition-colors hover:border-green-200">
                {instrument.equipmentType}
              </span>
            </div>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
          {instrument.description}
        </p>

        <div className={`${viewMode === 'list' ? 'sm:mt-1 sm:flex sm:items-center sm:justify-center' : 'my-3'} grid grid-cols-2 gap-1.5 sm:gap-3`}>
          <div className="w-full">
            <div className="flex w-full items-center justify-center rounded-lg border border-gray-200 px-2 py-2 transition-all hover:border-green-500 hover:shadow-sm sm:px-2">
              <Clock className={`mr-2 h-5 w-5 flex-shrink-0 text-green-600 ${viewMode === "list" ? "w-6 h-6" : ""}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium text-gray-600`}>Hourly Rate</p>
                <p className={`truncate text-xs font-semibold text-gray-900`}>
                  ₹{instrument.rentalPerHour}/hr
                </p>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex w-full items-center justify-center rounded-lg border border-gray-200 px-2 py-2 transition-all hover:border-green-500 hover:shadow-sm sm:px-2">
              <Calendar className={`mr-2 h-5 w-5 flex-shrink-0 text-green-600 ${viewMode === "list" ? "w-6 h-6" : ""}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium text-gray-600`}>Daily Rate</p>
                <p className={`truncate text-xs font-semibold text-gray-900`}>
                  ₹{instrument.rentalPerDay}/day
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`flex items-center rounded-lg border border-gray-100 px-3 py-2 text-xs sm:text-sm text-gray-600 hover:border-gray-200 transition-colors ${viewMode === 'list' ? 'mt-4 mb-2' : 'my-4'}`}>
          <HiLocationMarker className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-500" />
          <span className="truncate">{instrument.pickupLocation}</span>
        </div>

        <div className={`flex flex-wrap items-center ${viewMode === 'list' ? 'justify-end gap-4' : 'justify-between gap-3'} mt-4`}>
          <button
            onClick={() => onEdit(instrument)}
            className={`touch-target hover:text-white" title="Edit equipment flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-400 px-3.5 py-2 text-neutral-800 transition-colors hover:bg-green-500 hover:text-white`}
          >
            <HiPencil className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs font-medium sm:text-sm">Edit</span>
          </button>
          <button
            onClick={() => onDelete(instrument.id)}
            className={`touch-target flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-400 px-3.5 py-2 text-neutral-800 transition-colors hover:bg-red-500 hover:text-white`}
            title="Delete equipment"
          >
            <HiTrash className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs font-medium sm:text-sm">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
