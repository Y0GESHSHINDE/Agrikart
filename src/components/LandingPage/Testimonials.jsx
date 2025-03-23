import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ravi Patel",
    role: "Farm Owner, Gujarat",
    quote:
      "This platform has made renting farm equipment so easy! High-quality tools at great prices. A must-use for every farmer!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Meera Sharma",
    role: "Agricultural Consultant, Punjab",
    quote:
      "I recommend this service to all my clients. The availability of seasonal equipment is a game changer!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Amit Kumar",
    role: "Dairy Farmer, Maharashtra",
    quote:
      "The best decision I made was to rent machinery from here. Hassle-free process and top-notch customer support!",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
];

const Testimonials = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl font-extrabold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What Our farmers Say
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Hear from our satisfied farmers who have transformed their agricultural experience with our services.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full border-4 border-green-500 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{testimonial.role}</p>
                <p className="text-gray-700 italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex space-x-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;