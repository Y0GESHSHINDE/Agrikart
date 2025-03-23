import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GiFarmTractor } from "react-icons/gi";
import { WiDaySunny } from "react-icons/wi";
import { RiPlantLine } from "react-icons/ri";
import { AiOutlineBarChart } from "react-icons/ai";
import Navbar from "../Navbar/Navbar"; // Import Navbar component
import Footer from "./Footer";
import krishiLogo from "../../../public/images/Krishi.png";

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
        className="relative w-full min-h-screen flex flex-col justify-center items-center text-center  text-white px-4 sm:px-6"
        style={{
          backgroundImage: `url('https://cdn.pixabay.com/photo/2018/07/09/18/40/nature-3526840_1280.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        {isImageLoaded && (
          <>
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}>
              <img src= {krishiLogo} alt="Krishi Logo" className="w-52 lg:-mt-8" />
              <h1 className="text-5xl sm:text-6xl text-white -mt-14 font-bold">
                Krishi
              </h1>
              <div className="text-lg sm:text-3xl text-white mt-2 font-normal">
                Smart Farming for a Smarter Future
              </div>
            </motion.div>

            {/* <motion.p
              className="text-base sm:text-lg text-white font-bold p-2 rounded-lg  max-w-2xl mb-6 px-4 sm:px-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}>
              Experience the power of AI in modern farming. Enhance
              productivity, optimize resources, and grow smarter with Krishi AI.
            </motion.p> */}

            {/* CTA Button */}
            <motion.a
              href="#"
              className="bg-amber-500 hover:bg-green-700 mt-4 text-white font-bold px-5 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg shadow-lg inline-block"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}>
              Get Started with Krishi AI 🚜
            </motion.a>
          </>
        )}

        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 mt-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-black lg:text-white mb-10">
            Key Features of Krishi AI
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <GiFarmTractor className="text-green-600 text-6xl mb-4" />
                ),
                title: "RAG-Based Chatbot",
                text: "AI-powered chatbot for real-time farming insights and support.",
              },
              {
                icon: (
                  <AiOutlineBarChart className="text-blue-600 text-6xl mb-4" />
                ),
                title: "Gemini Flash AI",
                text: "Fast and efficient AI responses tailored for farmers.",
              },
              {
                icon: <RiPlantLine className="text-yellow-600 text-6xl mb-4" />,
                title: "Personalized Support",
                text: "Custom farming solutions based on farmer’s location and crops.",
              },
              {
                icon: <WiDaySunny className="text-orange-600 text-6xl mb-4" />,
                title: "Weather Forecast Alerts",
                text: "Stay updated with real-time weather alerts for better planning.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center h-[250px] sm:h-[260px] mb-5 flex-grow"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}>
                {feature.icon}
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutKrishAi;
