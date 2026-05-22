import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAuth,
  signInWithEmailAndPassword
} from "firebase/auth";

import app from "../firebase";

const auth = getAuth(app);

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {

    e.preventDefault();

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/dashboard");

    } catch (error) {

      alert(error.message);

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      <form
        onSubmit={handleLogin}
        className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-md"
      >

        <h1 className="text-4xl font-bold text-green-400 mb-8">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-black border border-gray-700 rounded-xl p-4 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-black border border-gray-700 rounded-xl p-4 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition"
        >
          Login
        </button>

      </form>

    </div>
  );
}