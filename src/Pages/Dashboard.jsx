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

  const [withdrawals, setWithdrawals] = useState([]);

  const [walletAddress, setWalletAddress] = useState("");

  const [withdrawAmount, setWithdrawAmount] = useState("");

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

          setWithdrawals(data.withdrawals || []);

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

      `⛏ Mined ${minedAmount} coins at ${new Date().toLocaleTimeString()}`,

      ...activities,

    ];

    setBalance(newBalance);

    setActivities(updatedActivities);

    try {

      await updateUserData(user.uid, {

        balance: newBalance,

        activities: updatedActivities,

      });

    } catch (error) {

      console.log(error);

      alert("Failed to save mining data");

    }

  };

  // WITHDRAWAL FUNCTION

  const handleWithdrawal = async () => {

    if (!user) return;

    if (!walletAddress || !withdrawAmount) {

      alert("Please fill all fields");

      return;

    }

    const amount = Number(withdrawAmount);

    if (amount <= 0) {

      alert("Invalid amount");

      return;

    }

    if (amount > balance) {

      alert("Insufficient balance");

      return;

    }

    const withdrawal = {

      amount,

      walletAddress,

      status: "pending",

      createdAt: new Date().toLocaleString(),

    };

    const updatedBalance = balance - amount;

    const updatedWithdrawals = [

      withdrawal,

      ...withdrawals,

    ];

    setBalance(updatedBalance);

    setWithdrawals(updatedWithdrawals);

    try {

      await updateUserData(user.uid, {

        balance: updatedBalance,

        withdrawals: updatedWithdrawals,

      });

      setWalletAddress("");

      setWithdrawAmount("");

      alert("Withdrawal submitted");

    } catch (error) {

      console.log(error);

      alert("Withdrawal failed");

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

      {/* BALANCE CARD */}

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

      {/* WITHDRAWAL */}

      <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 mb-8">

        <h2 className="text-2xl font-bold mb-4">

          Withdrawal

        </h2>

        <input
          type="text"
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={(e) =>
            setWalletAddress(e.target.value)
          }
          className="w-full p-3 bg-zinc-800 rounded-xl mb-3"
        />

        <input
          type="number"
          placeholder="Amount"
          value={withdrawAmount}
          onChange={(e) =>
            setWithdrawAmount(e.target.value)
          }
          className="w-full p-3 bg-zinc-800 rounded-xl mb-3"
        />

        <button
          onClick={handleWithdrawal}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold"
        >

          Request Withdrawal

        </button>

      </div>

      {/* ACTIVITIES */}

      <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 mb-8">

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

      {/* WITHDRAWAL HISTORY */}

      <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">

        <h2 className="text-2xl font-bold mb-4">

          Withdrawal History

        </h2>

        {withdrawals.length === 0 ? (

          <p className="text-gray-500">

            No withdrawals yet.

          </p>

        ) : (

          withdrawals.map((item, index) => (

            <div
              key={index}
              className="bg-zinc-800 rounded-xl p-4 mb-3"
            >

              <p>

                Amount: {item.amount}

              </p>

              <p>

                Status: {item.status}

              </p>

              <p className="text-sm text-gray-400">

                {item.createdAt}

              </p>

            </div>

          ))

        )}

      </div>

    </div>

  );

};

export default Dashboard;
