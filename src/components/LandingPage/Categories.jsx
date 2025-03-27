import React from "react";
import { motion } from "framer-motion";
import {
  Tractor,
  Wheat,
  Sprout,
  Combine,
  Warehouse,
  Wrench,
} from "lucide-react";
import { GoDotFill } from "react-icons/go";

import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const categories = [
  {
    icon: Tractor,
    name: "Tractors & Implements",
    description:
      "Powerful tractors and versatile attachments for all farm operations.",
    popular: ["Compact Tractors", "Row Crop Tractors", "Specialty Tractors"],
  },
  {
    icon: Wheat,
    name: "Harvesting Equipment",
    description:
      "Efficient harvesting solutions to maximize your yield and reduce loss.",
    popular: ["Combines", "Forage Harvesters", "Grain Headers"],
  },
  {
    icon: Sprout,
    name: "Planting & Seeding",
    description:
      "Precision tools to ensure high germination rates and even crop distribution.",
    popular: ["Seed Drills", "Planters", "Fertilizer Spreaders"],
  },
  {
    icon: Combine,
    name: "Tillage Equipment",
    description: "Advanced tillage tools for soil health and preparation.",
    popular: ["Plows", "Cultivators", "Disc Harrows"],
  },
  {
    icon: Warehouse,
    name: "Storage & Handling",
    description: "Reliable equipment for secure storage and smooth handling.",
    popular: ["Grain Augers", "Storage Bins", "Conveyors"],
  },
  {
    icon: Wrench,
    name: "Maintenance Tools",
    description:
      "Keep your farming equipment in top condition with essential tools.",
    popular: ["Diagnostic Tools", "Repair Kits", "Cleaning Equipment"],
  },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleShowInstruments = (categoryName) => {
    // Redirect to login page if the user is not signed in
    navigate("/login"); // Replace "/login" with your actual login route
  };

  return (
    <div className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
          Explore Our Equipment Categories
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          From land preparation to harvesting, find the right tools for every
          farming need.
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}>
              {/* Icon & Title */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <category.icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {category.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-4">
                {category.description}
              </p>

              {/* Popular Equipment List */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">
                  Popular Equipment:
                </h4>
                <ul className="space-y-1">
                  {category.popular.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors duration-200 cursor-pointer">
                      {<GoDotFill  />} {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Show Instrument Button */}
              <div className="mt-6">
                <SignedIn>
                  <button
                    className="w-full bg-green-700  text-[12px] md:text-[15px] font-semibold text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={() => handleShowInstruments(category.name)}>
                    Browse {category.name}
                  </button>
                </SignedIn>
                <SignedOut>

                  <SignInButton
                    afterSignInUrl="/Listed-instruments" // Redirect to home or a specific page after login
                    afterSignUpUrl="/Listed-instruments" // Redirect to home or a specific page after signup
                    
                  >
                    <button className="w-full bg-green-700  text-[12px] 2xl:text-[15px] font-semibold  text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" onClick={() => navigate("/Listed-instruments")} >
                      Browse {category.name}
                    </button>
                  </SignInButton>
                  
                </SignedOut>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
