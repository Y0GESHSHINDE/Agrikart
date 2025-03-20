import React from 'react';
import { X } from 'lucide-react';

export default function RentNowModal({ isOpen, onClose, instrumentName }) {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formDataInArray = [formData.get('startDateTime'), formData.get('endDateTime'), formData.get('message')];
        console.log(formDataInArray);
    }

    return (
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
                        <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-700">
                            Start Date and Time
                        </label>
                        <input type="datetime-local" id="startDateTime" name="startDateTime" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" required autoFocus onClick={(e) => e.target.showPicker()} />
                    </div>

                    <div>
                        <label htmlFor="endDateTime" className="block text-sm font-medium text-gray-700">
                            End Date and Time
                        </label>
                        <input type="datetime-local" id="endDateTime" name="endDateTime" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" required onClick={(e) => e.target.showPicker()} />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message for Owner
                        </label>
                        <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="Write your message here..." required />
                    </div>

                    <button type="submit"
                        className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        Submit Rental Request
                    </button>
                </form>
            </div>
        </div>
    );
}