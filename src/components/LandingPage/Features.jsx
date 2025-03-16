import React from "react";
import {
  Clock,
  MapPin,
  Headphones,
  Shield,
  PenTool as Tool,
  BookOpen,
} from "lucide-react";

const Features = () => {
  const featuresData = [
    {
      icon: Clock,
      title: "Seasonal Availability",
      description:
        "Equipment ready when you need it most, aligned with your farming calendar",
    },
    {
      icon: MapPin,
      title: "Local Support",
      description:
        "Strategically located branches to serve farming communities",
    },
    {
      icon: Headphones,
      title: "Expert Guidance",
      description:
        "Agricultural specialists to help you choose the right equipment",
    },
    {
      icon: Shield,
      title: "Maintained Equipment",
      description:
        "Regular maintenance and inspections for reliable performance",
    },
    {
      icon: Tool,
      title: "On-Site Service",
      description: "Technical support and repairs at your location",
    },
    {
      icon: BookOpen,
      title: "Equipment Training",
      description: "Comprehensive training for safe and efficient operation",
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Why Choose AgriKart?
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          We understand farming is time-sensitive. That's why we provide
          reliable equipment and superior service to keep your operation running
          smoothly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-lg border border-gray-100 hover:border-green-500 transition"
              >
                <div className="flex justify-center mb-4">
                  <IconComponent className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Features;
