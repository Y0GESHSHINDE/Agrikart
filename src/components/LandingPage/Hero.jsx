import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import '../../../public/fonts/fonts.css'

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6  text-center text-white">
        <motion.h1
          className="text-3xl md:text-7xl font-extrabold   leading-tight mb-4 "
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Revolutionizing Farming{" "}
          <div className="text-amber-500 text-2xl md:text-5xl md:mt-3  ">Rent Smart, Farm Smarter!</div>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200  max-w-3xl mx-auto mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Find the right farming equipment at the best price, delivered to your
          farm!
        </motion.p>

        {/* Search Bar */}
        <motion.div
          className="relative max-w-lg mx-auto mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Search by Equipment Name or Location"
            className="w-full py-3 pl-5 pr-12 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
          />
          <Search className="absolute right-4 top-3 text-gray-500" size={22} />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {/* If user is signed in → Redirect to product page */}
          <SignedIn>
            <button
              onClick={() => navigate("/product-listing")}
              className="bg-orange-400  px-6 py-3 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-lg"
            >
              🚜 Browse Equipment
            </button>
            <button
              onClick={() => navigate("/seasonal-deals")}
              className="bg-white text-green-700 hover:bg-gray-200 px-6 py-3 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-lg"
            >
              🌾 Seasonal Offers
            </button>
          </SignedIn>

          {/* If user is NOT signed in → Redirect to Sign-In Page */}
          <SignedOut>
            <SignInButton>
              <button className="bg-orange-400 hover:bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-lg">
                🚜 Browse Equipment
              </button>
            </SignInButton>
            <SignInButton>
              <button className="bg-white text-green-700 hover:bg-gray-200 px-6 py-3 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-lg">
                🌾 Seasonal Offers
              </button>
            </SignInButton>
          </SignedOut>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
