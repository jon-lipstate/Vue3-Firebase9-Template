// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCMlK-dXM1UDIsfC7B4_bc8ILQvvJL-KU0",
  authDomain: "lipstate-595c3.firebaseapp.com",
  projectId: "lipstate-595c3",
  storageBucket: "lipstate-595c3.appspot.com",
  messagingSenderId: "485156552856",
  appId: "1:485156552856:web:9bd94cdede7292206b10ed",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firebase auth
const auth = getAuth();
const functions = getFunctions();
const storage = getStorage();
const db = getFirestore(app);

export { app, auth, functions, storage, db };
