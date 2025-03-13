import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./layouts/LandingPage";
import ProfilePage from "./layouts/ProfilePage";
import MainPage from "./layouts/MainPage";
import ProductListing from "./layouts/ProductListing";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
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
          path="/product-listing"
          element={
            <SignedIn>
              <ProductListing />
            </SignedIn>
          }
        />

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
