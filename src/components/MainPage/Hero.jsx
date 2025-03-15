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
    <div className="relative h-screen w-full">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-fit bg-center z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 z-10"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 py-16 md:py-24 text-white container mx-auto">
        {/* Heading with Highlight */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-2 mb-4">
            Empowering Fields with Perfect Tools
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            Discover innovative farming solutions that increase yield, save
            time, and maximize your field's potential.
          </p>
        </div>

        {/* Search Field */}
        <div className="w-full max-w-xl mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for tools..."
              className="w-full py-4 px-6 pr-12 rounded-full bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 text-white placeholder-white placeholder-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-all"
              onClick={() => searchProducts(searchQuery)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
                          className="border-b border-gray-200 last:border-none"
                        >
                          <Link
                            to={`/product/${product.id}`}
                            className="flex items-start p-3 hover:bg-gray-50"
                            onClick={() => {
                              setShowResults(false);
                              setSearchQuery("");
                            }}
                          >
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
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            <span
              className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm border border-white border-opacity-30 hover:bg-opacity-30 cursor-pointer transition-all"
              onClick={() => {
                setSearchQuery("Agricultural Tools");
                searchProducts("Agricultural Tools");
              }}
            >
              Agricultural Tools
            </span>
            <span
              className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm border border-white border-opacity-30 hover:bg-opacity-30 cursor-pointer transition-all"
              onClick={() => {
                setSearchQuery("Field Equipment");
                searchProducts("Field Equipment");
              }}
            >
              Field Equipment
            </span>
            <span
              className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm border border-white border-opacity-30 hover:bg-opacity-30 cursor-pointer transition-all"
              onClick={() => {
                setSearchQuery("Irrigation");
                searchProducts("Irrigation");
              }}
            >
              Irrigation Systems
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-4">
          {/* Card 1 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-green-500 bg-opacity-80 p-3 rounded-lg inline-block mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Farming</h3>
            <p className="text-gray-300 mb-4">
              IoT devices and AI solutions for modern agriculture.
            </p>
            <a
              href="#"
              className="text-green-400 group-hover:text-green-300 inline-flex items-center"
            >
              Explore
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-blue-500 bg-opacity-80 p-3 rounded-lg inline-block mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Organic Solutions</h3>
            <p className="text-gray-300 mb-4">
              Sustainable and eco-friendly farming equipment.
            </p>
            <a
              href="#"
              className="text-green-400 group-hover:text-green-300 inline-flex items-center"
            >
              Explore
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>

          {/* Card 3 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 hover:bg-opacity-20 transition-all border border-white border-opacity-20 group">
            <div className="bg-yellow-500 bg-opacity-80 p-3 rounded-lg inline-block mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Seasonal Specials</h3>
            <p className="text-gray-300 mb-4">
              Time-limited offers on seasonal equipment.
            </p>
            <a
              href="#"
              className="text-green-400 group-hover:text-green-300 inline-flex items-center"
            >
              Explore
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
