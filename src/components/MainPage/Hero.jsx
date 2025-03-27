import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTools } from "react-icons/fa";
import { LuBrainCircuit } from "react-icons/lu";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { FaUserCog } from "react-icons/fa";
import { MdLiveHelp } from "react-icons/md";

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
    <div className="relative min-h-[600px] w-full lg:min-h-screen">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
        }}>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>
      </div>

      {/* Content Container */}
      <div className="container relative z-20 mx-auto flex h-full flex-col items-center justify-center px-4 py-10 text-white sm:py-16 md:py-24">
        {/* Heading with Highlight */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="mb-2 mt-2 text-3xl font-bold tracking-tight sm:mb-4 sm:text-4xl md:text-5xl lg:text-7xl">
            Empowering Fields with Perfect Tools
          </h1>
          <p className="mx-auto max-w-3xl text-base text-gray-200 sm:text-lg md:text-xl">
            Discover innovative farming solutions that increase yield, save
            time, and maximize your field's potential.
          </p>
        </div>

        {/* Search Field */}
        <div className="mb-8 w-full max-w-xl sm:mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for tools..."
              className="w-full rounded-full border border-white border-opacity-30 bg-white bg-opacity-20 px-4 py-3 pr-12 text-white placeholder-white placeholder-opacity-75 backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 sm:px-6 sm:py-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 transform rounded-full bg-green-500 p-1.5 text-white transition-all hover:bg-green-600 sm:p-2"
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
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg bg-white shadow-xl">
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
                            <div className="h-16 w-16 flex-shrink-0">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full rounded object-cover"
                              />
                            </div>
                            <div className="ml-3 flex-grow">
                              <h3 className="font-medium text-gray-900">
                                {product.name}
                              </h3>
                              <p className="line-clamp-1 text-sm text-gray-600">
                                {product.description}
                              </p>
                              <div className="mt-1 flex items-center justify-between">
                                <span className="font-medium text-green-600">
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
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:mt-4">
            <span
              className="cursor-pointer rounded-full border border-white border-opacity-30 bg-white bg-opacity-20 px-2 py-1 text-xs transition-all hover:bg-opacity-30 sm:px-3 sm:text-sm"
              onClick={() => {
                setSearchQuery("Agricultural Tools");
                searchProducts("Agricultural Tools");
              }}>
              Agricultural Tools
            </span>
            <span
              className="cursor-pointer rounded-full border border-white border-opacity-30 bg-white bg-opacity-20 px-2 py-1 text-xs transition-all hover:bg-opacity-30 sm:px-3 sm:text-sm"
              onClick={() => {
                setSearchQuery("Field Equipment");
                searchProducts("Field Equipment");
              }}>
              Field Equipment
            </span>
            <span
              className="cursor-pointer rounded-full border border-white border-opacity-30 bg-white bg-opacity-20 px-2 py-1 text-xs transition-all hover:bg-opacity-30 sm:px-3 sm:text-sm"
              onClick={() => {
                setSearchQuery("Irrigation");
                searchProducts("Irrigation");
              }}>
              Irrigation Systems
            </span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-2 grid w-full max-w-6xl grid-cols-1 gap-4 sm:mt-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      
          {/* Farm Tools Card */}
          <Link to="/listed-instruments" className="group rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 p-4 backdrop-blur-md transition-all hover:bg-opacity-20 sm:p-6">
            <div className="mb-3 inline-block rounded-lg bg-green-500 bg-opacity-80 p-2 sm:mb-4 sm:p-3">
              <FaTools className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl">
              Farm Tools
            </h3>
            <p className="mb-3 text-sm text-gray-300 sm:mb-4 sm:text-base">
              Explore advanced tools to improve efficiency and productivity in
              farming.
            </p>
            <span className="inline-flex items-center text-sm text-green-400 group-hover:text-green-300 sm:text-base">
              Explore
            </span>
          </Link>

          {/* Krishi AI Card */}
          <Link to="/krishi" className="group rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 p-4 backdrop-blur-md transition-all hover:bg-opacity-20 sm:p-6">
            <div className="mb-3 inline-block rounded-lg bg-blue-500 bg-opacity-80 p-2 sm:mb-4 sm:p-3">
              <LuBrainCircuit className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl">
              Krishi AI
            </h3>
            <p className="mb-3 text-sm text-gray-300 sm:mb-4 sm:text-base">
              AI-powered solutions to analyze crops and enhance farming
              techniques.
            </p>
            <span className="inline-flex items-center text-sm text-blue-400 group-hover:text-blue-300 sm:text-base">
              Discover
            </span>
          </Link>

          {/* Check Weather Card */}
          <Link to="/weather" className="group rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 p-4 backdrop-blur-md transition-all hover:bg-opacity-20 sm:p-6">
            <div className="mb-3 inline-block rounded-lg bg-cyan-500 bg-opacity-80 p-2 sm:mb-4 sm:p-3">
              <TiWeatherPartlySunny className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl">
              Check Weather
            </h3>
            <p className="mb-3 text-sm text-gray-300 sm:mb-4 sm:text-base">
              Get the latest weather updates for your farming needs.
            </p>
            <span className="inline-flex items-center text-sm text-cyan-400 group-hover:text-cyan-300 sm:text-base">
              Check Now
            </span>
          </Link>

          {/* Manage Instruments Card */}
          <Link to="/manage-instruments" className="group rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 p-4 backdrop-blur-md transition-all hover:bg-opacity-20 sm:p-6">
            <div className="mb-3 inline-block rounded-lg bg-purple-500 bg-opacity-80 p-2 sm:mb-4 sm:p-3">
              <FaScrewdriverWrench className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl">
              Manage Instruments
            </h3>
            <p className="mb-3 text-sm text-gray-300 sm:mb-4 sm:text-base">
              Keep track of all your rented and listed farming instruments.
            </p>
            <span className="inline-flex items-center text-sm text-purple-400 group-hover:text-purple-300 sm:text-base">
              Manage Now
            </span>
          </Link>

          {/* Manage Profile Card */}
          <Link to="/profile" className="group rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 p-4 backdrop-blur-md transition-all hover:bg-opacity-20 sm:p-6">
            <div className="mb-3 inline-block rounded-lg bg-yellow-500 bg-opacity-80 p-2 sm:mb-4 sm:p-3">
              <FaUserCog className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl">
              Manage Profile
            </h3>
            <p className="mb-3 text-sm text-gray-300 sm:mb-4 sm:text-base">
              Update your profile and preferences.
            </p>
            <span className="inline-flex items-center text-sm text-yellow-400 group-hover:text-yellow-300 sm:text-base">
              Edit Profile
            </span>
          </Link>

          {/* Help Center Card */}
          <Link to="/contact-us" className="group rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 p-4 backdrop-blur-md transition-all hover:bg-opacity-20 sm:p-6">
            <div className="mb-3 inline-block rounded-lg bg-red-500 bg-opacity-80 p-2 sm:mb-4 sm:p-3">
              <MdLiveHelp className="h-6 w-6 text-white sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl">
              Help Center
            </h3>
            <p className="mb-3 text-sm text-gray-300 sm:mb-4 sm:text-base">
              Get answers to your questions and support.
            </p>
            <span className="inline-flex items-center text-sm text-red-400 group-hover:text-red-300 sm:text-base">
              Get Help
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
