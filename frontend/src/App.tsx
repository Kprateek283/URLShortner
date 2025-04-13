// src/App.tsx
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";

import GetStartedPage from "./pages/GetStartedPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import AnalyticsPage from "./pages/AnalyticsPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

import GlobalSpinner from "./components/GlobalSpinner.tsx";
import { useSpinner } from "./store/spinnerStore.ts"; // make sure this path is correct

function App() {
  const loading = useSpinner((state) => state.loading); // ✅ only once, inside the component

  return (
    <>
      <GlobalSpinner show={loading} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GetStartedPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics/:shortId" element={<AnalyticsPage />} /> {/* Fixed route for dynamic shortId */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
