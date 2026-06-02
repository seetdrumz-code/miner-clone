import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Leaderboard() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const snapshot = await getDocs(
          collection(db, "users")
        );

        const data = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        data.sort(
          (a, b) =>
            (b.balance || 0) -
            (a.balance || 0)
        );

        setUsers(data);

      } catch (error) {

        console.log(error);

      }

      setLoading(false);

    };

    fetchUsers();

  }, []);

  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Loading Leaderboard...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-black text-white p-5">

      <h1 className="text-4xl font-bold text-green-500 mb-8">

        🏆 Leaderboard

      </h1>

      <div className="space-y-4">

        {users.map((user, index) => (

          <div
            key={user.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center"
          >

            <div>

              <h2 className="font-bold text-lg">

                #{index + 1}

              </h2>

              <p className="text-gray-400">

                {user.email}

              </p>

            </div>

            <div className="text-green-400 font-bold text-xl">

              {user.balance || 0}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}
