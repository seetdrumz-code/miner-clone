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

  const [cooldown, setCooldown] = useState(0);
  
  const [dailyCooldown, setDailyCooldown] =
  useState(false);

  const [referralCode, setReferralCode] =
  useState("");

  const [referrals, setReferrals] =
  useState(0);

  const [miningPower, setMiningPower] =
  useState(1);
  
  const [achievements, setAchievements] =
  useState([]);
  
  const [dailyStreak, setDailyStreak] =
  useState(1);
  
  const streakRewards = {
  1: 50,
  2: 75,
  3: 100,
  4: 150,
  5: 200,
  6: 300,
  7: 500,
};

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

  setReferralCode(
    data.referralCode || ""
  );

  setReferrals(
    data.referrals || 0
  );

  setMiningPower(
    data.miningPower || 1
  );

  setAchievements(
    data.achievements || []
  );

  setDailyStreak(
    data.dailyStreak || 1
  );

  const lastMine =
    data.lastMineTime || 0;

  const remaining =
    30 -
    Math.floor(
      (Date.now() - lastMine) / 1000
    );

  if (remaining > 0) {

    setCooldown(remaining);

  }

  const lastClaim =
    data.lastDailyClaim || 0;

  const oneDay =
    24 * 60 * 60 * 1000;

  if (
    Date.now() - lastClaim <
    oneDay
  ) {

    setDailyCooldown(true);

  }

}

  // DAILY REWARD CHECK

        const lastClaim =
          data.lastDailyClaim || 0;

        const oneDay =
          24 * 60 * 60 * 1000;

        if (
          Date.now() - lastClaim <
          oneDay
        ) {

          setDailyCooldown(true);

    }

    } catch (error) {

      console.log(error);

    }

    setLoading(false);

  };

  loadData();

}, [user]);

  useEffect(() => {

  if (cooldown <= 0) return;

  const timer = setInterval(() => {

    setCooldown((prev) => {

      if (prev <= 1) {

        clearInterval(timer);

        return 0;

      }

      return prev - 1;

    });

  }, 1000);

  return () => clearInterval(timer);

}, [cooldown]);

  // MINING FUNCTION

  const handleMine = async () => {

  if (!user) return;

  if (cooldown > 0) {

    alert(
      `Wait ${cooldown} seconds before mining again`
    );

    return;

  }

  const minedAmount =
  miningPower * 10;

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

      lastMineTime: Date.now(),

    });

    await checkAchievements(

      newBalance,

      miningPower

    );

    setCooldown(30);

  } catch (error) {

    console.log(error);

    alert("Failed to save mining data");

  }

};

  // DAILY REWARD FUNCTION

  const handleDailyReward = async () => {

  if (!user) return;

  if (dailyCooldown) {

    alert(
      "Daily reward already claimed."
    );

    return;

  }

  const reward =
  streakRewards[dailyStreak] || 50;
  
  const nextStreak =
  dailyStreak >= 7
    ? 1
    : dailyStreak + 1;

    setDailyStreak(nextStreak);

  const newBalance =
    balance + reward;

  const updatedActivities = [

    `🎁 Daily Reward: +${reward} coins`,

    ...activities,

  ];

  setBalance(newBalance);

  setActivities(updatedActivities);

  setDailyCooldown(true);

  try {

    await updateUserData(
      user.uid,
      {
        balance: newBalance,
        activities: updatedActivities,
        lastDailyClaim: Date.now(),
        dailyStreak: nextStreak,
      }
    );

  } catch (error) {

    console.log(error);

  }

};

  // UPGRADEPOWER FUNCTION 
  
  const handleUpgradePower =
  async () => {

    if (!user) return;

    const upgradeCost =
      miningPower * 100;

    if (
      balance < upgradeCost
    ) {

      alert(
        `You need ${upgradeCost} coins`
      );

      return;

    }

    const newBalance =
      balance - upgradeCost;

    const newPower =
      miningPower + 1;

    const updatedActivities = [

      `⚡ Upgraded Mining Power to Level ${newPower}`,

      ...activities,

    ];

    setBalance(newBalance);

    setMiningPower(newPower);

    setActivities(
      updatedActivities
    );

    try {

      await updateUserData(
        user.uid,
        {
          balance:
            newBalance,

          miningPower:
            newPower,

          activities:
            updatedActivities,
        }
      );

      await checkAchievements(

        newBalance,

        newPower

      );

    } catch (error) {

      console.log(error);

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

  // COPY FUNCTION 
  
  const copyReferralCode = () => {

    navigator.clipboard.writeText(
      referralCode
    );

    alert("Referral code copied!");

  };

  // ACHIEVEMENTS CHECKER FUNCTION

  const checkAchievements =
  async (
    currentBalance,
    currentPower
  ) => {

    let newAchievements =
      [...achievements];

    if (
      currentBalance >= 100 &&
      !newAchievements.includes(
        "💰 100 Coins"
      )
    ) {

      newAchievements.push(
        "💰 100 Coins"
      );

    }

    if (
      currentBalance >= 1000 &&
      !newAchievements.includes(
        "🏦 1000 Coins"
      )
    ) {

      newAchievements.push(
        "🏦 1000 Coins"
      );

    }

    if (
      currentPower >= 5 &&
      !newAchievements.includes(
        "⚡ Power Level 5"
      )
    ) {

      newAchievements.push(
        "⚡ Power Level 5"
      );

    }

    if (
      referrals >= 1 &&
      !newAchievements.includes(
        "👥 First Referral"
      )
    ) {

      newAchievements.push(
        "👥 First Referral"
      );

    }

    if (
      newAchievements.length !==
      achievements.length
    ) {

      setAchievements(
        newAchievements
      );

      await updateUserData(
        user.uid,
        {
          achievements:
            newAchievements,
        }
      );

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

      {/* DAILY REWARD */}
  
      <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 mb-6">

        <h2 className="text-2xl font-bold mb-3">

          🎁 Daily Reward

        </h2>

      <button
    onClick={handleDailyReward}
    disabled={dailyCooldown}
    className={`w-full py-3 rounded-xl font-bold ${
      dailyCooldown
        ? "bg-gray-600"
        : "bg-yellow-500 text-black"
    }`}
  >

    {dailyCooldown
      ? "Reward Claimed"
      : "Claim 50 Coins"}

       </button>

     </div>

      {/* DAILY STREAK */}

     <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 mb-6">

  <h2 className="text-2xl font-bold mb-2">

    🔥 Daily Streak

  </h2>

  <p className="text-orange-400 text-xl">

    Day {dailyStreak}

  </p>

  <p className="text-gray-400">

    Next Reward:
    {streakRewards[dailyStreak]}
    Coins

  </p>

</div>

      {/* REFERRAL CARD */}

      <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 mb-6">

        <h2 className="text-2xl font-bold mb-3">

          👥 Referral Program

        </h2>

          <p className="text-gray-400 mb-2">

            Your Referral Code

          </p>

          <div className="bg-zinc-800 p-3 rounded-xl mb-3 flex justify-between items-center">

        <span>{referralCode}</span>

        <button
          onClick={copyReferralCode}
          className="bg-green-500 px-3 py-1 rounded-lg text-black font-bold"
         >
           Copy
         </button>

       </div>

       <p className="text-green-400">

            Total Referrals: {referrals}
  
       </p>

     </div>

      {/* MININGPOWER CARD */}

      <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 mb-6">

        <h2 className="text-2xl font-bold mb-2">

          ⚡ Mining Power

        </h2>

          <p className="text-green-400 mb-2">

            Level {miningPower}

          </p>

        <p className="text-gray-400 mb-4">

          Mine Value:
          {miningPower * 10}
          Coins

        </p>

        <button
          onClick={
            handleUpgradePower
          }
          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold"
      >

          Upgrade Power
          (
          {miningPower * 100}
          Coins)

        </button>

      </div>

      {/* MINE BUTTON */}

      <button
  onClick={handleMine}
  disabled={cooldown > 0}
  className={`w-full py-4 rounded-2xl text-xl font-bold shadow-lg mb-8 transition-all duration-300 ${
    cooldown > 0
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600"
  }`}
>
  {cooldown > 0
    ? `⏳ Wait ${cooldown}s`
    : "⛏ Mine 10 Coins"}
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

      {/* ACHIEVEMENTS CARD UI */}

      <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 mb-8">

  <h2 className="text-2xl font-bold mb-4">

    🏆 Achievements

  </h2>

  {achievements.length === 0 ? (

    <p className="text-gray-500">

      No achievements yet

    </p>

  ) : (

    achievements.map(
      (
        achievement,
        index
      ) => (

        <div
          key={index}
          className="bg-zinc-800 p-3 rounded-xl mb-2"
        >

          {achievement}

        </div>

      )
    )

  )}

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
