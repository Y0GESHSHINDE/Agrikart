import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LandingPage from "./layouts/LandingPage";

// Scroll restoration component
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Set manual scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Scroll to top
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
import ProfilePage from "./layouts/ProfilePage";
import MainPage from "./layouts/MainPage";
import ProductListing from "./layouts/ProductListing";
import InstrumentDetail from "./layouts/InstrumentDetailsPage";
import ManageInstrument from "./components/Profile/ManageInstrument";
import InstrumentRented from "./components/Profile/InstrumentRented";
import MoneyEarned from "./components/Profile/MoneyEarned";
import HistoryRatings from "./components/Profile/HistoryRatings";
import AboutAgriKart from "./components/LandingPage/AboutAgriKart";
import WeatherAppPage from "./layouts/WeatherAppPage";
import AboutKrishAi from "./components/LandingPage/AboutKrishAi";
import Krishi from "./layouts/Krishi";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Conditional route for "/" - shows different pages based on auth state */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <MainPage />
              </SignedIn>
              <SignedOut>
                <LandingPage />
              </SignedOut>
            </>
          }
        />

        {/* Protected routes - only accessible when signed in */}
        <Route
          path="/mainpage"
          element={
            <SignedIn>
              <MainPage />
            </SignedIn>
          }
        />
        <Route
          path="/profile"
          element={
            <SignedIn>
              <ProfilePage />
            </SignedIn>
          }
        />
        <Route
          path="/Listed-instruments"
          element={
            <SignedIn>
              <ProductListing />
            </SignedIn>
          }
        />
        <Route
          path="/instrument/:id"
          element={
            <SignedIn>
              <InstrumentDetail />
            </SignedIn>
          }
        />
        <Route
          path="/manage-instruments"
          element={
            <SignedIn>
              <ManageInstrument />
            </SignedIn>
          }
        />
        <Route
          path="/rented-instruments"
          element={
            <SignedIn>
              <InstrumentRented />
            </SignedIn>
          }
        />
        <Route
          path="/money-earned"
          element={
            <SignedIn>
              <MoneyEarned />
            </SignedIn>
          }
        />
        <Route
          path="/history-ratings"
          element={
            <SignedIn>
              <HistoryRatings />
            </SignedIn>
          }
        />
        <Route
          path="/weather"
          element={
            <SignedIn>
              < WeatherAppPage/>
            </SignedIn>
          }
        />
        <Route
          path="/krishi"
          element={
            <SignedIn>
              <Krishi />
            </SignedIn>
          }
        />

        <Route path="/about-agrikart" element={<AboutAgriKart />} />
        <Route path="/about-krishi-ai" element={< AboutKrishAi/>} />

        {/* Catch-all route - redirects unauthenticated users */}
        <Route
          path="*"
          element={
            <>
              <SignedIn>
                <Navigate to="/" />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
