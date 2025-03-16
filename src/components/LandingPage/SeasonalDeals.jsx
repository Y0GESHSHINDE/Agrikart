import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const seasons = [
  {
    name: "Spring",
    equipment: ["Planting Equipment", "Tillage Tools", "Fertilizer Spreaders"],
    image:
      "https://plus.unsplash.com/premium_photo-1707229723342-1dc24b80ffd6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Summer",
    equipment: ["Irrigation Systems", "Crop Maintenance", "Pest Control"],
    image:
      "https://images.unsplash.com/photo-1534530889258-104916bc086f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Fall",
    equipment: ["Harvesters", "Storage Equipment", "Transport Vehicles"],
    image:
      "https://images.unsplash.com/photo-1733703276031-5f9288d6afc5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Winter",
    equipment: ["Maintenance Tools", "Workshop Equipment", "Snow Removal"],
    image:
      "https://images.unsplash.com/photo-1420585269105-d908ec316eb3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const SeasonalDeals = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth(); // Check if user is signed in

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
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => {
                if (isSignedIn) {
                  navigate("/seasonal-deals");
                } else {
                  // Trigger Clerk sign-in modal
                  document.querySelector(".clerk-sign-in").click();
                }
              }}
            >
              {/* Card Image */}
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${season.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition"></div>
              </div>

              {/* Card Content */}
              <div className="p-6 bg-white">
                <h3 className="text-xl font-semibold mb-3">{season.name} Equipment</h3>
                <ul className="space-y-2 mb-4">
                  {season.equipment.map((item, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">• {item}</li>
                  ))}
                </ul>

                {/* Authenticated User */}
                <SignedIn>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when button is clicked
                      navigate("/seasonal-deals");
                    }}
                    className="flex items-center text-green-600 hover:text-green-700 font-semibold group"
                  >
                    View Deals
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition" />
                  </button>
                </SignedIn>

                {/* Guest User - Show Clerk SignInButton */}
                <SignedOut>
                  <SignInButton>
                    <button
                      onClick={(e) => e.stopPropagation()} // Prevent card click event
                      className="clerk-sign-in flex items-center text-green-600 hover:text-green-700 font-semibold group"
                    >
                      View Deals
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition" />
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonalDeals;
