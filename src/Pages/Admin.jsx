import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

import db from "../firestore";

export default function Admin() {

  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {

    fetchWithdrawals();

  }, []);

  async function fetchWithdrawals() {

    const snapshot = await getDocs(
      collection(db, "withdrawals")
    );

    const data =
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    setWithdrawals(data.reverse());

  }

  async function updateStatus(id, status) {

    const withdrawalRef =
      doc(db, "withdrawals", id);

    await updateDoc(withdrawalRef, {
      status
    });

    fetchWithdrawals();

  }

  return (

    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold text-green-400 mb-10">
        Admin Dashboard
      </h1>

      <div className="space-y-6">

        {withdrawals.map((item) => (

          <div
            key={item.id}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-6"
          >

            <p className="font-bold break-all">
              {item.walletAddress}
            </p>

            <p className="text-gray-400 mt-2">
              Amount: ${item.amount}
            </p>

            <p className="text-yellow-400 mt-2 font-bold">
              {item.status}
            </p>

            <div className="flex gap-4 mt-6">

              <button
                onClick={() =>
                  updateStatus(
                    item.id,
                    "Approved"
                  )
                }
                className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-2xl"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    item.id,
                    "Rejected"
                  )
                }
                className="bg-red-500 hover:bg-red-400 text-black font-bold px-6 py-3 rounded-2xl"
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}