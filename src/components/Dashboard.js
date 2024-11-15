import React from 'react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

function Dashboard() {
  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div>
      <h2>Welcome to Meet & Share!</h2>
      <nav>
        <Link to="/meeting">Join a Meeting</Link>
        <button onClick={handleSignOut}>Sign Out</button>
      </nav>
    </div>
  );
}

export default Dashboard;
