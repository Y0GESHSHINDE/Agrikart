import React, { useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NegotiateModal({
  isOpen,
  onClose,
  instrumentName,
  instrumentId,
  instrumentPrice,
}) {
  const { user } = useUser();
  const userId = user?.id; // Ensure user is defined
  const [proposedPrice, setProposedPrice] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStartDateChange = (e) => {
    const startDateTime = new Date(e.target.value);
    const currentDateTime = new Date();
    const endDateTimeInput = document.getElementById("negotiateEndDateTime");

    // Ensure the selected start date is not in the past
    if (startDateTime < currentDateTime) {
      e.target.value = ""; // Reset the start date input
      toast.error("Please select a future date and time");
      return;
    }

    // Set the minimum value for the end date to be 1 hour after the start date
    const minEndDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    endDateTimeInput.min = minEndDateTime.toISOString().slice(0, 16);
  };

  const handleEndDateChange = (e) => {
    const startDateTimeInput = document.getElementById(
      "negotiateStartDateTime"
    );
    const startDateTime = new Date(startDateTimeInput.value);
    const endDateTime = new Date(e.target.value);

    // Ensure the end date is at least 1 hour after the start date
    if (endDateTime <= new Date(startDateTime.getTime() + 60 * 60 * 1000)) {
      e.target.value = ""; // Reset the end date input
      toast.error("End time must be at least 1 hour after start time");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("You must be logged in to negotiate");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.target);

    const payload = {
      equipmentId: instrumentId,
      requesterId: userId,
      requestStartDate: formData.get("startDateTime"),
      requestEndDate: formData.get("endDateTime"),
      rentalType: "daily",
      totalCost: parseFloat(proposedPrice),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(
        "https://main-backend-agrikart.vercel.app/api/rental-requests/negotiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success("Negotiation request submitted successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
        setTimeout(() => {
          onClose();
        }, 1500); // 1.5-second delay
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Failed to submit negotiation request",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      }
    } catch (error) {
      console.error("Negotiation error:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
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
              Negotiate Price for {instrumentName}
            </h2>

            {/* Negotiation form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">
                  Current price: ₹{instrumentPrice} per day
                </p>
              </div>

              <div>
                <label
                  htmlFor="negotiateStartDateTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date and Time
                </label>
                <input
                  type="datetime-local"
                  id="negotiateStartDateTime"
                  name="startDateTime"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                  min={new Date().toISOString().slice(0, 16)} // Disable past dates
                  onClick={(e) => e.target.showPicker()}
                  onChange={handleStartDateChange}
                />
              </div>

              <div>
                <label
                  htmlFor="negotiateEndDateTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date and Time
                </label>
                <input
                  type="datetime-local"
                  id="negotiateEndDateTime"
                  name="endDateTime"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                  onClick={(e) => e.target.showPicker()}
                  onChange={handleEndDateChange}
                />
              </div>

              <div>
                <label
                  htmlFor="proposedPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Proposed Price (Total)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="proposedPrice"
                    id="proposedPrice"
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 focus:border-green-500 focus:ring-green-500"
                    placeholder="0.00"
                    required
                    min="1"
                    step="0.01"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                  />
                </div>
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
                  placeholder="Explain why you're proposing this price..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Negotiation Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
