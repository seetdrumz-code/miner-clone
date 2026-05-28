import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA31H33yOL83kwQjHJpNYAhSRSCJMMF6wE",
  authDomain: "minerclone2.firebaseapp.com",
  projectId: "minerclone2",
  storageBucket: "minerclone2.firebasestorage.app",
  messagingSenderId: "131190040348",
  appId: "1:131190040348:web:3761a076a1d35ea62dbcd9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
