import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

const SimilarInstruments = ({ instrument }) => {
  const [similarInstruments, setSimilarInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const instruType = instrument.equipmentType;

  useEffect(() => {
    const fetchSimilarInstruments = async () => {
      try {
        const response = await fetch(
          "https://main-backend-agrikart.vercel.app/api/equipment"
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Failed to fetch instruments");
        }

        // Filter instruments based on equipmentType
        const filteredInstruments = data.data.filter(
          (item) => item.equipmentType === instruType && !item.isRented
        );

        setSimilarInstruments(filteredInstruments);
      } catch (err) {
        console.error("Error fetching similar instruments:", err);
        setError("Failed to load similar instruments.");
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarInstruments();
  }, [instruType]);

  const handleInstrumentClick = (instrumentId) => {
    // Navigate to the instrument detail page
    navigate(`/instrument/${instrumentId}`);
  };

  if (loading) {
    return <p>Loading similar instruments...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <section
      className="rounded-2xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
      aria-labelledby="similar-instruments-title"
    >
      <h2
        id="similar-instruments-title"
        className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl"
      >
        Similar Instruments
      </h2>
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="List of similar instruments"
      >
        {similarInstruments.map((item) => (
          <article
            key={item._id}
            className="rounded-lg border border-gray-100 bg-gray-50/30 p-3 transition-all hover:border-green-200 hover:bg-white hover:shadow-md cursor-pointer"
            role="listitem"
            onClick={() => handleInstrumentClick(item._id)}
          >
            <div className="flex space-x-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                  src={item.images.primaryImage.url}
                  alt={item.equipmentName}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                  fetchpriority="low"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-gray-900 transition-colors hover:text-green-600">
                  {item.equipmentName}
                </h3>
                <div
                  className="mt-1 flex items-baseline space-x-2"
                  aria-label={`Price: ₹${item.rentalPerDay.toLocaleString()} per day`}
                >
                  <p className="text-base font-semibold text-green-600">
                    ₹{item.rentalPerDay.toLocaleString()}
                  </p>
                  <span className="text-sm text-gray-500">/day</span>
                </div>
                <div className="mt-2 flex flex-col justify-between sm:flex-row sm:items-center">
                  <StarRating rating={4.5} />
                </div>
              </div>
            </div>
            <p className="mr-auto mt-2 flex items-center justify-end gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-green-600" aria-hidden="true" />
              <span>{item.pickupLocation}</span>
            </p>
          </article>
        ))}
      </div>
      {similarInstruments.length === 0 && (
        <p className="text-center text-gray-500">No similar instruments found.</p>
      )}
    </section>
  );
};

export default SimilarInstruments;