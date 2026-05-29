import { db } from "./firebase";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// SAVE USER DATA

export const saveUserData = async (
  userId,
  data
) => {

  try {

    await setDoc(
      doc(db, "users", userId),
      data,
      { merge: true }
    );

  } catch (error) {

    console.log(error);

  }

};

// GET USER DATA

export const getUserData = async (
  userId
) => {

  try {

    const docRef = doc(
      db,
      "users",
      userId
    );

    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {

      return snapshot.data();

    }

  } catch (error) {

    console.log(error);

  }

};

// UPDATE USER DATA

export const updateUserData = async (
  userId,
  data
) => {

  try {

    const docRef = doc(
      db,
      "users",
      userId
    );

    await updateDoc(docRef, data);

  } catch (error) {

    console.log(error);

  }

};

// IMPORTANT

export default db;
