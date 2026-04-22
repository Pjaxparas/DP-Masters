import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAMSB5uI1rY2zEOGTtJN_jgfInPMNm02aA",
    authDomain: "dp-masters.firebaseapp.com",
    projectId: "dp-masters",
    storageBucket: "dp-masters.firebasestorage.app",
    messagingSenderId: "79554677960",
    appId: "1:79554677960:web:8766e1485da4bec2b729fd",
    measurementId: "G-TLS4NQCE6Q"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);