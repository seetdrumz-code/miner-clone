import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhKtij3t7RAUJnJtl48GFDw0UY73v5CUA",
  authDomain: "minerclone.firebaseapp.com",
  projectId: "minerclone",
  storageBucket: "minerclone.firebasestorage.app",
  messagingSenderId: "778073921350",
  appId: "1:778073921350:web:3e147b89d5a65979dbb747"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
