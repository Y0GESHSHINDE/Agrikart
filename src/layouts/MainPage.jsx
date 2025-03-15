import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from '../components/MainPage/Hero';

const MainPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero/>
    </div>
  );
};

export default MainPage;
