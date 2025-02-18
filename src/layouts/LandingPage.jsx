import React from 'react'
import Navbar from './../components/Navbar/Navbar';
import Hero from '../components/LandingPage/Hero';
import Categories from './../components/LandingPage/Categories';
import { Feather } from 'lucide-react';
import SeasonalDeals from '../components/LandingPage/SeasonalDeals';
import Testimonials from '../components/LandingPage/Testimonials';
import Footer from '../components/LandingPage/Footer';

function LandingPage() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Categories/>
      <Feather/>
      <SeasonalDeals/>
      <Testimonials />
      <Footer/>
    </div>
  )
}

export default LandingPage