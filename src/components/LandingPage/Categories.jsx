import React from "react";
import { motion } from "framer-motion";
import {
  Tractor,
  Wheat,
  Sprout,
  Combine,
  Droplets,
  Wrench,
} from "lucide-react";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, useClerk } from "@clerk/clerk-react";

const categories = [
  {
    icon: Tractor,
    name: "Tractors",
    description: "Essential for plowing, tilling, planting, and hauling.",
    popular: ["Farm Tractors", "Compact Tractors", "Utility Tractors"],
  },
  {
    icon: Wheat,
    name: "Plows",
    description: "Used to break and turn the soil before planting crops.",
    popular: ["Moldboard Plows", "Disc Plows", "Chisel Plows"],
  },
  {
    icon: Sprout,
    name: "Seed Drills",
    description: "Ensures uniform seed distribution and better crop yield.",
    popular: ["No-Till Drills", "Conventional Drills", "Air Seeders"],
  },
  {
    icon: Combine,
    name: "Cultivators",
    description: "Helps in soil preparation by loosening and aerating the soil.",
    popular: ["Field Cultivators", "Row Cultivators", "Inter-row Cultivators"],
  },
  {
    icon: Droplets,
    name: "Sprayers",
    description: "Used for applying pesticides, herbicides, and fertilizers.",
    popular: ["Boom Sprayers", "Backpack Sprayers", "Mounted Sprayers"],
  },
  {
    icon: Wrench,
    name: "Combine Harvesters",
    description: "Used for harvesting, threshing, and cleaning crops like wheat, rice, and corn.",
    popular: ["Self-Propelled Combines", "Pull-Type Combines", "Rice Combines"],
  },
];

const Categories = () => {
  const navigate = useNavigate();
  const { openSignIn } = useClerk();

  const handleShowInstruments = (category) => {
    navigate(`/Listed-instruments?category=${category}`);
  };

  const handleSignIn = (category) => {
    openSignIn({
      afterSignInUrl: `/Listed-instruments?category=${category}`,
      redirectUrl: `/Listed-instruments?category=${category}`,
    });
  };

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <h2 className="mb-4 text-center text-4xl font-extrabold text-gray-900">
          Explore Our Equipment Categories
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-gray-600">
          From land preparation to harvesting, find the right tools for every
          farming need.
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}>
              {/* Icon & Title */}
              <div className="mb-4 flex items-center space-x-4">
                <div className="rounded-xl bg-gray-100 p-3">
                  <category.icon className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {category.name}
                </h3>
              </div>

              {/* Description */}
              <p className="mb-4 leading-relaxed text-gray-600">
                {category.description}
              </p>

              {/* Popular Equipment List */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-500">
                  Popular Equipment:
                </h4>
                <ul className="space-y-1">
                  {category.popular.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 transition-colors duration-200 hover:text-green-600">
                      {<GoDotFill />} {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Show Instrument Button */}
              <div className="mt-6">
                <SignedIn>
                  <button
                    className="w-full rounded-lg bg-green-700 px-4 py-2 text-[12px] font-semibold text-white transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 md:text-[15px]"
                    onClick={() => handleShowInstruments(category.name)}>
                    Browse {category.name}
                  </button>
                </SignedIn>
                <SignedOut>
                  <button 
                    onClick={() => handleSignIn(category.name)}
                    className="w-full rounded-lg bg-green-700 px-4 py-2 text-[12px] font-semibold text-white transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 2xl:text-[15px]">
                    Browse {category.name}
                  </button>
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
