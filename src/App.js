// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Home from './pages/Home';
import Dashboard from './components/Dashboard';
import MeetingRoom from './components/MeetingRoom';
import Login from './components/Login';
import Navbar from './components/Navbar'; // Import the Navbar component

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <Navbar /> {/* Navbar displayed on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/meeting"
          element={user ? <MeetingRoom /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
