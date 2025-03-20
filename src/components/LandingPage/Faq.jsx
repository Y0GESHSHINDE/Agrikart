import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";
import Footer from "./Footer";

const faqs = [
  {
    question: " What is AgriKart?",
    answer:
      "AgriKart is an online platform where farmers can **rent** agricultural equipment instead of buying it. This makes farming more affordable and accessible.",
  },
  {
    question: " How does AgriKart work?",
    answer: (
      <ul className="list-decimal list-inside">
        <li>Browse the available farming equipment on the platform.</li>
        <li>Select the required equipment and book it.</li>
        <li>Make the payment and confirm your rental.</li>
        <li>The equipment is delivered to your farm.</li>
        <li>After use, it is picked up by the provider.</li>
      </ul>
    ),
  },
  {
    question: "What type of equipment can I rent on AgriKart?",
    answer: (
      <ul className="list-disc list-inside">
        <li>🚜 Tractors</li>
        <li>🌾 Harvesters</li>
        <li>🔨 Tillage tools</li>
        <li>💧 Irrigation systems</li>
        <li>🛠️ Sprayers & other farming tools</li>
      </ul>
    ),
  },
  {
    question: "What are the benefits of renting farm equipment?",
    answer: (
      <ul className="list-disc list-inside">
        <li>💰 **Cost-Effective** – No need to invest in expensive machinery.</li>
        <li>🔄 **Flexibility** – Rent equipment only when needed.</li>
        <li>⚡ **Access to Modern Tools** – Use the latest technology.</li>
        <li>🛠️ **No Maintenance Costs** – Equipment is serviced before every rental.</li>
      </ul>
    ),
  },
  {
    question: "How much does it cost to rent farm equipment?",
    answer:
      "The cost varies based on:\n1. Type of equipment\n2. Rental duration\n3. Seasonal demand\nCheck the platform for real-time pricing.",
  },
  {
    question: " How is the rental equipment delivered and picked up?",
    answer:
      "AgriKart arranges both **delivery and pickup**. A small delivery fee may apply depending on the distance.",
  },
  {
    question: " What happens if the rented equipment gets damaged?",
    answer:
      "Minor wear and tear is covered. However, if the equipment is severely damaged due to negligence, repair costs may be charged. **Rental insurance is available for added protection.**",
  },
  {
    question: "Can I list my own farm equipment for rent on AgriKart?",
    answer:
      "Yes! If you own agricultural tools, you can list them on AgriKart, set your rental price, and earn passive income.",
  },
  {
    question: " How do I make a payment for the rental?",
    answer: (
      <ul className="list-disc list-inside">
        <li>✅ UPI (Google Pay, PhonePe, Paytm)</li>
        <li>💳 Credit/Debit Cards</li>
        <li>🏦 Bank Transfers</li>
        <li>💵 Cash on Delivery (for selected locations)</li>
      </ul>
    ),
  },
  {
    question: " Can I cancel my rental booking?",
    answer:
      "Yes! Free cancellation is available **48 hours before** the rental period starts. Partial refunds are given for cancellations within **24 hours.**",
  },
  {
    question: " How does AgriKart ensure equipment quality?",
    answer:
      "Every machine is **inspected and serviced** before each rental. If any equipment is faulty, we replace it immediately to ensure quality.",
  },
  {
    question: " How can I contact AgriKart for support?",
    answer: (
      <ul className="list-disc list-inside">
        <li>📞 Phone: **+91-XXXXXXXXXX**</li>
        <li>📧 Email: **support@agrikart.com**</li>
        <li>💬 Live Chat: Available on our website.</li>
      </ul>
    ),
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
          🏡 AgriKart Frequently Asked Questions
        </h2>

        <motion.div
          className="max-w-3xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-200 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <FaChevronUp className="text-green-600" />
                ) : (
                  <FaChevronDown className="text-green-600" />
                )}
              </div>
              {openIndex === index && (
                <motion.div
                  className="mt-3 text-gray-600"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer/>
    </>
  );
}

export default Faq;
