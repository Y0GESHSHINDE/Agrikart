import React from "react";
import { Search, Menu, Phone, MapPin, User, Tractor } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="mx-auto">
        {/* Top Bar */}
        <div className="bg-green-600 text-white py-3">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Phone size={18} />
              <span className="font-semibold">1-800-FARM-PRO</span>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin size={18} />
              <span>Find Local Branch</span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-2xl font-bold text-green-700">
                <Tractor size={32} />
                <span>FARM RENTAL PRO</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
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
                  className="pl-4 pr-10 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
              <button className="md:hidden">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
