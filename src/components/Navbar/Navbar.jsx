import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, Tractor, X } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle Sidebar Menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border border-gray-200">
      <div className="mx-auto">
        {/* Main Navbar */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 text-2xl font-bold text-green-700">
              <Tractor size={32} />
              <span>AGRICART</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 text-[14px]">
              <Link to="#" className="text-gray-700 hover:text-green-600">
                Equipment
              </Link>
              <Link to="#" className="text-gray-700 hover:text-green-600">
                Seasonal
              </Link>
              <Link to="#" className="text-gray-700 hover:text-green-600">
                Services
              </Link>
              <Link to="#" className="text-gray-700 hover:text-green-600">
                Solutions
              </Link>
              <Link to="#" className="text-gray-700 hover:text-green-600">
                Training
              </Link>
            </div>

            {/* Search & Authentication */}
            <div className="flex items-center space-x-4">
              {/* Search Bar (Hidden on Mobile) */}
              <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search farming equipment..."
                  className="pl-4 pr-10 py-2 border rounded-lg md:w-40 lg:w-60 xl:w-72 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>

              {/* Authentication Buttons */}
              <SignedOut>
                <SignInButton>
                  <button className="hidden lg:block text-sm px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="hidden lg:block text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              {/* User Profile (Desktop) */}
              <SignedIn>
                <Link
                  to="/profile"
                  className="hidden lg:block text-sm px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  My Profile
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              {/* Mobile Menu Button (☰ Stays on Right) */}
              <button className="lg:hidden" onClick={toggleMobileMenu}>
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Mobile Menu (Slide-in from Left) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        {/* Sidebar Header with Logo & Close Button */}
        <div className="p-4 flex justify-between items-center border-b border-gray-300">
          {/* Logo inside Sidebar */}
          <div className="flex items-center space-x-2 text-xl font-bold text-green-700">
            <Tractor size={28} />
            <span>AGRICART</span>
          </div>

          {/* Close Button */}
          <button onClick={toggleMobileMenu}>
            <X size={24} />
          </button>
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col space-y-4 p-6 text-lg">
          <Link to="#" className="text-gray-700 hover:text-green-600">
            Equipment
          </Link>
          <Link to="#" className="text-gray-700 hover:text-green-600">
            Seasonal
          </Link>
          <Link to="#" className="text-gray-700 hover:text-green-600">
            Services
          </Link>
          <Link to="#" className="text-gray-700 hover:text-green-600">
            Solutions
          </Link>
          <Link to="#" className="text-gray-700 hover:text-green-600">
            Training
          </Link>

          {/* Mobile Authentication */}
          <SignedOut>
            <SignInButton>
              <button className="w-full text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Login
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="w-full text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              to="/profile"
              className="w-full text-center text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-2"
            >
              My Profile
            </Link>
            <div className="mt-2 flex justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Overlay Background when Sidebar is Open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
