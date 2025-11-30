import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage, onNavigateToHome, onNavigateToExplore }) => {
  const { user, logout, setIsAuthModalOpen, setAuthMode } = useAuth();

  const handleAuthClick = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleNavClick = (e, handler) => {
    e.preventDefault();
    if (handler && typeof handler === 'function') {
      handler();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>🇮🇳 IndiaTrip</h2>
      </div>
      <ul className="nav-links">
        <li>
          <a 
            href="#home" 
            className={currentPage === 'home' ? 'active' : ''}
            onClick={(e) => handleNavClick(e, onNavigateToHome)}
          >
            Home
          </a>
        </li>
        <li>
          <a 
            href="#explore"
            className={currentPage === 'explore' ? 'active' : ''}
            onClick={(e) => handleNavClick(e, onNavigateToExplore)}
          >
            Explore
          </a>
        </li>
        {user ? (
          <>
            <li><a href="#trips" className="disabled">My Trips</a></li>
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
            <li><a href="#trips" className="disabled">My Trips</a></li>
            <li>
              <button className="auth-btn-nav" onClick={handleAuthClick}>
                Login
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
