import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AGRICART</h3>
            <p className="text-gray-400 mb-4">Your trusted partner for professional equipment rentals.</p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-yellow-500" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-yellow-500" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-yellow-500" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-yellow-500" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-yellow-500">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500">Equipment</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-400">1-800-667-9328</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-400">info@rentalpro.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-400">500 Main Street, NY 10001</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe for updates and special offers</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-lg w-full focus:outline-none text-black"
              />
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-r-lg font-semibold hover:bg-yellow-600">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Rental Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;