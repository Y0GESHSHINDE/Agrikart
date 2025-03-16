import React from "react";
import { motion } from "framer-motion";
import { Tractor, Wheat, Sprout, Combine, Warehouse, Wrench } from "lucide-react";

const categories = [
  {
    icon: Tractor,
    name: "Tractors & Implements",
    description: "Powerful tractors and versatile attachments for all farm operations.",
    popular: ["Compact Tractors", "Row Crop Tractors", "Specialty Tractors"],
  },
  {
    icon: Wheat,
    name: "Harvesting Equipment",
    description: "Efficient harvesting solutions to maximize your yield and reduce loss.",
    popular: ["Combines", "Forage Harvesters", "Grain Headers"],
  },
  {
    icon: Sprout,
    name: "Planting & Seeding",
    description: "Precision tools to ensure high germination rates and even crop distribution.",
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
    description: "Keep your farming equipment in top condition with essential tools.",
    popular: ["Diagnostic Tools", "Repair Kits", "Cleaning Equipment"],
  },
];

const Categories = () => {
  return (
    <div className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
          Explore Our Equipment Categories
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          From land preparation to harvesting, find the right tools for every farming need.
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 hover:shadow-xl transition duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              {/* Icon & Title */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gray-200 p-3 rounded-xl">
                  <category.icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">{category.name}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-4">{category.description}</p>

              {/* Popular Equipment List */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Popular Equipment:</h4>
                <ul className="space-y-1">
                  {category.popular.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 hover:text-green-600 cursor-pointer">
                      ✅ {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
