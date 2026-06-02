import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (

    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/"
          className="text-3xl font-bold text-green-400"
        >
          MinerClone
        </Link>

        {/* Menu Button */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-green-400 text-3xl"
        >
          ☰
        </button>

      </div>

      {/* Dropdown Menu */}

      {menuOpen && (

        <div className="bg-zinc-900 border-t border-zinc-800 px-6 py-4">

          <div className="flex flex-col gap-4 text-white font-medium">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-green-400"
            >
              Home
            </Link>

            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="hover:text-green-400"
            >
              About
            </Link>

            <Link
              to="/pricing"
              onClick={() => setMenuOpen(false)}
              className="hover:text-green-400"
            >
              Pricing
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="hover:text-green-400"
            >
              Contact
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="hover:text-green-400"
            >
              Dashboard
            </Link>

            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="hover:text-green-400"
            >
              Admin
            </Link>

            <hr className="border-zinc-700" />

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="border border-green-500 text-green-400 text-center py-2 rounded-xl"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="bg-green-500 text-black text-center py-2 rounded-xl font-bold"
            >
              Sign Up
            </Link>

          </div>

        </div>

      )}

    </nav>

  );

}