// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDKsKTZQMOym7j6f9TSCZRCqhRKBfcv5Y",
  authDomain: "mtg-terms.firebaseapp.com",
  databaseURL: "https://mtg-terms-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mtg-terms",
  storageBucket: "mtg-terms.appspot.com",
  messagingSenderId: "596375115322",
  appId: "1:596375115322:web:493a10957afeddb31b8703"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

