import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] =
  useState(0);
  const [totalBalance, setTotalBalance] =
  useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] =
  useState(0);
  const [approvedWithdrawals, setApprovedWithdrawals] =
  useState(0);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "users")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(data);
      let balanceSum = 0;
      let pending = 0;
      let approved = 0;

data.forEach((user) => {

  balanceSum +=
    user.balance || 0;

  (user.withdrawals || [])
    .forEach((withdrawal) => {

      if (
        withdrawal.status ===
        "pending"
      ) {

        pending++;

      }

      if (
        withdrawal.status ===
        "approved"
      ) {

        approved++;

      }

    });

});

setTotalUsers(data.length);

setTotalBalance(balanceSum);

setPendingWithdrawals(
  pending
);

setApprovedWithdrawals(
  approved
);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approveWithdrawal = async (
    userId,
    withdrawalIndex
  ) => {
    try {
      const user = users.find(
        (u) => u.id === userId
      );

      const withdrawals = [
        ...(user.withdrawals || []),
      ];

      withdrawals[withdrawalIndex].status =
        "approved";

      await updateDoc(
        doc(db, "users", userId),
        {
          withdrawals,
        }
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectWithdrawal = async (
    userId,
    withdrawalIndex
  ) => {
    try {
      const user = users.find(
        (u) => u.id === userId
      );

      const withdrawals = [
        ...(user.withdrawals || []),
      ];

      withdrawals[withdrawalIndex].status =
        "rejected";

      await updateDoc(
        doc(db, "users", userId),
        {
          withdrawals,
        }
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-5">

      <h1 className="text-4xl font-bold text-green-500 mb-3">
        Admin Dashboard
      </h1>

<div className="grid grid-cols-2 gap-4 mb-8">

  <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">

    <h3 className="text-gray-400">
      Total Users
    </h3>

    <p className="text-3xl font-bold text-green-400">
      {totalUsers}
    </p>

  </div>

  <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">

    <h3 className="text-gray-400">
      Total Coins
    </h3>

    <p className="text-3xl font-bold text-yellow-400">
      {totalBalance}
    </p>

  </div>

  <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">

    <h3 className="text-gray-400">
      Pending
    </h3>

    <p className="text-3xl font-bold text-orange-400">
      {pendingWithdrawals}
    </p>

  </div>

  <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">

    <h3 className="text-gray-400">
      Approved
    </h3>

    <p className="text-3xl font-bold text-blue-400">
      {approvedWithdrawals}
    </p>

  </div>

</div>

      <p className="text-gray-400 mb-8">
        Total Users: {users.length}
      </p>

      <div className="space-y-6">

        {users.map((user) => (
          <div
            key={user.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <h2 className="text-xl font-bold mb-3">
              {user.email}
            </h2>

            <p>
              <strong>Balance:</strong>{" "}
              {user.balance || 0}
            </p>

            <p>
              <strong>Mining Power:</strong>{" "}
              {user.miningPower || 0}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {user.role || "user"}
            </p>

            <p>
              <strong>Activities:</strong>{" "}
              {user.activities?.length || 0}
            </p>

            <p>
              <strong>Withdrawals:</strong>{" "}
              {user.withdrawals?.length || 0}
            </p>

            {user.withdrawals?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-green-400 font-bold mb-2">
                  Withdrawal Requests
                </h3>

                {user.withdrawals.map(
                  (withdrawal, index) => (
                    <div
                      key={index}
                      className="bg-zinc-800 p-3 rounded-xl mb-3"
                    >
                      <p>
                        Amount: {withdrawal.amount}
                      </p>

                      <p>
                        Wallet:{" "}
                        {withdrawal.walletAddress}
                      </p>

                      <p>
                        Status:{" "}
                        {withdrawal.status}
                      </p>

                      {withdrawal.status ===
                        "pending" && (
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={() =>
                              approveWithdrawal(
                                user.id,
                                index
                              )
                            }
                            className="bg-green-600 px-4 py-2 rounded-lg"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              rejectWithdrawal(
                                user.id,
                                index
                              )
                            }
                            className="bg-red-600 px-4 py-2 rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
