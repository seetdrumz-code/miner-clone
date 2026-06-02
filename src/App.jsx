import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Pricing from "./Pages/Pricing";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Admin from "./Pages/Admin";
import Leaderboard from "./Pages/Leaderboard";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import "./App.css";

export default function App() {

  return (

    <BrowserRouter>

      <div className="bg-black min-h-screen text-white flex flex-col">

        <Navbar />

        <main className="flex-1">

          <Routes>

            {/* PUBLIC ROUTES */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/pricing"
              element={<Pricing />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/leaderboard"
              element={<Leaderboard />}
            />

            {/* USER DASHBOARD */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ADMIN DASHBOARD */}

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

          </Routes>

        </main>

        <Footer />

      </div>

    </BrowserRouter>

  );

}
