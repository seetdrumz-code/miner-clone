import { Navigate } from "react-router-dom";

import { getAuth } from "firebase/auth";

import app from "../firebase";

const auth = getAuth(app);

export default function AdminRoute({ children }) {

  const user = auth.currentUser;

  const adminEmail =
    "seetdrumz@gmail.com";

  if (!user) {

    return <Navigate to="/login" />;

  }

  if (user.email !== adminEmail) {

    return <Navigate to="/dashboard" />;

  }

  return children;

}