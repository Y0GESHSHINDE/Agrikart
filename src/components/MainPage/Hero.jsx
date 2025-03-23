import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Sample product data array
  const productData = [
    {
      id: 1,
      name: "Tractor Attachment Set",
      description:
        "Multi-purpose tractor attachments for various farming needs",
      price: 25000,
      imageUrl:
        "https://images.unsplash.com/photo-1621747136054-a765084318d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 2,
      name: "Irrigation Sprinkler System",
      description:
        "Efficient water distribution system for crops with adjustable spray patterns",
      price: 8500,
      imageUrl:
        "https://images.unsplash.com/photo-1586800769602-0ef7aaa50670?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 3,
      name: "Harvesting Combine",
      description: "Advanced harvesting machine for multiple crop types",
      price: 120000,
      imageUrl:
        "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 4,
      name: "Soil Testing Kit",
      description: "Complete kit for analyzing soil nutrients and pH levels",
      price: 3200,
      imageUrl:
        "https://images.unsplash.com/photo-1612094497466-c0e501eb0ada?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 5,
      name: "Pesticide Sprayer",
      description:
        "Battery-operated backpack sprayer for efficient pest control",
      price: 4500,
      imageUrl:
        "https://images.unsplash.com/photo-1610348725531-843dff563e2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80",
    },
  ];

  // Function to search products from array
  const searchProducts = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const filteredResults = productData.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredResults.slice(0, 3)); // Get first 3 results only
      setLoading(false);
    }, 300);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) searchProducts(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="relative min-h-[600px] lg:min-h-screen w-full">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 z-10"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 py-10 sm:py-16 md:py-24 text-white container mx-auto">
        {/* Heading with Highlight */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mt-2 mb-2 sm:mb-4">
            Empowering Fields with Perfect Tools
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            Discover innovative farming solutions that increase yield, save
            time, and maximize your field's potential.
          </p>
        </div>

        {/* Search Field */}
        <div className="w-full max-w-xl mb-8 sm:mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for tools..."
              className="w-full py-3 sm:py-4 px-4 sm:px-6 pr-12 rounded-full bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-1.5 sm:p-2 hover:bg-green-600 transition-all"
              onClick={() => searchProducts(searchQuery)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Search Results Dropdown */}
            {showResults &&
              searchQuery &&
              (searchResults.length > 0 || loading) && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-xl overflow-hidden z-50">
                  {loading ? (
                    <div className="p-4 text-center text-gray-600">
                      Loading...
                    </div>
                  ) : (
                    <div>
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className="border-b border-gray-200 last:border-none">
                          <Link
                            to={`/product/${product.id}`}
                            className="flex items-start p-3 hover:bg-gray-50"
                            onClick={() => {
                              setShowResults(false);
                              setSearchQuery("");
                            }}>
                            <div className="w-16 h-16 flex-shrink-0">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="ml-3 flex-grow">
                              <h3 className="font-medium text-gray-900">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {product.description}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-green-600 font-medium">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                <span className="text-xs text-blue-600">
                                  View Product
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Search Tags */}
          <div className="flex flex-wrap justify-center mt-3 sm:mt-4 gap-2">
            <span
              className="bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-white border-opacity-30 hover:bg-opacity-30 cursor-pointer transition-all"
              onClick={() => {
                setSearchQuery("Agricultural Tools");
                searchProducts("Agricultural Tools");
              }}>
              Agricultural Tools
            </span>
            <span
              className="bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-white border-opacity-30 hover:bg-opacity-30 cursor-pointer transition-all"
              onClick={() => {
                setSearchQuery("Field Equipment");
                searchProducts("Field Equipment");
              }}>
              Field Equipment
            </span>
            <span
              className="bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-white border-opacity-30 hover:bg-opacity-30 cursor-pointer transition-all"
              onClick={() => {
                setSearchQuery("Irrigation");
                searchProducts("Irrigation");
              }}>
              Irrigation Systems
            </span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl mt-2 sm:mt-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 sm:p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-green-500 bg-opacity-80 p-2 sm:p-3 rounded-lg inline-block mb-3 sm:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Smart Farming
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              IoT devices and AI solutions for modern agriculture.
            </p>
            <a
              href="#"
              className="text-green-400 group-hover:text-green-300 inline-flex items-center text-sm sm:text-base">
              Explore
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>

          {/* Card 2 - Add this card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 sm:p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-blue-500 bg-opacity-80 p-2 sm:p-3 rounded-lg inline-block mb-3 sm:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Precision Tools
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              Equipment designed for accuracy and efficiency in farming.
            </p>
            <a
              href="#"
              className="text-blue-400 group-hover:text-blue-300 inline-flex items-center text-sm sm:text-base">
              Discover
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>

          {/* Card 3 - Add this card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 sm:p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-amber-500 bg-opacity-80 p-2 sm:p-3 rounded-lg inline-block mb-3 sm:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Sustainable Farming
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              Eco-friendly solutions for responsible agricultural practices.
            </p>
            <a
              href="#"
              className="text-amber-400 group-hover:text-amber-300 inline-flex items-center text-sm sm:text-base">
              Learn More
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
          {/* Farm Tools Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 sm:p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-green-500 bg-opacity-80 p-2 sm:p-3 rounded-lg inline-block mb-3 sm:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11M9 21V3m6 18V3m6 7H10"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Farm Tools
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              Explore advanced tools to improve efficiency and productivity in
              farming.
            </p>
            <Link
              to="/listed-instruments"
              className="text-green-400 group-hover:text-green-300 inline-flex items-center text-sm sm:text-base">
              Explore
            </Link>
          </div>

          {/* Krishi AI Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 sm:p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-blue-500 bg-opacity-80 p-2 sm:p-3 rounded-lg inline-block mb-3 sm:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16V6a1 1 0 00-2 0v10a1 1 0 102 0zm-7-2a1 1 0 011-1h8a1 1 0 110 2H7a1 1 0 01-1-1zM5 12h14m-7-9v4"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Krishi AI
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              AI-powered solutions to analyze crops and enhance farming
              techniques.
            </p>
            <Link
              to="/krishi"
              className="text-blue-400 group-hover:text-blue-300 inline-flex items-center text-sm sm:text-base">
              Discover
            </Link>
          </div>

          {/* Check Weather Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 sm:p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-cyan-500 bg-opacity-80 p-2 sm:p-3 rounded-lg inline-block mb-3 sm:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12h16M12 4v16"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Check Weather
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              Get the latest weather updates for your farming needs.
            </p>
            <Link
              to="/weather"
              className="text-cyan-400 group-hover:text-cyan-300 inline-flex items-center text-sm sm:text-base">
              Check Now
            </Link>
          </div>

          {/* Manage Instruments Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 sm:p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-purple-500 bg-opacity-80 p-2 sm:p-3 rounded-lg inline-block mb-3 sm:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Manage Instruments
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              Keep track of all your rented and listed farming instruments.
            </p>
            <Link
              to="/manage-instruments"
              className="text-purple-400 group-hover:text-purple-300 inline-flex items-center text-sm sm:text-base">
              Manage Now
            </Link>
          </div>

          {/* Manage Profile Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 sm:p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-yellow-500 bg-opacity-80 p-2 sm:p-3 rounded-lg inline-block mb-3 sm:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M12 5v14"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Manage Profile
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              Update your profile and preferences.
            </p>
            <Link
              to="/profile"
              className="text-yellow-400 group-hover:text-yellow-300 inline-flex items-center text-sm sm:text-base">
              Edit Profile
            </Link>
          </div>

          {/* Help Center Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 sm:p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-red-500 bg-opacity-80 p-2 sm:p-3 rounded-lg inline-block mb-3 sm:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-3 3v-6m-7 6h14m-7-7V5m0 14v-4"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
              Help Center
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              Get answers to your questions and support.
            </p>
            <Link
              to="/contact-us"
              className="text-red-400 group-hover:text-red-300 inline-flex items-center text-sm sm:text-base">
              Get Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
