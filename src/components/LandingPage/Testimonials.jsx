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
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Hear from our satisfied farmers who have transformed their agricultural experience with our services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full border-2 border-green-500"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>

              <div className="flex justify-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
