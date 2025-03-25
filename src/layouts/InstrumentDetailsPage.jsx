import React, { useState, useEffect, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import {
  ChevronLeft,
  Clock,
  Calendar,
  MapPin,
  MessageSquare,
} from "lucide-react";

// Component imports
import RentNowModal from "./RentNowModal";
import Navbar from "../components/Navbar/Navbar";
import SwiperImageGallery from "../components/InstrumentDetails/SwiperImageGallery";
import StarRating from "../components/InstrumentDetails/StarRating";

// Lazy loaded components
const SimilarInstruments = lazy(() =>
  import("../components/InstrumentDetails/SimilarInstruments")
);

// Skip link for accessibility
const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-green-700 focus:ring-2 focus:ring-green-500">
    Skip to main content
  </a>
);

export default function InstrumentDetailPage() {
  const { id } = useParams(); // Get the `id` from the URL
  const navigate = useNavigate();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [instrument, setInstrument] = useState(null); // State to store fetched equipment data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log(instrument._id);

  // Fetch equipment data based on `id`
  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        const response = await fetch(
          `https://main-backend-agrikart.vercel.app/api/equipment/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setInstrument(data.data); // Set the fetched data
        } else {
          throw new Error("Failed to fetch equipment data");
        }
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchInstrument();
  }, [id]);

  // Debounced scroll handler for better performance
  useEffect(() => {
    const handleScroll = debounce(() => {
      setIsHeaderSticky(window.scrollY > 100);
    }, 16); // ~60fps

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/80">
        <p className="text-lg text-gray-700">Loading equipment details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/80">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  // If no instrument data is found
  if (!instrument) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/80">
        <p className="text-lg text-gray-700">No equipment found.</p>
      </div>
    );
  }

  return (
    <>
      <SkipLink />
      <div className="min-h-screen bg-gray-50/80 pb-12">
        <header>
          <Navbar />
        </header>

        <nav
          className={`sticky top-0 z-20 transition-all duration-300 ${
            isHeaderSticky
              ? "bg-white/95 shadow-md backdrop-blur"
              : "bg-transparent"
          }`}
          aria-label="Breadcrumb navigation">
          <div className="container mx-auto w-full px-4 py-4">
            <button
              onClick={() => navigate("/Listed-instruments")}
              className="flex items-center text-green-700 transition-colors hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Back to instrument listings">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium">Back to Listings</span>
            </button>
          </div>
        </nav>

        <main
          id="main-content"
          className="container mx-auto w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="space-y-8">
            <section
              aria-label="Product gallery"
              className="rounded-2xl bg-white p-3 shadow-lg transition-shadow hover:shadow-xl sm:p-6">
              <SwiperImageGallery
                images={[
                  instrument.images.primaryImage.url,
                  instrument.images.secondaryImage.url,
                ]}
              />
            </section>

            <section
              className="grid grid-cols-1 gap-6 lg:gap-8"
              aria-labelledby="product-information">
              <div className="w-full space-y-6">
                {/* Basic Info */}
                <article
                  className="rounded-2xl bg-white p-4 shadow-lg transition-all hover:shadow-xl sm:p-6"
                  aria-labelledby="instrument-title">
                  <div className="mb-4 w-full">
                    <div className="flex w-full justify-between">
                      <h1
                        id="instrument-title"
                        className="w-3/4 text-xl font-bold text-gray-900 sm:text-2xl md:text-[1.7rem] lg:text-3xl">
                        {instrument.equipmentName}
                      </h1>
                      {/* <span
                        className="inline-flex h-fit w-fit rounded-lg bg-green-100 px-2 py-1 text-sm font-medium text-green-800 shadow-sm ring-1 ring-inset ring-green-200 sm:px-4 sm:py-1.5"
                        role="status"
                        aria-label={`Condition: ${instrument.condition}`}>
                        {instrument.condition}
                      </span> */}
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="flex items-center text-xs text-gray-600 sm:text-sm">
                        <MapPin className="mr-1 h-4 w-4" aria-hidden="true" />
                        {instrument.pickupLocation}
                      </span>
                      <span
                        className="text-base text-gray-500"
                        aria-hidden="true">
                        |
                      </span>
                      <StarRating rating={4.5} />{" "}
                      {/* Replace with actual rating if available */}
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-lg">
                    {instrument.description}
                  </p>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between xl:flex-row">
                    <p
                      className="text-xl font-bold text-green-700 sm:text-[1.6rem]"
                      aria-label={`Price: ₹${instrument.rentalPerDay.toLocaleString()}`}>
                      ₹{instrument.rentalPerDay.toLocaleString()} Per Hour
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 md:flex-nowrap xl:w-fit">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:flex-none sm:px-5 sm:py-2 sm:text-base"
                        aria-label="Rent this instrument now">
                        Rent Now
                      </button>
                      <button
                        className="flex-1 rounded-lg border-2 border-green-600 px-3 py-2 text-sm font-semibold text-green-600 transition-all hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:flex-none sm:px-5 sm:py-2 sm:text-base"
                        aria-label="Contact owner">
                        <MessageSquare
                          className="mr-2 inline-block h-4 w-4 sm:h-5 sm:w-5"
                          aria-hidden="true"
                        />
                        Contact
                      </button>
                    </div>
                  </div>
                </article>

                {/* Rental Rates */}
                <section
                  className="rounded-2xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
                  aria-labelledby="rental-rates-title">
                  <h2
                    id="rental-rates-title"
                    className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl md:text-2xl">
                    Rental Rates
                  </h2>
                  <div
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:gap-4"
                    role="list"
                    aria-label="List of rental rates">
                    {[
                      {
                        icon: Clock,
                        label: "Hourly",
                        rate: instrument.rentalPerHour,
                        unit: "hr",
                      },
                      {
                        icon: Calendar,
                        label: "Daily",
                        rate: instrument.rentalPerDay,
                        unit: "day",
                      },
                      {
                        icon: Calendar,
                        label: "Weekly",
                        rate: instrument.rentalPerDay * 7,
                        unit: "week",
                      }, // Assuming weekly rate is 7x daily rate
                    ].map(({ icon: Icon, label, rate, unit }) => (
                      <div
                        key={label}
                        className="flex items-center rounded-xl border border-gray-200 p-3 shadow-sm transition-all hover:border-green-500 hover:shadow-md sm:p-4"
                        role="listitem">
                        <Icon
                          className="mr-2 h-6 w-6 text-green-600 sm:mr-3 sm:h-8 sm:w-8"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-600 sm:text-sm">
                            {label} Rate
                          </p>
                          <p
                            className="text-base font-semibold text-gray-900 sm:text-lg"
                            aria-label={`${label} rate: ₹${rate} per ${unit}`}>
                            ₹{rate}/{unit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Specifications and Features */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Specifications */}
                <section
                  className="w-full rounded-2xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
                  aria-labelledby="specifications-title">
                  <h2
                    id="specifications-title"
                    className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
                    Specifications
                  </h2>
                  <div
                    className="space-y-3 sm:space-y-4"
                    role="list"
                    aria-label="Specifications list">
                    {[
                      { label: "Brand", value: instrument.brand },
                      { label: "Model", value: instrument.model },
                      {
                        label: "Chassis Number",
                        value: instrument.chassisNumber,
                      },
                      {
                        label: "Number Plate",
                        value: instrument.numberPlateNumber,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between border-b border-gray-200 pb-2 transition-colors hover:border-green-200"
                        role="listitem">
                        <span className="text-sm text-gray-600 sm:text-base">
                          {label}
                        </span>
                        <span className="font-medium text-gray-900">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Features */}
                <section
                  className="rounded-2xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6 md:w-full"
                  aria-labelledby="features-title">
                  <h2
                    id="features-title"
                    className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
                    Features
                  </h2>
                  <div
                    className="grid grid-cols-1 gap-3"
                    role="list"
                    aria-label="Features list">
                    {[
                      "Powerful engine",
                      "High durability",
                      "Advanced features",
                      "Efficient fuel consumption",
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 transition-all hover:border-green-200 hover:bg-green-50/30 sm:p-3"
                        role="listitem">
                        <span
                          className="mr-2 h-2 w-2 rounded-full bg-green-500 sm:mr-3"
                          aria-hidden="true"></span>
                        <span className="text-sm text-gray-700 sm:text-base">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>

            {/* Similar Instruments with lazy loading */}
            <Suspense
              fallback={
                <div
                  className="animate-pulse rounded-2xl bg-white p-4 shadow-lg"
                  aria-label="Loading similar instruments">
                  <div className="mb-4 h-8 w-48 rounded bg-gray-200"></div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-32 rounded-lg bg-gray-100"></div>
                    ))}
                  </div>
                </div>
              }>
              <SimilarInstruments instrument={instrument} />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Rent Now Modal */}
      <RentNowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        instrumentName={instrument?.equipmentName}
        instrumentId={instrument._id}
        instrumentPrice={instrument.rentalPerHour}
      />
    </>
  );
}
