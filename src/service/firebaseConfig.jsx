// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDylSBqM58DYUF0KytJbak3z-oiJtEVr14",
  authDomain: "ai-travel-planner-d304f.firebaseapp.com",
  projectId: "ai-travel-planner-d304f",
  storageBucket: "ai-travel-planner-d304f.firebasestorage.app",
  messagingSenderId: "707056872550",
  appId: "1:707056872550:web:c998b0b367779347d911a7",
  measurementId: "G-PCF4TZBY7P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);