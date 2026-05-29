import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  getUserData,
  updateUserData,
} from "../firestore";

const Dashboard = () => {

  const user = auth.currentUser;

  const [balance, setBalance] = useState(0);

  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  // LOAD USER DATA

  useEffect(() => {

    const loadData = async () => {

      if (!user) return;

      try {

        const data = await getUserData(user.uid);

        if (data) {

          setBalance(data.balance || 0);

          setActivities(data.activities || []);

        }

      } catch (error) {

        console.log(error);

      }

      setLoading(false);

    };

    loadData();

  }, [user]);

  // MINING FUNCTION

  const handleMine = async () => {

    if (!user) return;

    const minedAmount = 10;

    const newBalance = balance + minedAmount;

    const updatedActivities = [

      `Mined ${minedAmount} coins at ${new Date().toLocaleTimeString()}`,

      ...activities,

    ];

    // UPDATE UI

    setBalance(newBalance);

    setActivities(updatedActivities);

    // SAVE TO FIRESTORE

    try {

      await updateUserData(user.uid, {

        balance: newBalance,

        activities: updatedActivities,

      });

      console.log("Saved successfully");

    } catch (error) {

      console.log(error);

      alert("Failed to save data");

    }

  };

  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Loading Dashboard...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-black text-white p-5">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold text-green-500">

            Miner Clone

          </h1>

          <p className="text-gray-400">

            Welcome back {user?.email}

          </p>

        </div>

        <img
          src={
            user?.photoURL ||
            "https://i.pravatar.cc/100"
          }
          alt="profile"
          className="w-14 h-14 rounded-full border-2 border-green-500"
        />

      </div>

      {/* PROFILE CARD */}

      <div className="bg-zinc-900 rounded-3xl p-6 shadow-lg mb-6 border border-zinc-800">

        <h2 className="text-gray-400 mb-2">

          Total Balance

        </h2>

        <h1 className="text-5xl font-bold text-green-400">

          {balance}

        </h1>

        <p className="text-gray-500 mt-2">

          Coins mined successfully
        </p>

      </div>

      {/* MINE BUTTON */}

      <button
        onClick={handleMine}
        className="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 py-4 rounded-2xl text-xl font-bold shadow-lg mb-8"
      >
        ⛏ Mine 10 Coins
      </button>

      {/* ACTIVITIES */}

      <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">

        <h2 className="text-2xl font-bold mb-4">

          Recent Activities
        </h2>

        {activities.length === 0 ? (

          <p className="text-gray-500">

            No mining activities yet.
          </p>

        ) : (

          <div className="space-y-3">

            {activities.map((activity, index) => (

              <div
                key={index}
                className="bg-zinc-800 p-4 rounded-xl text-sm"
              >
                {activity}
              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

};

export default Dashboard;
