import React from 'react';
import { useAuth } from '../context/AuthContext';
import wwLogo from '../WW.png';

const Navbar = ({ currentPage, onNavigateToHome, onNavigateToExplore, onNavigateToTrips }) => {
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

  const handleLogout = async () => {
    try {
      logout();
      onNavigateToHome && onNavigateToHome();
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src={wwLogo} alt="Weekend-Wonders" className="nav-logo-img" />
        <span className="nav-logo-text">Weekend‑Wonders</span>
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
            <li><a href="#trips" className={currentPage === 'trips' ? 'active' : ''}
              onClick={(e) => handleNavClick(e, onNavigateToTrips)} >My Trips</a></li>
            <li>
              <span className="user-welcome">Hi, {user.name}!</span>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
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
