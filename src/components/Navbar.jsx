import { Link } from "react-router-dom";
import { useState } from "react";

import { getAuth, signOut } from "firebase/auth";
import app from "../firebase";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const auth = getAuth(app);

  function handleLogout() {

    signOut(auth);

    alert("Logged out!");

  }

  return (

    <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-lg sticky top-0 z-50">

      <div className="flex justify-between items-center p-6">

        <h1 className="text-3xl font-bold text-green-400">
          MinerClone
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-300 items-center">

          <Link to="/" className="hover:text-green-400 transition">
            Home
          </Link>

          <Link to="/about" className="hover:text-green-400 transition">
            About
          </Link>

          <Link to="/pricing" className="hover:text-green-400 transition">
            Pricing
          </Link>

          <Link to="/contact" className="hover:text-green-400 transition">
            Contact
          </Link>

          <Link to="/dashboard" className="hover:text-green-400 transition">
            Dashboard
          </Link>

          <Link to="/login" className="hover:text-green-400 transition">
            Login
          </Link>

          <Link to="/signup" className="hover:text-green-400 transition">
            Signup
          </Link>

          <button
            onClick={handleLogout}
            className="hover:text-red-400 transition"
          >
            Logout
          </button>

        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (

        <div className="md:hidden flex flex-col px-6 pb-6 space-y-4 text-gray-300">

          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link to="/pricing" onClick={() => setMenuOpen(false)}>
            Pricing
          </Link>

          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>

          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>

          <Link to="/signup" onClick={() => setMenuOpen(false)}>
            Signup
          </Link>

          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="text-left hover:text-red-400 transition"
          >
            Logout
          </button>

        </div>

      )}

    </nav>

  );
}