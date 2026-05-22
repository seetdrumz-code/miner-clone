import { useEffect, useState } from "react";

import { getAuth } from "firebase/auth";

import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  addDoc
} from "firebase/firestore";

import app from "../firebase";
import db from "../firestore";

const auth = getAuth(app);

export default function Dashboard() {

  const [userEmail, setUserEmail] = useState("");

  const [balance, setBalance] = useState(0);

  const [miningPower, setMiningPower] = useState(0);

  const [isMining, setIsMining] = useState(false);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {

    async function fetchUserData() {

      const user = auth.currentUser;

      if (user) {

        setUserEmail(user.email);

        const docRef = doc(db, "users", user.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

          const data = docSnap.data();

          setBalance(data.balance);

          setMiningPower(data.miningPower);

        }

      }

    }

    fetchUserData();

  }, []);

  useEffect(() => {

    async function fetchTransactions() {

      const user = auth.currentUser;

      if (!user) return;

      const snapshot = await getDocs(
        collection(db, "transactions")
      );

      const userTransactions =
        snapshot.docs
          .map(doc => doc.data())
          .filter(
            tx => tx.userId === user.uid
          );

      setTransactions(userTransactions.reverse());

    }

    fetchTransactions();

  }, [balance]);

  useEffect(() => {

    if (!isMining) return;

    const interval = setInterval(async () => {

      const user = auth.currentUser;

      if (!user) return;

      const newBalance = balance + 10;

      const newMiningPower = miningPower + 1;

      setBalance(newBalance);

      setMiningPower(newMiningPower);

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        balance: newBalance,
        miningPower: newMiningPower
      });

      await addDoc(
        collection(db, "transactions"),
        {
          userId: user.uid,
          type: "Mining Reward",
          amount: 10,
          createdAt: new Date()
        }
      );

    }, 3000);

    return () => clearInterval(interval);

  }, [isMining, balance, miningPower]);

  function startMining() {

    setIsMining(true);

  }

  return (

    <div className="p-6">

      <h1 className="text-4xl font-bold text-green-400">
        Dashboard
      </h1>

      <p className="text-gray-400 mt-2">
        Welcome back
      </p>

      {/* Account Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mt-8">

        <h2 className="text-2xl font-bold text-green-400">
          Account Info
        </h2>

        <div className="mt-6 space-y-4">

          <div>

            <p className="text-gray-400">
              Logged In Email
            </p>

            <p className="text-xl font-bold">
              {userEmail}
            </p>

          </div>

        </div>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

          <h2 className="text-gray-400">
            Balance
          </h2>

          <p className="text-3xl font-bold mt-4 text-green-400">
            ${balance}
          </p>

        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

          <h2 className="text-gray-400">
            Users
          </h2>

          <p className="text-3xl font-bold mt-4 text-green-400">
            10,248
          </p>

        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">

          <h2 className="text-gray-400">
            Mining Power
          </h2>

          <p className="text-3xl font-bold mt-4 text-green-400">
            {miningPower} TH/s
          </p>

        </div>

      </div>

      {/* Mining Button */}
      <div className="mt-10">

        <button
          onClick={startMining}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-2xl transition"
        >
          {isMining ? "Mining..." : "Start Mining"}
        </button>

      </div>

      {/* Transactions */}
      <div className="mt-12">

        <h2 className="text-2xl font-bold text-green-400 mb-6">
          Recent Activity
        </h2>

        <div className="space-y-4">

          {transactions.map((tx, index) => (

            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex justify-between"
            >

              <div>

                <p className="font-bold">
                  {tx.type}
                </p>

                <p className="text-gray-400 text-sm">
                  Reward Added
                </p>

              </div>

              <p className="text-green-400 font-bold">
                +${tx.amount}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}