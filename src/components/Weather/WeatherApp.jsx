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
import { BiNews, BiLinkExternal } from "react-icons/bi"; // Add these icons
import Navbar from "../Navbar/Navbar";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const USER_API_URL = "https://main-backend-agrikart.vercel.app/api/users";
const NEWS_API_KEY = "dc10ce8012e74ad7b83c8bb783f2b20a"; // News API key

const WeatherApp = () => {
  const { user } = useUser(); // Get logged-in user from Clerk
  const userId = user?.id; // Extract user ID
  // console.log(userId);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  // Fetch user's default village when we get the userId
  useEffect(() => {
    if (!userId) return;

    const fetchUserVillage = async () => {
      try {
        const response = await axios.get(`${USER_API_URL}/${userId}`);
        console.log("User API Response:", response.data); // Debugging
        const userVillage = response.data?.data?.address?.village;
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

  // Function to fetch agriculture news
  const fetchAgricultureNews = async () => {
    setNewsLoading(true);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=agriculture+farming+crops&apiKey=${NEWS_API_KEY}&sortBy=publishedAt&pageSize=8&language=en`
      );

      // Filter articles to ensure they have all required fields
      const filteredArticles = response.data.articles.filter(
        (article) =>
          article.title &&
          article.description &&
          article.urlToImage &&
          article.url
      );

      setNews(filteredArticles);
    } catch (error) {
      console.error("Error fetching agriculture news:", error);
      setNews([]);
    }
    setNewsLoading(false);
  };

  // Fetch news when component mounts
  useEffect(() => {
    fetchAgricultureNews();
  }, []);

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

  // Helper function to get agricultural tips based on weather
  const getAgriTip = (temp, weatherType) => {
    if (temp > 35) {
      return "High temperature alert! Ensure crops have adequate water and consider providing shade for sensitive plants.";
    } else if (temp < 10) {
      return "Cold temperature alert! Protect sensitive crops from frost damage with covers.";
    }

    switch (weatherType) {
      case "Clear":
        return "Good conditions for outdoor activities. Consider pesticide application if needed.";
      case "Clouds":
        return "Moderate sunlight, good for most fieldwork. Check soil moisture for irrigation needs.";
      case "Rain":
        return "Postpone fertilizer application to prevent runoff. Check for proper drainage in fields.";
      case "Snow":
        return "Protect vulnerable plants. Snow provides insulation but check for branches that may break under weight.";
      case "Thunderstorm":
        return "Stay indoors. Secure farm equipment and livestock. Check for flooding after the storm.";
      default:
        return "Monitor your crops for any signs of stress and adjust irrigation as needed.";
    }
  };

  // Helper function to get background gradient based on weather
  const getWeatherBackground = (weatherType) => {
    switch (weatherType) {
      case "Clear":
        return "from-blue-100 to-yellow-50"; // Sunny sky gradient
      case "Clouds":
        return "from-gray-100 to-blue-50"; // Cloudy sky gradient
      case "Rain":
        return "from-blue-100 to-gray-200"; // Rainy sky gradient
      case "Snow":
        return "from-blue-50 to-gray-100"; // Snowy gradient
      case "Thunderstorm":
        return "from-purple-100 to-gray-200"; // Stormy gradient
      default:
        return "from-white to-blue-50"; // Default gradient
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

        <motion.h1 className="text-4xl text-green-600 mt-10 font-bold md:text-5xl mb-6 text-center relative z-10">
          Weather Forecast
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
            className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => fetchWeather(city)}
          >
            Get Weather
          </button>
        </div>

        {/* Weather Loading & Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="mt-6 bg-white/90 p-6 rounded-2xl shadow-lg w-full max-w-md text-center flex flex-col items-center border border-gray-300 relative z-10 mx-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse mb-4"></div>
                <div className="h-6 w-40 bg-gray-200 rounded-full animate-pulse mb-6"></div>

                <div className="h-8 w-56 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse mb-6"></div>

                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                  <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                <div className="h-10 w-full bg-blue-300 rounded-lg animate-pulse mt-6"></div>
              </div>
            </motion.div>
          ) : (
            weather && (
              <motion.div
                key="weather-content"
                className={`mt-6 bg-gradient-to-br ${getWeatherBackground(
                  weather.weather[0].main
                )} text-black p-6 rounded-2xl shadow-lg w-full max-w-md text-center flex flex-col items-center border border-gray-300 relative z-10 mx-4`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Weather content stays the same */}
                <div className="absolute top-4 right-4 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Updated: {new Date().toLocaleTimeString()}
                </div>

                <div className="flex items-center justify-center w-full">
                  <div className="text-center">
                    {getWeatherIcon(weather.weather[0].main)}
                    <p className="text-lg capitalize font-medium text-gray-700">
                      {weather.weather[0].description}
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-3 flex items-center gap-2">
                  {weather.name}, {weather.sys.country}
                </h2>

                <div className="flex items-baseline mt-2">
                  <h3 className="text-5xl font-bold">
                    {Math.round(weather.main.temp)}°C
                  </h3>
                  <span className="text-gray-500 ml-2">
                    Feels like {Math.round(weather.main.feels_like)}°C
                  </span>
                </div>

                {/* Current Weather Highlights */}
                <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="flex items-center justify-center gap-2 text-blue-700">
                      <FaTint className="text-blue-500" /> Humidity
                    </p>
                    <p className="text-xl font-semibold">
                      {weather.main.humidity}%
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="flex items-center justify-center gap-2 text-blue-700">
                      <FaWind className="text-gray-600" /> Wind
                    </p>
                    <p className="text-xl font-semibold">
                      {weather.wind.speed} m/s
                    </p>
                  </div>
                </div>

                {/* Expandable Details */}
                <button
                  className="mt-6 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition w-full justify-center"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide Details" : "More Info"}
                  {showDetails ? <FaArrowUp /> : <FaArrowDown />}
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden w-full mt-4"
                    >
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-blue-700">Pressure</p>
                          <p className="text-lg font-semibold">
                            {weather.main.pressure} hPa
                          </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-blue-700">Visibility</p>
                          <p className="text-lg font-semibold">
                            {(weather.visibility / 1000).toFixed(1)} km
                          </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg flex flex-col">
                          <p className="text-blue-700">Sunrise</p>
                          <p className="text-lg font-semibold">
                            {new Date(
                              weather.sys.sunrise * 1000
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg flex flex-col">
                          <p className="text-blue-700">Sunset</p>
                          <p className="text-lg font-semibold">
                            {new Date(
                              weather.sys.sunset * 1000
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg flex flex-col">
                          <p className="text-blue-700 flex items-center justify-center gap-1">
                            <FaArrowDown className="text-blue-600" /> Min
                          </p>
                          <p className="text-lg font-semibold">
                            {Math.round(weather.main.temp_min)}°C
                          </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg flex flex-col">
                          <p className="text-blue-700 flex items-center justify-center gap-1">
                            <FaArrowUp className="text-red-500" /> Max
                          </p>
                          <p className="text-lg font-semibold">
                            {Math.round(weather.main.temp_max)}°C
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-700 mb-1">Agricultural Tip</p>
                        <p className="text-sm">
                          {getAgriTip(
                            weather.main.temp,
                            weather.weather[0].main
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Agriculture News Section */}
        <motion.div
          className="w-full max-w-6xl mt-10 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-green-500 flex items-center gap-2">
              <BiNews className="text-4xl" /> Agricultural News
            </h2>

            {newsLoading && (
              <div className="bg-green-600/80 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                Updating news...
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {newsLoading ? (
              <motion.div
                key="news-loading"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div
                    key={index}
                    className="bg-white/95 rounded-xl overflow-hidden shadow-md flex flex-col h-full transition-all duration-300"
                  >
                    {/* Image Skeleton */}
                    <div className="relative aspect-[16/10] bg-gray-200 animate-pulse">
                      <div className="absolute top-3 left-3 bg-gray-300 h-5 w-20 rounded-md"></div>
                      <div className="absolute bottom-3 right-3 bg-gray-300 h-5 w-16 rounded-md"></div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50">
                      <div className="h-6 bg-gray-200 rounded-md animate-pulse mb-3 w-full"></div>
                      <div className="h-4 bg-gray-200 rounded-md animate-pulse mb-2 w-full"></div>
                      <div className="h-4 bg-gray-200 rounded-md animate-pulse mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded-md animate-pulse mb-4 w-5/6"></div>

                      <div className="mt-auto h-10 bg-green-200 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : news.length > 0 ? (
              <motion.div
                key="news-content"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {news.map((article, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/95 rounded-xl overflow-hidden shadow-md hover:shadow-xl flex flex-col h-full transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{
                      y: -3,
                      boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    {/* Existing article content */}
                    {/* Image Container with Gradient Overlay */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1574943320219-5c76c6854cf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>

                      {/* Source Badge */}
                      <div className="absolute top-3 left-3 bg-green-600/90 text-white text-xs px-2 py-1 rounded-md font-medium">
                        {article.source?.name || "Agricultural News"}
                      </div>

                      {/* Date Badge */}
                      <div className="absolute bottom-3 right-3 bg-white/90 text-green-800 text-xs px-2 py-1 rounded-md font-bold">
                        {new Date(article.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50">
                      {/* Title with Subtle Underline */}
                      <h3 className="font-bold text-lg mb-3 text-gray-800 line-clamp-2 pb-2 border-b border-gray-100">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.description}
                      </p>

                      {/* Read Button */}
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto group"
                      >
                        <span className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium transition-all hover:from-green-700 hover:to-green-800 shadow-sm">
                          Read Article
                          <BiLinkExternal className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-news"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 rounded-lg p-8 text-center shadow-lg border border-gray-100"
              >
                {/* Your existing no-news content */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-700 text-lg">
                  No agriculture news available at the moment.
                </p>
                <button
                  onClick={fetchAgricultureNews}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default WeatherApp;
