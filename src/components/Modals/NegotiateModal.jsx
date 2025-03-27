import React, { useState } from "react";
import { X } from "lucide-react";

export default function NegotiateModal({
  isOpen,
  onClose,
  instrumentId,
  originalPrice,
}) {
  const [negotiatedPrice, setNegotiatedPrice] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get user ID from local storage or auth context
  // This is a placeholder - replace with your actual auth implementation
  const userId =
    localStorage.getItem("userId") || "user_2uaiD4yT0ZTcmqimqDsARODH92F";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://main-backend-agrikart.vercel.app/api/rental-requests/${instrumentId}/negotiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            negotiatedPrice: Number(negotiatedPrice),
            message,
            userId,
            isOwner: false,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send negotiation request");
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Negotiate Price
        </h2>

        {success ? (
          <div className="rounded-md bg-green-50 p-4 text-center">
            <p className="text-green-800">
              Negotiation request sent successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="currentPrice"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Current Price
              </label>
              <input
                type="text"
                id="currentPrice"
                value={`₹${originalPrice}`}
                disabled
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="negotiatedPrice"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Your Offer (₹)
              </label>
              <input
                type="number"
                id="negotiatedPrice"
                value={negotiatedPrice}
                onChange={(e) => setNegotiatedPrice(e.target.value)}
                placeholder="Enter your price offer"
                required
                min="1"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain why you're requesting this price"
                rows="3"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500"
              ></textarea>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {isLoading ? "Sending..." : "Send Offer"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
