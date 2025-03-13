import React from "react";
import Navbar from "../components/Navbar/Navbar";

const MainPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Welcome to AgriKart
        </h1>
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default MainPage;
