import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Admin = () => {

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

        Loading Admin Panel...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-black text-white p-5">

      <h1 className="text-4xl font-bold text-green-500 mb-6">

        Admin Dashboard

      </h1>

      <p className="text-gray-400 mb-8">

        Total Users: {users.length}

      </p>

      <div className="space-y-4">

        {users.map((user) => (

          <div
            key={user.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >

            <p>

              <strong>Email:</strong>{" "}
              {user.email}

            </p>

            <p>

              <strong>Balance:</strong>{" "}
              {user.balance || 0}

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

          </div>

        ))}

      </div>

    </div>

  );

};

export default Admin;
