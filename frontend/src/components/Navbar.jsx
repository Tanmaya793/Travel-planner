import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, setIsAuthModalOpen, setAuthMode } = useAuth();

  const handleAuthClick = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>🇮🇳 IndiaTrip</h2>
      </div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#explore">Explore</a></li>
        {user ? (
          <>
            <li><a href="#trips">My Trips</a></li>
            <li>
              <span className="user-welcome">Hi, {user.name}!</span>
            </li>
            <li>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><a href="#trips">My Trips</a></li>
            <li><button className="auth-btn-nav" onClick={handleAuthClick}>Login</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
