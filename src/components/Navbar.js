// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS for Navbar

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Meet & Share</h1>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/meeting" className="nav-link">Meeting Room</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
