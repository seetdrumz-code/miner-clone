// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhKtij3t7RAUJnJtl48GFDw0UY73v5CUA",
  authDomain: "minerclone.firebaseapp.com",
  projectId: "minerclone",
  storageBucket: "minerclone.firebasestorage.app",
  messagingSenderId: "778073921350",
  appId: "1:778073921350:web:379621163241cabcdbb747"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;