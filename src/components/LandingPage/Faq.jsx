import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTractor } from "react-icons/fa6";
import {
  FaMoneyBillWave,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaThumbsUp,
  FaThumbsDown,
  FaQuestionCircle,
  FaHeadset,
} from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import Footer from "./Footer";

const categories = {
  equipment: {
    name: "Equipment & Tools",
    icon: FaTractor,
    color: "text-green-500",
    gradient: "from-green-500/10 to-green-500/5",
    bg: "bg-green-50",
  },
  payment: {
    name: "Payment & Pricing",
    icon: FaMoneyBillWave,
    color: "text-blue-500",
    gradient: "from-blue-500/10 to-blue-500/5",
    bg: "bg-blue-50",
  },
  support: {
    name: "Support & Help",
    icon: FaHeadset,
    color: "text-purple-500",
    gradient: "from-purple-500/10 to-purple-500/5",
    bg: "bg-purple-50",
  },
  general: {
    name: "General Information",
    icon: FaQuestionCircle,
    color: "text-gray-500",
    gradient: "from-gray-500/10 to-gray-500/5",
    bg: "bg-gray-50",
  },
};

const faqs = [
  {
    category: "general",
    question: "What is AgriKart?",
    answer:
      "AgriKart is an online platform where farmers can rent agricultural equipment instead of buying it. This makes farming more affordable and accessible.",
  },
  {
    category: "general",
    question: "How does AgriKart work?",
    answer: (
      <ul className="list-inside list-decimal">
        <li>Browse the available farming equipment on the platform.</li>
        <li>Select the required equipment and book it.</li>
        <li>Make the payment and confirm your rental.</li>
        <li>The equipment is delivered to your farm.</li>
        <li>After use, it is picked up by the provider.</li>
      </ul>
    ),
  },
  {
    category: "equipment",
    question: "What type of equipment can I rent on AgriKart?",
    answer: (
      <ul className="list-inside list-disc space-y-1">
        <li>Tractors and Heavy Machinery</li>
        <li>Harvesters and Processing Equipment</li>
        <li>Tillage and Soil Preparation Tools</li>
        <li>Irrigation Systems and Water Management</li>
        <li>Sprayers and Crop Maintenance Tools</li>
      </ul>
    ),
  },
  {
    category: "equipment",
    question: "What are the benefits of renting farm equipment?",
    answer: (
      <ul className="list-inside list-disc space-y-1">
        <li><strong>Cost-Effective</strong> – No need to invest in expensive machinery</li>
        <li><strong>Flexibility</strong> – Rent equipment only when needed</li>
        <li><strong>Access to Modern Tools</strong> – Use the latest technology</li>
        <li><strong>No Maintenance Costs</strong> – Equipment is serviced before every rental</li>
      </ul>
    ),
  },
  {
    category: "payment",
    question: "How much does it cost to rent farm equipment?",
    answer: "The cost varies based on:\n1. Type of equipment\n2. Rental duration\n3. Seasonal demand\nCheck the platform for real-time pricing.",
  },
  {
    category: "equipment",
    question: "How is the rental equipment delivered and picked up?",
    answer: "AgriKart arranges both delivery and pickup. A small delivery fee may apply depending on the distance.",
  },
  {
    category: "equipment",
    question: "What happens if the rented equipment gets damaged?",
    answer: "Minor wear and tear is covered. However, if the equipment is severely damaged due to negligence, repair costs may be charged. Rental insurance is available for added protection.",
  },
  {
    category: "general",
    question: "Can I list my own farm equipment for rent on AgriKart?",
    answer: "Yes! If you own agricultural tools, you can list them on AgriKart, set your rental price, and earn passive income.",
  },
  {
    category: "payment",
    question: "How do I make a payment for the rental?",
    answer: (
      <ul className="list-inside list-disc space-y-1">
        <li>UPI (Google Pay, PhonePe, Paytm)</li>
        <li>Credit/Debit Cards</li>
        <li>Bank Transfers</li>
        <li>Cash on Delivery (for selected locations)</li>
      </ul>
    ),
  },
  {
    category: "support",
    question: "Can I cancel my rental booking?",
    answer: "Yes! Free cancellation is available 48 hours before the rental period starts. Partial refunds are given for cancellations within 24 hours.",
  },
  {
    category: "support",
    question: "How does AgriKart ensure equipment quality?",
    answer: "Every machine is inspected and serviced before each rental. If any equipment is faulty, we replace it immediately to ensure quality.",
  },
  {
    category: "support",
    question: "How can I contact AgriKart for support?",
    answer: (
      <ul className="list-inside list-disc space-y-1">
        <li>Phone: <strong>+91-XXXXXXXXXX</strong></li>
        <li>Email: <strong>support@agrikart.com</strong></li>
        <li>Live Chat: Available on our website</li>
      </ul>
    ),
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleVote = (index, isHelpful) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [index]: isHelpful
    }));
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-gray-900/90 backdrop-blur-sm"></div>
        </div>

        <div className="relative">
          {/* Hero Section */}
          <div className="px-3 py-8 pb-4 text-center sm:px-4 sm:py-12 md:pb-8 md:pt-16">
            <motion.h1
              className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-6xl"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Frequently Asked Questions
              <div className="mt-4 text-lg font-normal text-green-400 sm:text-xl md:text-2xl lg:text-3xl">
                Find answers to common questions about AgriKart
              </div>
            </motion.h1>
          </div>

          <div className="container mx-auto px-4 pb-20 sm:px-6 lg:px-8">
            {/* Search and Filter Section */}
            <motion.div
              className="mx-auto mb-8 max-w-3xl space-y-6 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 transform text-xl text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white/90 py-2 pl-4 pr-4 text-base backdrop-blur-md transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-green-500 sm:py-3 sm:pl-6 sm:text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search frequently asked questions"
                  role="searchbox"
                />
              </div>

              <div className="grid grid-cols-1 justify-center gap-2 sm:grid-cols-2 sm:gap-3 lg:flex lg:flex-wrap">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-base sm:text-lg font-medium ${selectedCategory === "all"
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                      : "bg-white/90 backdrop-blur-md text-gray-700 hover:bg-green-50"
                    }`}
                  aria-pressed={selectedCategory === "all"}
                  aria-label="Show all questions"
                >
                  All Questions
                </button>
                {Object.entries(categories).map(([key, category]) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center gap-2 transition-all duration-300 text-sm sm:text-base lg:text-lg font-medium ${selectedCategory === key
                          ? `bg-gradient-to-r ${category.gradient} border-2 border-${category.color} ${category.color} shadow-lg`
                          : "bg-white/90 backdrop-blur-md text-gray-700 hover:bg-green-50"
                        }`}
                      aria-pressed={selectedCategory === key}
                      aria-label={`Show ${category.name} questions`}
                    >
                      <Icon className={`text-2xl ${selectedCategory === key ? "text-white" : category.color}`} />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* FAQ List */}
            <motion.div
              className="mx-auto max-w-3xl space-y-4 sm:space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <AnimatePresence mode="wait">
                {filteredFaqs.map((faq, index) => {
                  const Icon = categories[faq.category].icon;
                  const categoryColor = categories[faq.category].color;
                  const categoryGradient = categories[faq.category].gradient;
                  const categoryBg = categories[faq.category].bg;

                  return (
                    <motion.div
                      key={index}
                      className={`bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border-2 border-transparent hover:border-${categoryColor} transition-all duration-300`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -2 }}
                    >
                      <div
                        className="cursor-pointer p-1.5 sm:p-2 md:p-3"
                        onClick={() => toggleFAQ(index)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleFAQ(index);
                          }
                        }}
                        aria-expanded={openIndex === index}
                        aria-controls={`faq-content-${index}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${categoryGradient}`}>
                            <Icon className={`sm:text-2xl text-xl ${categoryColor}`} />
                          </div>
                          <div className="mt-2 flex-grow">
                            <h3
                              id={`faq-question-${index}`}
                              className="w-[94%] pr-8 text-base font-semibold text-gray-800 sm:text-lg lg:text-xl"
                            >
                              {faq.question}
                            </h3>
                            <AnimatePresence>
                              {openIndex === index && (
                                <motion.div
                                  id={`faq-content-${index}`}
                                  className="mt-2.5 sm:mt-4"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  role="region"
                                  aria-labelledby={`faq-question-${index}`}
                                >
                                  <div className="prose prose-base sm:prose-lg prose-green max-w-none px-0.5 text-sm text-gray-600 sm:px-0 sm:text-base">
                                    {faq.answer}
                                  </div>
                                  <div className="mt-0 flex flex-col items-start gap-1.5 border-t pt-2.5 text-sm text-gray-500 sm:mt-2 sm:flex-row sm:items-center sm:gap-4 sm:pt-4">
                                    <span className="">Was this answer helpful?</span>
                                    <div className="flex space-x-4">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleVote(index, true);
                                        }}
                                        className={`flex items-center sm:text-base text-sm gap-1.5 sm:gap-2 px-4 sm:py-2 py-1.5 rounded-lg transition-colors ${helpfulVotes[index] === true
                                            ? "bg-green-100 text-green-700"
                                            : "hover:bg-gray-100"
                                          }`}
                                        aria-label="Mark answer as helpful"
                                        aria-pressed={helpfulVotes[index] === true}
                                      >
                                        <FaThumbsUp className="text-lg" role="img" aria-hidden="true" /> Yes
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleVote(index, false);
                                        }}
                                        className={`flex items-center sm:text-base text-sm gap-1.5 sm:gap-2 px-4 sm:py-2 py-1.5 rounded-lg transition-colors ${helpfulVotes[index] === false
                                            ? "bg-red-100 text-red-700"
                                            : "hover:bg-gray-100"
                                          }`}
                                        aria-label="Mark answer as not helpful"
                                        aria-pressed={helpfulVotes[index] === false}
                                      >
                                        <FaThumbsDown className="text-lg" role="img" aria-hidden="true" /> No
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <div className="absolute right-6 top-4 sm:top-5 md:top-6">
                            {openIndex === index ? (
                              <FaChevronUp className={`text-xl sm:text-2xl ${categoryColor}`} />
                            ) : (
                              <FaChevronDown className={`text-xl sm:text-2xl ${categoryColor}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Faq;
