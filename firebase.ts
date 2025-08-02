// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALpR5LKAq_35_CxwNO_Wattj_e8T_T0IE",
  authDomain: "farachoob-16f70.firebaseapp.com",
  projectId: "farachoob-16f70",
  storageBucket: "farachoob-16f70.firebasestorage.app",
  messagingSenderId: "265326586721",
  appId: "1:265326586721:web:6373eaba78dcd2d8dcf320",
  measurementId: "G-ZYBE4R7FP8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
