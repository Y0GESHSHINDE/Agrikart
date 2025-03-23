import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-yellow-500">AgriKart</h3>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for professional equipment rentals. We provide the best tools for your agricultural needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-500 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">Equipment</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-500 mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-400">9284385845</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-400">info@agrikart.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-400">Pune, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-500 mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe for updates and special offers</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 rounded-l-lg w-full focus:outline-none bg-gray-800 text-white placeholder-gray-500"
              />
              <button className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-r-lg font-semibold hover:bg-yellow-600 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AgriKart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;