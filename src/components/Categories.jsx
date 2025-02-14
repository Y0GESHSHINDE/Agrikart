import React from 'react';
import { Tractor, Wheat, Sprout, Combine, Warehouse, Wrench } from 'lucide-react';

const categories = [
  { 
    icon: Tractor, 
    name: 'Tractors & Implements', 
    description: 'Wide range of tractors and attachments for every farming need',
    popular: ['Compact Tractors', 'Row Crop Tractors', 'Specialty Tractors']
  },
  { 
    icon: Wheat, 
    name: 'Harvesting Equipment', 
    description: 'Modern harvesting solutions for all crop types',
    popular: ['Combines', 'Forage Harvesters', 'Grain Headers']
  },
  { 
    icon: Sprout, 
    name: 'Planting & Seeding', 
    description: 'Precision equipment for optimal crop establishment',
    popular: ['Seed Drills', 'Planters', 'Fertilizer Spreaders']
  },
  { 
    icon: Combine, 
    name: 'Tillage Equipment', 
    description: 'Complete range of soil preparation equipment',
    popular: ['Plows', 'Cultivators', 'Disc Harrows']
  },
  { 
    icon: Warehouse, 
    name: 'Storage & Handling', 
    description: 'Equipment for post-harvest operations',
    popular: ['Grain Augers', 'Storage Bins', 'Conveyors']
  },
  { 
    icon: Wrench, 
    name: 'Maintenance Tools', 
    description: 'Essential tools for equipment upkeep',
    popular: ['Diagnostic Tools', 'Repair Kits', 'Cleaning Equipment']
  },
];

const Categories = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Equipment Categories</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Discover our comprehensive range of farming equipment available for rent. From soil preparation to harvest, we've got you covered.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <category.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Popular Equipment:</h4>
                <ul className="space-y-1">
                  {category.popular.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 hover:text-green-600 cursor-pointer">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;