// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import {
    getAuth,
GoogleAuthProvider,
signInWithPopup // 🔥 обов'язково додати цей імпорт!
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8p9fotwB6PaPY5Dd9QMuT-JJ5u4sksGU",
    authDomain: "is-demo-a27a0.firebaseapp.com",
    databaseURL: "https://is-demo-a27a0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "is-demo-a27a0",
    storageBucket: "is-demo-a27a0.firebasestorage.app",
    messagingSenderId: "378406934320",
    appId: "1:378406934320:web:b0dfc06ae26a17a6e89af5",
    measurementId: "G-46101HHH7Q"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { ref, set, onValue, signInWithPopup };