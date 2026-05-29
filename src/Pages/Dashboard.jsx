import { useEffect, useState } from "react";

import { auth } from "../firebase";

import { saveUserData } from "../firestore";

import {
  FaBitcoin,
  FaPlay,
  FaWallet,
  FaChartLine,
  FaUserCircle,
} from "react-icons/fa";

export default function Dashboard() {

  const [balance, setBalance] = useState(100);

  const [mining, setMining] = useState(false);

  const [username, setUsername] = useState("Miner");

  // SAVE TO FIRESTORE

  useEffect(() => {

    if (auth.currentUser) {

      saveUserData(
        auth.currentUser.uid,
        {

          name:
            auth.currentUser.displayName ||
            "User",

          email:
            auth.currentUser.email,

          balance,

          mining,

          updatedAt: Date.now(),

        }
      );

    }

  }, [balance, mining]);

  // LOAD USER INFO

  useEffect(() => {

    if (auth.currentUser) {

      setUsername(
        auth.currentUser.displayName ||
        auth.currentUser.email
      );

    }

  }, []);

  // MINING SYSTEM

  useEffect(() => {

    let interval;

    if (mining) {

      interval = setInterval(() => {

        setBalance((prev) =>
          Number((prev + 0.5).toFixed(2))
        );

      }, 3000);

    }

    return () => clearInterval(interval);

  }, [mining]);

  return (

    <div className="min-h-screen bg-black text-white p-5">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold text-green-400">

            Dashboard

          </h1>

          <p className="text-gray-400">

            Welcome back

          </p>

        </div>

        <FaUserCircle className="text-5xl text-green-400" />

      </div>

      {/* PROFILE CARD */}

      <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-3xl p-6 mb-6 shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-white/80">

              Logged in as

            </p>

            <h2 className="text-2xl font-bold">

              {username}

            </h2>

          </div>

          <FaBitcoin className="text-5xl text-yellow-300" />

        </div>

      </div>

      {/* BALANCE CARD */}

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-gray-400">

              Total Balance

            </p>

            <h1 className="text-4xl font-bold text-green-400 mt-2">

              ${balance}

            </h1>

          </div>

          <div className="bg-green-500/20 p-4 rounded-2xl">

            <FaWallet className="text-3xl text-green-400" />

          </div>

        </div>

      </div>

      {/* MINING CARD */}

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-6">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-2xl font-bold">

              Mining Status

            </h2>

            <p className="text-gray-400">

              Earn crypto automatically

            </p>

          </div>

          <FaChartLine className="text-4xl text-green-400" />

        </div>

        <button
          onClick={() =>
            setMining(!mining)
          }
          className={`w-full py-4 rounded-2xl font-bold text-lg transition ${
            mining
              ? "bg-red-500 hover:bg-red-400"
              : "bg-green-500 hover:bg-green-400 text-black"
          }`}
        >

          <div className="flex items-center justify-center gap-3">

            <FaPlay />

            {mining
              ? "Stop Mining"
              : "Start Mining"}

          </div>

        </button>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5">

          <p className="text-gray-400 mb-2">

            Mining Speed

          </p>

          <h2 className="text-2xl font-bold text-green-400">

            0.5 BTC
          </h2>

        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5">

          <p className="text-gray-400 mb-2">

            Status

          </p>

          <h2 className="text-2xl font-bold text-yellow-400">

            {mining
              ? "Active"
              : "Offline"}

          </h2>

        </div>

      </div>

    </div>

  );

}
