// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxGRwKLffgvR5j-BVhwMZ7E1TN9F3apV8",
  authDomain: "task-trek-da51b.firebaseapp.com",
  projectId: "task-trek-da51b",
  storageBucket: "task-trek-da51b.appspot.com",
  messagingSenderId: "50127725980",
  appId: "1:50127725980:web:6f08a953e85480b44ed459"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);