import { useEffect, useState } from "react";

import { auth } from "../firebase";

import {
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

import db from "../firestore";

import {
  FaBitcoin,
  FaChartLine,
  FaWallet,
  FaArrowUp,
  FaUserCircle
} from "react-icons/fa";

export default function Dashboard() {

  const [user, setUser] = useState(null);

  const [balance, setBalance] = useState(0);

  const [mining, setMining] = useState(false);

  const [withdrawals, setWithdrawals] = useState([]);

  const [btcPrice, setBtcPrice] = useState(0);

  const [loading, setLoading] = useState(true);

  // LOAD USER DATA

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          if (currentUser) {

            setUser(currentUser);

            const userRef =
              doc(
                db,
                "users",
                currentUser.uid
              );

            const userSnap =
              await getDoc(userRef);

            if (userSnap.exists()) {

              const data =
                userSnap.data();

              setBalance(
                data.balance || 0
              );

              setMining(
                data.mining || false
              );

              setWithdrawals(
                data.withdrawals || []
              );

            } else {

              await setDoc(userRef, {

                balance: 0,

                mining: false,

                withdrawals: []

              });

            }

          }

          setLoading(false);

        }
      );

    return () => unsubscribe();

  }, []);

  // MINING SYSTEM

  useEffect(() => {

    let interval;

    if (mining) {

      interval = setInterval(() => {

        setBalance((prev) =>
          Number((prev + 0.0001).toFixed(4))
        );

      }, 1000);

    }

    return () => clearInterval(interval);

  }, [mining]);

  // SAVE DATA TO FIREBASE

  useEffect(() => {

    async function saveData() {

      if (!user) return;

      const userRef =
        doc(
          db,
          "users",
          user.uid
        );

   try {

      await setDoc(
        userRef,
        {

         balance,
         
          mining,
          
          withdrawals

        },
    { merge: true }
  );

   console.log("Saved successfully");

    } catch (error) {

     console.log(error);

     alert(error.code);

    }
  }

    saveData();

  }, [
    balance,
    mining,
    withdrawals,
    user
  ]);

  // FETCH BTC PRICE

  useEffect(() => {

    async function fetchBTCPrice() {

      try {

        const response = await fetch(
          "https://api.coindesk.com/v1/bpi/currentprice.json"
        );

        const data = await response.json();

        setBtcPrice(
          data.bpi.USD.rate_float.toFixed(2)
        );

      } catch (error) {

        console.log(error);

      }

    }

    fetchBTCPrice();

  }, []);

  // WITHDRAW

  function handleWithdraw() {

    if (balance <= 0) {

      alert("No balance available");

      return;

    }

    const newWithdrawal = {

      amount: balance,

      date: new Date().toLocaleString()

    };

    setWithdrawals([
      newWithdrawal,
      ...withdrawals
    ]);

    setBalance(0);

  }

  // LOGOUT

  async function handleLogout() {

    try {

      await signOut(auth);

    } catch (error) {

      console.log(error);

    }

  }

  // LOADING SCREEN

  if (loading) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center text-green-400 text-3xl font-bold">

        Loading Dashboard...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-black text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

          <div>

            <h1 className="text-5xl font-bold text-green-400">
              Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Welcome back, {user?.email}
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-400 transition px-6 py-3 rounded-2xl font-bold"
          >
            Logout
          </button>

        </div>

        {/* PROFILE CARD */}

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8">

          <div className="flex flex-col md:flex-row items-center gap-6">

            <div className="text-7xl text-green-400">
              <FaUserCircle />
            </div>

            <div className="flex-1 text-center md:text-left">

              <h2 className="text-3xl font-bold text-white">
                {user?.email?.split("@")[0]}
              </h2>

              <p className="text-gray-400 mt-1">
                {user?.email}
              </p>

              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">

                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                  Active Miner
                </span>

                <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm">
                  Level 1
                </span>

                <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm">
                  Verified
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Current Balance
                </p>

                <h2 className="text-4xl font-bold text-green-400 mt-2">
                  {balance} BTC
                </h2>

              </div>

              <FaBitcoin className="text-5xl text-yellow-400" />

            </div>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Bitcoin Price
                </p>

                <h2 className="text-4xl font-bold text-blue-400 mt-2">
                  ${btcPrice}
                </h2>

              </div>

              <FaChartLine className="text-5xl text-blue-400" />

            </div>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Total Withdrawals
                </p>

                <h2 className="text-4xl font-bold text-purple-400 mt-2">
                  {withdrawals.length}
                </h2>

              </div>

              <FaWallet className="text-5xl text-purple-400" />

            </div>

          </div>

        </div>

        {/* MINING CONTROLS */}

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 mb-8">

          <h2 className="text-3xl font-bold mb-6">
            Mining Controls
          </h2>

          <div className="flex flex-wrap gap-4">

            <button
              onClick={() => setMining(true)}
              className="bg-green-500 hover:bg-green-400 transition text-black font-bold px-6 py-4 rounded-2xl"
            >
              Start Mining
            </button>

            <button
              onClick={() => setMining(false)}
              className="bg-red-500 hover:bg-red-400 transition text-white font-bold px-6 py-4 rounded-2xl"
            >
              Stop Mining
            </button>

            <button
              onClick={handleWithdraw}
              className="bg-blue-500 hover:bg-blue-400 transition text-white font-bold px-6 py-4 rounded-2xl flex items-center gap-2"
            >
              <FaArrowUp />
              Withdraw
            </button>

          </div>

        </div>

        {/* WITHDRAWAL HISTORY */}

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">

          <h2 className="text-3xl font-bold mb-6">
            Withdrawal History
          </h2>

          {withdrawals.length === 0 ? (

            <p className="text-gray-400">
              No withdrawals yet.
            </p>

          ) : (

            <div className="space-y-4">

              {withdrawals.map((item, index) => (

                <div
                  key={index}
                  className="bg-black border border-gray-800 rounded-2xl p-4 flex justify-between items-center"
                >

                  <div>

                    <p className="font-bold text-green-400">
                      {item.amount} BTC
                    </p>

                    <p className="text-gray-400 text-sm">
                      {item.date}
                    </p>

                  </div>

                  <FaWallet className="text-2xl text-purple-400" />

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}