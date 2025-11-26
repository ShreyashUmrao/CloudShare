import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import RedirectIfAuth from "./components/RedirectIfAuth";
import NavBar from "./components/NavBar";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Share = lazy(() => import("./pages/Share"));
const Analytics = lazy(() => import("./pages/Analytics"));
const PublicShare = lazy(() => import("./pages/PublicShare"));

export default function App() {
  return (
    <>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
        <Route path="/" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="/share/:id" element={<RequireAuth><Share /></RequireAuth>} />
        <Route path="/analytics/:id" element={<RequireAuth><Analytics /></RequireAuth>} />
        <Route path="/s/:id" element={<PublicShare />} />
        </Routes>
      </Suspense>
    </>
  );
}
