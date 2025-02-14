import React from 'react';
import { Clock, MapPin, Headphones, Shield, PenTool as Tool, BookOpen } from 'lucide-react';

const Features = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Why Choose Farm Rental Pro?</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          We understand farming is time-sensitive. That's why we provide reliable equipment and superior service to keep your operation running smoothly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg border border-gray-100 hover:border-green-500 transition">
            <div className="flex justify-center mb-4">
              <Clock className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seasonal Availability</h3>
            <p className="text-gray-600">Equipment ready when you need it most, aligned with your farming calendar</p>
          </div>
          
          <div className="text-center p-6 rounded-lg border border-gray-100 hover:border-green-500 transition">
            <div className="flex justify-center mb-4">
              <MapPin className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Local Support</h3>
            <p className="text-gray-600">Strategically located branches to serve farming communities</p>
          </div>
          
          <div className="text-center p-6 rounded-lg border border-gray-100 hover:border-green-500 transition">
            <div className="flex justify-center mb-4">
              <Headphones className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
            <p className="text-gray-600">Agricultural specialists to help you choose the right equipment</p>
          </div>
          
          <div className="text-center p-6 rounded-lg border border-gray-100 hover:border-green-500 transition">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Maintained Equipment</h3>
            <p className="text-gray-600">Regular maintenance and inspections for reliable performance</p>
          </div>

          <div className="text-center p-6 rounded-lg border border-gray-100 hover:border-green-500 transition">
            <div className="flex justify-center mb-4">
              <Tool className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">On-Site Service</h3>
            <p className="text-gray-600">Technical support and repairs at your location</p>
          </div>

          <div className="text-center p-6 rounded-lg border border-gray-100 hover:border-green-500 transition">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Equipment Training</h3>
            <p className="text-gray-600">Comprehensive training for safe and efficient operation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;