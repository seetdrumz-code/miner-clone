import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

import { db } from "./firebase";

// SAVE USER DATA

export const saveUserData = async (
  uid,
  data
) => {

  try {

    await setDoc(
      doc(db, "users", uid),
      data,
      { merge: true }
    );

    console.log("Data saved");

  } catch (error) {

    console.log(error);

  }

};

// GET USER DATA

export const getUserData = async (
  uid
) => {

  try {

    const docRef = doc(
      db,
      "users",
      uid
    );

    const snap = await getDoc(docRef);

    if (snap.exists()) {

      return snap.data();

    } else {

      return null;

    }

  } catch (error) {

    console.log(error);

    return null;

  }

};
