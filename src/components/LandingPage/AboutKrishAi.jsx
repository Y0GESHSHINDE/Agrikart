import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GiFarmTractor } from "react-icons/gi";
import { WiDaySunny } from "react-icons/wi";
import { RiPlantLine } from "react-icons/ri";
import { AiOutlineBarChart } from "react-icons/ai";
import Navbar from "../Navbar/Navbar"; // Import Navbar component

const AboutKrishAi = () => {
  const [isImageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src =
      "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative w-full min-h-screen flex flex-col justify-center items-center text-center text-white px-6"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        
        {isImageLoaded && (
          <>
            <motion.h1
              className="text-6xl text-amber-500 font-bold mb-5 mt-20"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}>
              Krishi
              <div className=" text-2xl md:text-3xl text-black mt-2 font-normal">
                Smart Farming for a Smarter Future
              </div>
            </motion.h1>

            <motion.p
              className="text-lg max-w-2xl mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}>
              Experience the power of AI in modern farming. Enhance productivity,
              optimize resources, and grow smarter with Krishi AI.
            </motion.p>

            {/* CTA Button */}
            <motion.a
              href="#"
              className="bg-green-500 hover:bg-green-700  text-white font-bold px-6 py-3 rounded-full text-sm md:text-lg shadow-lg inline-block"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}>
              Get Started with Krishi AI 🚜
            </motion.a>
          </>
        )}
      </div>
    </>
  );
};

export default AboutKrishAi;
