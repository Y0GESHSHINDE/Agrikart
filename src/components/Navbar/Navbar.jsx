import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Search, Menu, Tractor } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

const Navbar = () => {
  // State for managing mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border border-gray-200">
      <div className="mx-auto">
        {/* Main Navbar */}
        <div className="container mx-auto px-4 py-3 ">
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
                <Search
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
              {/* Authentication Buttons - Show only when signed out */}
              <SignedOut>
                <SignInButton>
                  <button className="text-sm px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              {/* User Profile Button - Show only when signed in */}
              <SignedIn>
                <Link
                  to="/profile"
                  className="text-sm px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                >
                  My Profile
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

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

              {/* Mobile authentication controls */}
              <SignedOut>
                <SignInButton>
                  <button className="block w-full text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="block w-full text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <Link
                  to="/profile"
                  className="text-sm px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                >
                  My Profile
                </Link>
                <div className="flex items-center justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
