import { Navigate } from "react-router-dom";

import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";

import { useEffect, useState } from "react";

import app from "../firebase";

const auth = getAuth(app);

export default function ProtectedRoute({ children }) {

  const [user, setUser] = useState(undefined);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      setUser(currentUser);

    });

    return () => unsubscribe();

  }, []);

  if (user === undefined) {
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}