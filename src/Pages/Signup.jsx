import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  getAuth,
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

import app from "../firebase";
import db from "../firestore";

const auth = getAuth(app);

export default function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] =
  useState("");
  
  const navigate = useNavigate();

  async function handleSignup(e) {

    e.preventDefault();

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          email: email,
          balance: 0,
          miningPower: 0,
          createdAt: new Date(),

          role: "user",
          activities: [],
          withdrawals: [],

          lastMineTime: 0,
          lastDailyClaim: 0,

          referralCode:
            userCredential.user.uid.slice(0, 6),

          referredBy: referralCode || "",

          referrals: 0
        }
      );

      navigate("/dashboard");

    } catch (error) {

      alert(error.message);

    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center px-6">

      <form
        onSubmit={handleSignup}
        className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-md"
      >

        <h1 className="text-4xl font-bold text-green-400 mb-8">
          Create Account
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

        <input
          type="text"
          placeholder="Referral Code (Optional)"
          className="w-full bg-black border border-gray-700 rounded-xl p-4 mb-6"
          value={referralCode}
          onChange={(e) =>
            setReferralCode(e.target.value)
          }
        />

        <button
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition"
        >
          Sign Up
        </button>

      </form>

    </div>

  );
}
