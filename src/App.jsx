import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./layouts/LandingPage";
import HomePage from "./layouts/HomePage";
import ProfilePage from "./layouts/ProfilePage";
import MainPage from "./layouts/MainPage";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <SignedIn>
              <HomePage />
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
          path="/mainpage"
          element={
            <SignedIn>
              <MainPage />
            </SignedIn>
          }
        />

        {/* Redirect unauthorized access */}
        <Route
          path="*"
          element={
            <SignedOut>
              <Navigate to="/" replace />
            </SignedOut>
          }
        />
      </Routes>
      {/* Redirect to mainpage after login */}
      <SignedIn>
        <Navigate to="/mainpage" replace />
      </SignedIn>
    </Router>
  );
}

export default App;
