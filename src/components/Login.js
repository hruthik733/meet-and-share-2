// src/components/Login.js
import React from 'react';
import { auth, provider, db } from '../firebaseConfig'; // Updated path
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function Login() {
  const handleLogin = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Log user info to the console (for verification)
      console.log("User Info:", user);

      // Store user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: new Date(),
      });

      alert(`Welcome ${user.displayName}! You are successfully signed in.`);
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Error signing in. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Sign in to Meet & Share</h2>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}

export default Login;
