import React from "react";
import { X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RentNowModal({
  isOpen,
  onClose,
  instrumentName,
  instrumentId,
  instrumentPrice,
}) {
  const { user } = useUser();
  const userId = user?.id; // Ensure user is defined

  if (!isOpen) return null;

  const handleStartDateChange = (e) => {
    const startDateTime = new Date(e.target.value);
    const currentDateTime = new Date();
    const endDateTimeInput = document.getElementById("endDateTime");

    // Ensure the selected start date is not in the past
    if (startDateTime < currentDateTime) {
      e.target.value = ""; // Reset the start date input
      return;
    }

    // Set the minimum value for the end date to be 1 hour after the start date
    const minEndDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    endDateTimeInput.min = minEndDateTime.toISOString().slice(0, 16);
  };

  const handleEndDateChange = (e) => {
    const startDateTimeInput = document.getElementById("startDateTime");
    const startDateTime = new Date(startDateTimeInput.value);
    const endDateTime = new Date(e.target.value);

    // Ensure the end date is at least 1 hour after the start date
    if (endDateTime <= new Date(startDateTime.getTime() + 60 * 60 * 1000)) {
      e.target.value = ""; // Reset the end date input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const startDateTime = new Date(formData.get("startDateTime"));
    const endDateTime = new Date(formData.get("endDateTime"));

    const diffInMs = endDateTime - startDateTime;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const totalCost = (diffInHours * instrumentPrice).toFixed(2);

    const payload = {
      equipmentId: instrumentId,
      requesterId: userId,
      requestStartDate: formData.get("startDateTime"),
      requestEndDate: formData.get("endDateTime"),
      rentalType: "daily",
      totalCost: totalCost,
      message: formData.get("message"),
    };

    console.log("Rental request payload:", payload);

    try {
      const response = await fetch(
        "https://main-backend-agrikart.vercel.app/api/rental-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success("Rental request submitted successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
        setTimeout(() => {
          onClose();
        }, 1000); // 1-second delay
      } else {
        toast.error("Failed to submit rental request. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <>
      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={5000} />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal header */}
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Rent {instrumentName}
            </h2>

            {/* Rental form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="startDateTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date and Time
                </label>
                <input
                  type="datetime-local"
                  id="startDateTime"
                  name="startDateTime"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                  autoFocus
                  min={new Date().toISOString().slice(0, 16)} // Disable past dates
                  onClick={(e) => e.target.showPicker()}
                  onChange={handleStartDateChange}
                />
              </div>

              <div>
                <label
                  htmlFor="endDateTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date and Time
                </label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  name="endDateTime"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                  onClick={(e) => e.target.showPicker()}
                  onChange={handleEndDateChange}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message for Owner
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Submit Rental Request
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}