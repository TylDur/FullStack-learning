import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace this with your actual Firebase config from your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyD6uW_NM43h-AVLPEl0FF_i6vj1JsY7nds",
  authDomain: "budgettracker-7.firebaseapp.com",
  projectId: "budgettracker-7",
  storageBucket: "budgettracker-7.firebasestorage.app",
  messagingSenderId: "463554291315",
  appId: "1:463554291315:web:a9cdceca3bfe00423f6c06",
  measurementId: "G-CXKXPSDCT1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  googleProvider  
};

