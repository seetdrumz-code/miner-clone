import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA31H33yOL83kwQjHJpNYAhSRSCJMMF6wE",
  authDomain: "minerclone2.firebaseapp.com",
  projectId: "minerclone2",
  storageBucket: "minerclone2.firebasestorage.app",
  messagingSenderId: "131190040348",
  appId: "1:131190040348:web:3761a076a1d35ea62dbcd9"
};

const app = initializeApp(firebaseConfig);

// AUTH

export const auth = getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();

// FIRESTORE

export const db =
  getFirestore(app);

export default app;
