import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import { FaWind, FaTint, FaArrowDown, FaArrowUp } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const USER_API_URL = "https://main-backend-agrikart.vercel.app/api/users";

const WeatherApp = () => {
  const { user } = useUser(); // Get logged-in user from Clerk
  const userId = user?.id; // Extract user ID
  // console.log(userId);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch user's default village when we get the userId
  useEffect(() => {
    if (!userId) return;
  
    const fetchUserVillage = async () => {
      try {
        const response = await axios.get(`${USER_API_URL}/${userId}`);
        console.log("User API Response:", response.data); // Debugging
        const userVillage = response.data?.data?.address?.village ;
        console.log("User Village:", userVillage);
        if (userVillage) {
          setCity(userVillage);
          fetchWeather(userVillage);
        }
      } catch (error) {
        console.error("Error fetching user village:", error);
      }
    };
  
    fetchUserVillage();
  }, [userId]);
  

  // Fetch Weather Data
  const fetchWeather = async (location) => {
    if (!location) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather(null);
    }
    setLoading(false);
  };

  // Get Weather Icon
  const getWeatherIcon = (weatherType) => {
    switch (weatherType) {
      case "Clear":
        return <WiDaySunny className="text-yellow-500 text-6xl" />;
      case "Clouds":
        return <WiCloud className="text-gray-400 text-6xl" />;
      case "Rain":
        return <WiRain className="text-blue-500 text-6xl" />;
      case "Snow":
        return <WiSnow className="text-blue-300 text-6xl" />;
      case "Thunderstorm":
        return <WiThunderstorm className="text-purple-600 text-6xl" />;
      default:
        return <WiCloud className="text-gray-400 text-6xl" />;
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="flex flex-col items-center min-h-screen bg-cover bg-center relative text-white p-6"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1614790905937-721c77a3e189?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <motion.h1
          className="text-4xl text-green-300 mt-10 font-bold md:text-5xl mb-6 text-center relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          AgriKart
          <div className="text-2xl text-white mt-1 font-normal">
            Weather Forecast
          </div>
        </motion.h1>

        {/* Input & Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <input
            type="text"
            placeholder="Enter city or village..."
            className="p-3 rounded-lg text-black border border-gray-300 outline-none w-64 sm:w-80"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => fetchWeather(city)}
          >
            Get Weather
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="mt-4 text-lg animate-pulse relative z-10">
            Fetching weather data...
          </p>
        )}

        {/* Weather Info */}
        {weather && (
          <motion.div
            className="mt-6 bg-white text-black p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-md text-center flex flex-col items-center border border-gray-300 relative z-10 mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {getWeatherIcon(weather.weather[0].main)}

            <h2 className="text-2xl font-bold mt-3">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-lg capitalize">
              {weather.weather[0].description}
            </p>
            <h3 className="text-5xl font-bold mt-2">{weather.main.temp}°C</h3>

            {/* Humidity & Wind Speed */}
            <div className="flex justify-between mt-4 w-full px-6">
              <p className="flex items-center gap-2">
                <FaTint className="text-blue-500" /> Humidity:{" "}
                {weather.main.humidity}%
              </p>
              <p className="flex items-center gap-2">
                <FaWind className="text-gray-600" /> Wind Speed:{" "}
                {weather.wind.speed} m/s
              </p>
            </div>

            {/* More Info Toggle Button */}
            <button
              className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "More Info"}
              {showDetails ? <FaArrowUp /> : <FaArrowDown />}
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default WeatherApp;
