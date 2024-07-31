// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0TIOBQlwud98-8Lc1K1fVi5gDcD9eq5E",
  authDomain: "pantry-tracker-ffae6.firebaseapp.com",
  projectId: "pantry-tracker-ffae6",
  storageBucket: "pantry-tracker-ffae6.appspot.com",
  messagingSenderId: "617967360444",
  appId: "1:617967360444:web:06e1a889d5bd73249033b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };