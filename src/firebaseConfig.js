// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAuurGLNJyTAqGaXtopfs--iHTtmMDTP8Q",
  authDomain: "meet-and-share-2.firebaseapp.com",
  projectId: "meet-and-share-2",
  storageBucket: "meet-and-share-2.firebasestorage.app",
  messagingSenderId: "270924069972",
  appId: "1:270924069972:web:fa8d3819c48ecff92b81c1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
