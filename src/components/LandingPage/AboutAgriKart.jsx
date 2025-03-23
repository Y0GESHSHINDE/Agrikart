import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Upload,
  Users,
  CheckCircle,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "./Footer";

const steps = [
  {
    title: "Sign Up & Verify",
    description: "Create an account and verify your identity to start renting.",
    icon: <UserCheck className="w-8 h-8 text-purple-600" />,
  },
  {
    title: "Find Equipment",
    description: "Browse available farming tools and select what you need.",
    icon: <ShoppingCart className="w-8 h-8 text-green-600" />,
  },
  {
    title: "Book & Rent",
    description: "Choose the rental period and confirm your booking.",
    icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Receive Equipment",
    description: "Get the equipment delivered or pick it up from the owner.",
    icon: <Users className="w-8 h-8 text-yellow-600" />,
  },
];

const listSteps = [
  {
    title: "Sign Up & Verify",
    description: "Register and verify your identity to list your equipment.",
    icon: <UserCheck className="w-8 h-8 text-purple-600" />,
  },
  {
    title: "List Your Equipment",
    description: "Upload details of your farming tools for rent.",
    icon: <Upload className="w-8 h-8 text-red-600" />,
  },
  {
    title: "Get Rental Requests",
    description: "Receive requests from farmers looking for equipment.",
    icon: <Users className="w-8 h-8 text-green-600" />,
  },
  {
    title: "Earn Income",
    description: "Rent out your equipment and get paid.",
    icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
  },
];

const HowAgriKartWorks = () => {
  return (
    <>
      <Navbar />
      <div className="py-16 container mx-auto px-4 sm:px-6"
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          How AgriKart Works
        </h2>

        <div className="text-center">
          {/* Renting Equipment */}
          <div>
            <h3 className="text-2xl font-semibold text-green-700 mb-6">
              For Farmers Renting Equipment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.3 }}
                >
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Step {index + 1}
                  </div>
                  {step.icon}
                  <h4 className="text-lg font-semibold mt-4">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Listing Equipment */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-red-700 mb-6">
              For Farmers Listing Equipment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.3 }}
                >
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Step {index + 1}
                  </div>
                  {step.icon}
                  <h4 className="text-lg font-semibold mt-4">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HowAgriKartWorks;