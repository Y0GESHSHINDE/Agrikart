import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from "react-icons/fa";

export default function Notifications() {
  const [requests, setRequests] = useState([
    // Requests received by Farmer 1
    {
      id: 1,
      requester: "Amit Sharma", // Farmer 2
      owner: "Farmer 1", // The owner of the equipment
      equipment: "🚜 Tractor",
      price: "₹2,500/day",
      status: "pending",
      type: "received", // Request received by Farmer 1
    },
    // Requests received by Farmer 2
    {
      id: 2,
      requester: "Farmer 1", // Farmer 1 is now the requester
      owner: "Ravi Patil", // Farmer 2 is the owner now
      equipment: "🌾 Harvester",
      price: "₹3,000/day",
      status: "accepted",
      type: "sent", // Request sent by Farmer 1
    },
  ]);

  // Function to accept or reject a request
  const handleDecision = (id, decision) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: decision } : req
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
          📩 Rental Requests & Notifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Loop through requests and show dynamic UI */}
          {requests.map((request) => (
            <motion.div
              key={request.id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {request.type === "received"
                  ? `${request.requester} wants to rent your ${request.equipment}`
                  : `Your request for ${request.equipment} from ${request.owner} is ${request.status}`}
              </h3>
              <p className="text-gray-600 mb-3">💰 Price: {request.price}</p>

              {/* If request is received and pending, show Accept/Reject */}
              {request.type === "received" && request.status === "pending" && (
                <div className="flex space-x-4">
                  <button
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition"
                    onClick={() => handleDecision(request.id, "accepted")}
                  >
                    <FaCheckCircle className="mr-2" /> Accept
                  </button>
                  <button
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-red-600 transition"
                    onClick={() => handleDecision(request.id, "rejected")}
                  >
                    <FaTimesCircle className="mr-2" /> Reject
                  </button>
                </div>
              )}

              {/* If request is sent and accepted, show Make Payment */}
              {request.type === "sent" && request.status === "accepted" && (
                <button className="w-full bg-blue-600 text-white py-2 mt-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition">
                  <FaMoneyBillWave className="mr-2" /> Make Payment
                </button>
              )}

              {/* If request was rejected */}
              {request.status === "rejected" && (
                <p className="text-red-500 mt-3 font-semibold">❌ Request Rejected</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
