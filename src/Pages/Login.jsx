import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect
} from "firebase/auth";

import { auth } from "../firebase";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {

    e.preventDefault();

    setLoading(true);

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/dashboard");

    } catch (error) {

     console.log(error);

     alert(error.code);

    }

    setLoading(false);

  }

  async function handleGoogleLogin() {

    try {

      const provider =
        new GoogleAuthProvider();

      await signInWithRedirect(
        auth,
        provider
      );

      navigate("/dashboard");

    } catch (error) {

     console.log(error);

     alert(error.code);

    }

  }

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">

        {/* Title */}

        <h1 className="text-4xl font-bold text-green-400 text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Login to continue mining crypto
        </p>

        {/* Form */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-4 text-white outline-none focus:border-green-500"
            />

          </div>

          {/* Password */}

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-4 text-white outline-none focus:border-green-500"
            />

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 transition text-black font-bold py-4 rounded-2xl"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        {/* Divider */}

        <div className="flex items-center gap-4 my-6">

          <div className="flex-1 h-px bg-gray-700"></div>

          <span className="text-gray-500 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-700"></div>

        </div>

        {/* Google Login */}

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-gray-200 transition text-black font-bold py-4 rounded-2xl"
        >
          Continue with Google
        </button>

        {/* Signup Link */}

        <p className="text-center text-gray-400 mt-8">

          Don’t have an account?{" "}

          <Link
            to="/signup"
            className="text-green-400 hover:underline"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>

  );

}