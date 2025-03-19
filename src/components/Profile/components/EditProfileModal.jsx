import React from 'react';
import { toast } from 'react-toastify';
import { FaTractor } from 'react-icons/fa';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';


const EditProfileModal = ({
  formData,
  errors,
  handleInputChange,
  onSubmit,
  onClose,
  isSubmitting
}) => {
  const inputClasses = "w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200";
  const errorClasses = "text-red-500 text-sm mt-1";
  const labelClasses = "block text-gray-700 font-medium mb-1";

  const formSections = [
    {
      title: "Farm Information",
      icon: <FaTractor className="text-2xl text-green-600" />,
      fields: [
        { name: "farmSize", label: "Farm Size", type: "text", placeholder: "Enter farm size" },
        { name: "soilType", label: "Soil Type", type: "text", placeholder: "Enter soil type" },
        { name: "waterSource", label: "Water Source", type: "text", placeholder: "Enter water source" },
        { name: "farmingMethods", label: "Farming Methods", type: "text", placeholder: "Enter farming methods" }
      ]
    },
    {
      title: "Address Information",
      icon: <FaMapMarkerAlt className="text-2xl text-green-600" />,
      fields: [
        { name: "village", label: "Village", type: "text", placeholder: "Enter village name" },
        { name: "city", label: "City", type: "text", placeholder: "Enter city name" },
        { name: "state", label: "State", type: "text", placeholder: "Enter state name" },
        { name: "pincode", label: "Pincode", type: "text", placeholder: "Enter 6-digit pincode" }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-lg">
        <div className="sticky top-0 rounded-t-xl border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-green-700">Edit Profile</h2>
            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 p-2 text-gray-500 transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
              aria-label="Close modal"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 p-6">
          {formSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-medium text-green-700">
                <span className="rounded-full bg-green-50 p-2">
                  {section.icon}
                </span>
                {section.title}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.name} className="space-y-1">
                    <label htmlFor={field.name} className={labelClasses}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className={`${inputClasses} ${
                        errors[field.name] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-invalid={errors[field.name] ? "true" : "false"}
                    />
                    {errors[field.name] && (
                      <p className={errorClasses} role="alert">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-4 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 transition-all duration-300 hover:border-green-300 hover:bg-green-50 hover:shadow-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-6 py-2.5 text-white transition-all duration-300 hover:bg-green-700 hover:shadow-md disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;