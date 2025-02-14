import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Features from "./components/Features";
import SeasonalDeals from "./components/SeasonalDeals";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";


function App() {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <Hero />
      <Categories />
      <Features />
      <SeasonalDeals />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
