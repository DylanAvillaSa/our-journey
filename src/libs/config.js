import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9z9DsZcLehtOdpd3eG2bPleZeVqZ8uks",
  authDomain: "ecommerce-d6240.firebaseapp.com",
  projectId: "ecommerce-d6240",
  storageBucket: "ecommerce-d6240.firebasestorage.app",
  messagingSenderId: "1098227081870",
  appId: "1:1098227081870:web:1af7ecd10e346002b55fdf",
  measurementId: "G-KMNXPM0039",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
