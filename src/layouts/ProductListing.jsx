import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Star,
} from "lucide-react";


// Star Rating component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}

      {hasHalfStar && (
        <div className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <div className="absolute left-0 top-0 w-1/2 overflow-hidden">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
      ))}

      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function ProductListing() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://main-backend-agrikart.vercel.app/api/equipment"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setEquipmentData(data.data);
        } else {
          setError("Failed to fetch equipment data");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Available filter options
  const categories = [
    "All",
    "Tractors",
    "Harvesters",
    "Irrigation",
    "Planting",
    "Sprayers",
    "Tillage",
    "Hay Equipment",
    "Fertilizing",
  ];
  const conditions = ["All", "New", "Used"];
  const priceRanges = [
    "All",
    "Under ₹10,000",
    "₹10,000-₹25,000",
    "₹25,000-₹50,000",
    "Over ₹50,000",
  ];

  // Filter products based on selected filters
  const filteredProducts = equipmentData.filter((product) => {
    // Category filter
    if (selectedCategory !== "All" && product.category !== selectedCategory) {
      return false;
    }

    // Condition filter
    if (
      selectedCondition !== "All" &&
      product.condition !== selectedCondition
    ) {
      return false;
    }

    // Price range filter
    if (selectedPriceRange !== "All") {
      if (
        selectedPriceRange === "Under ₹10,000" &&
        product.rentalPerDay >= 10000
      ) {
        return false;
      } else if (
        selectedPriceRange === "₹10,000-₹25,000" &&
        (product.rentalPerDay < 10000 || product.rentalPerDay > 25000)
      ) {
        return false;
      } else if (
        selectedPriceRange === "₹25,000-₹50,000" &&
        (product.rentalPerDay < 25000 || product.rentalPerDay > 50000)
      ) {
        return false;
      } else if (
        selectedPriceRange === "Over ₹50,000" &&
        product.rentalPerDay <= 50000
      ) {
        return false;
      }
    }

    // Search query filter
    if (
      searchQuery &&
      !product.equipmentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Reset to first page when filters change
  const handleFilterChange = (filterFn, value) => {
    setCurrentPage(1);
    filterFn(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-4 text-xl font-bold text-green-800 sm:mb-6 sm:text-2xl md:text-3xl">
          Farming Equipment
        </h1>

        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
          />
        </div>

        {/* Filter Section */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
          <div className="mb-4 flex items-center">
            <Filter className="mr-2 h-5 w-5 text-green-700" />
            <h2 className="text-xl font-semibold text-green-800">Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Category Filter */}
            <div className="mb-4">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                  value={selectedCategory}
                  onChange={(e) =>
                    handleFilterChange(setSelectedCategory, e.target.value)
                  }>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Condition Filter */}
            <div className="mb-4">
              <label
                htmlFor="condition"
                className="mb-2 block text-sm font-medium text-gray-700">
                Condition
              </label>
              <div className="relative">
                <select
                  id="condition"
                  className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                  value={selectedCondition}
                  onChange={(e) =>
                    handleFilterChange(setSelectedCondition, e.target.value)
                  }>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-4">
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <div className="relative">
                <select
                  id="price"
                  className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                  value={selectedPriceRange}
                  onChange={(e) =>
                    handleFilterChange(setSelectedPriceRange, e.target.value)
                  }>
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700">
            Showing {indexOfFirstProduct + 1}-
            {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product) => (
              <Link
                key={product._id}
                to={`/instrument/${product._id}`}
                className="block">
                <article className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
                  <img
                    src={product.images.primaryImage.url || "/placeholder.svg"}
                    alt={product.equipmentName}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                        {product.equipmentName}
                      </h3>
                      <span className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {product.condition}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="mb-2">
                      <StarRating rating={product.rating || 4.5} />
                    </div>

                    <p className="mb-3 line-clamp-3 text-sm text-gray-600">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-700">
                      ₹{product.rentalPerDay.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-lg text-gray-700">
              No products match your filters. Try adjusting your criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-3 py-2 mr-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-green-700 hover:bg-green-50"
                } border border-gray-300`}>
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous</span>
              </button>

              <div className="hidden sm:flex">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show limited page numbers with ellipsis for better UX
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-4 py-2 mx-1 rounded-md ${
                          currentPage === pageNumber
                            ? "bg-green-600 text-white"
                            : "bg-white text-green-700 hover:bg-green-50"
                        } border border-gray-300`}>
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === currentPage - 2 && pageNumber > 1) ||
                    (pageNumber === currentPage + 2 && pageNumber < totalPages)
                  ) {
                    return (
                      <span key={pageNumber} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Mobile pagination - just show current/total */}
              <div className="sm:hidden">
                <span className="rounded-md border border-gray-300 bg-white px-4 py-2">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center px-3 py-2 ml-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-green-700 hover:bg-green-50"
                } border border-gray-300`}>
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
