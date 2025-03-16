import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Tractor, X } from "lucide-react";
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
              {/* Show when User is NOT Logged In */}
              <SignedOut>
                <Link to="/" className="text-gray-700 hover:text-green-600">
                  Home
                </Link>
                <Link to="/farm-tools" className="text-gray-700 hover:text-green-600">
                  Farm Tools
                </Link>
                <Link to="/agri-ai" className="text-gray-700 hover:text-green-600">
                  Agri AI
                </Link>
                <Link to="/how-it-works" className="text-gray-700 hover:text-green-600">
                  How It Works
                </Link>
                <Link to="/testimonials" className="text-gray-700 hover:text-green-600">
                  Testimonials
                </Link>
                <Link to="/faq" className="text-gray-700 hover:text-green-600">
                  FAQ
                </Link>
              </SignedOut>

              {/* Show when User IS Logged In */}
              <SignedIn>
                <Link to="/dashboard" className="text-gray-700 hover:text-green-600">
                  Home
                </Link>
                <Link to="/my-orders" className="text-gray-700 hover:text-green-600">
                  My Orders
                </Link>
                <Link to="/krishi-ai" className="text-gray-700 hover:text-green-600">
                  Krishi AI
                </Link>
                <Link to="/list-tool" className="text-gray-700 hover:text-green-600">
                  List the Tool
                </Link>
                <Link to="/weather" className="text-gray-700 hover:text-green-600">
                  Weather Forecast
                </Link>
                <Link to="/help-center" className="text-gray-700 hover:text-green-600">
                  Help Center
                </Link>
              </SignedIn>
            </div>

            {/* Authentication Buttons */}
            <div className="flex items-center space-x-4">
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

              {/* User Profile (If Logged In) */}
              <SignedIn>
                <Link
                  to="/profile"
                  className="hidden lg:block text-sm px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  My Profile
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              {/* Mobile Menu Button */}
              <button className="lg:hidden" onClick={toggleMobileMenu}>
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        {/* Sidebar Header with Logo & Close Button */}
        <div className="p-4 flex justify-between items-center border-b border-gray-300">
          <div className="flex items-center space-x-2 text-xl font-bold text-green-700">
            <Tractor size={28} />
            <span>AGRICART</span>
          </div>
          <button onClick={toggleMobileMenu}>
            <X size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-col space-y-4 p-6 text-lg">
          <SignedOut>
            <Link to="/" className="text-gray-700 hover:text-green-600">
              Home
            </Link>
            <Link to="/farm-tools" className="text-gray-700 hover:text-green-600">
              Farm Tools
            </Link>
            <Link to="/agri-ai" className="text-gray-700 hover:text-green-600">
              Agri AI
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-green-600">
              How It Works
            </Link>
            <Link to="/testimonials" className="text-gray-700 hover:text-green-600">
              Testimonials
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-green-600">
              FAQ
            </Link>

            {/* Login & Sign Up Buttons (Mobile) */}
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
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600">
              Home
            </Link>
            <Link to="/my-orders" className="text-gray-700 hover:text-green-600">
              My Orders
            </Link>
            <Link to="/krishi-ai" className="text-gray-700 hover:text-green-600">
              Krishi AI
            </Link>
            <Link to="/list-tool" className="text-gray-700 hover:text-green-600">
              List the Tool
            </Link>
            <Link to="/weather" className="text-gray-700 hover:text-green-600">
              Weather Forecast
            </Link>
            <Link to="/help-center" className="text-gray-700 hover:text-green-600">
              Help Center
            </Link>
            <Link to="/profile" className="w-full text-center text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-2">
              My Profile
            </Link>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
