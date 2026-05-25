import { Link } from "react-router-dom";

export default function Navbar() {

  return (

    <nav className="bg-black border-b border-gray-800 px-6 py-4 sticky top-0 z-50">

      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-green-400"
        >
          MinerClone
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 text-white font-medium flex-wrap">

          <Link
            to="/"
            className="hover:text-green-400 transition"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="hover:text-green-400 transition"
          >
            About
          </Link>

          <Link
            to="/pricing"
            className="hover:text-green-400 transition"
          >
            Pricing
          </Link>

          <Link
            to="/contact"
            className="hover:text-green-400 transition"
          >
            Contact
          </Link>

          <Link
            to="/dashboard"
            className="hover:text-green-400 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/admin"
            className="hover:text-green-400 transition"
          >
            Admin
          </Link>

        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">

          <Link
            to="/login"
            className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition px-5 py-2 rounded-2xl font-bold"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-green-500 hover:bg-green-400 text-black transition px-5 py-2 rounded-2xl font-bold"
          >
            Sign Up
          </Link>

        </div>

      </div>

    </nav>

  );

}