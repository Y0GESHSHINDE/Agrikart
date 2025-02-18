import React, { useState } from "react";
import { Search, Menu, Phone, MapPin, User, Tractor } from "lucide-react";

const Navbar = () => {
  // State for managing mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="mx-auto">
        {/* Main Navbar */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-2xl font-bold text-green-700">
                <Tractor size={32} />
                <span>AGRICART</span>
              </div>
              <div className="hidden md:flex items-center space-x-6 md:text-[12px] lg:text-[14px]">
                <a href="#" className="text-gray-700 hover:text-green-600">
                  Equipment
                </a>
                <a href="#" className="text-gray-700 hover:text-green-600">
                  Seasonal
                </a>
                <a href="#" className="text-gray-700 hover:text-green-600">
                  Services
                </a>
                <a href="#" className="text-gray-700 hover:text-green-600">
                  Solutions
                </a>
                <a href="#" className="text-gray-700 hover:text-green-600">
                  Training
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search farming equipment..."
                  className="pl-4 pr-10 py-2 border rounded-lg md:w-40 lg:w-60 xl:w-72 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button className="md:hidden" onClick={toggleMobileMenu}>
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-4">
              <a href="#" className="block text-gray-700 hover:text-green-600">
                Equipment
              </a>
              <a href="#" className="block text-gray-700 hover:text-green-600">
                Seasonal
              </a>
              <a href="#" className="block text-gray-700 hover:text-green-600">
                Services
              </a>
              <a href="#" className="block text-gray-700 hover:text-green-600">
                Solutions
              </a>
              <a href="#" className="block text-gray-700 hover:text-green-600">
                Training
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
