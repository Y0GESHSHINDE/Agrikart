import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const SeasonalDeals = () => {
  const seasons = [
    {
      name: "Spring",
      equipment: [
        "Planting Equipment",
        "Tillage Tools",
        "Fertilizer Spreaders",
      ],
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Summer",
      equipment: ["Irrigation Systems", "Crop Maintenance", "Pest Control"],
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Fall",
      equipment: ["Harvesters", "Storage Equipment", "Transport Vehicles"],
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Winter",
      equipment: ["Maintenance Tools", "Workshop Equipment", "Snow Removal"],
      image:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Seasonal Equipment Deals</h2>
            <p className="text-gray-600 max-w-2xl">
              Get the right equipment for every season. Our rental programs align with your agricultural calendar.
            </p>
          </div>
          <Calendar className="w-12 h-12 text-green-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasons.map((season, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-md">
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${season.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition"></div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-xl font-semibold mb-3">{season.name} Equipment</h3>
                <ul className="space-y-2 mb-4">
                  {season.equipment.map((item, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">• {item}</li>
                  ))}
                </ul>
                <button className="flex items-center text-green-600 hover:text-green-700 font-semibold group">
                  View Deals
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonalDeals;