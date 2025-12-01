import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode, 
    login, 
    signup, 
    user, 
    loading,        // ← NEW
    error           // ← NEW
  } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authMode === 'login') {
      await login(formData.email, formData.password);
    } else {
      await signup(formData.name, formData.email, formData.password);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setFormData({ name: '', email: '', password: '' });
  };

  useEffect(() => {
    if (user) setIsAuthModalOpen(false);
  }, [user, setIsAuthModalOpen]);

  useEffect(() => {
  if (isAuthModalOpen) {
    setFormData({ name: '', email: '', password: '' });
  }
}, [isAuthModalOpen]);

  useEffect(() => {
  if (!user) {
    setFormData({ name: '', email: '', password: '' });
  }
}, [user]);


  if (!isAuthModalOpen) return null;

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button 
          className="modal-close"
          onClick={() => setIsAuthModalOpen(false)}
          disabled={loading}  // ← NEW: Disable during loading
        >
          ×
        </button>
        
        <div className="auth-header">
          <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{authMode === 'login' ? 'Sign in to your account' : 'Join IndiaTrip today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          {authMode === 'signup' && (
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                autoComplete="off"
                disabled={loading}  // ← NEW
              />
            </div>
          )}
          
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              autoComplete="off"
              disabled={loading}  // ← NEW
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength="6"
              autoComplete="off"
              disabled={loading}  // ← NEW
            />
          </div>

          {/* CONTEXT ERROR - Always shows */}
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}  // ← NEW: Disable button
          >
            {loading ? (
              <span>⏳ {authMode === 'login' ? 'Signing In...' : 'Creating...'}</span>
            ) : (
              authMode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <span>
            {authMode === 'login' 
              ? "Don't have an account?" 
              : "Already have an account?"
            }
          </span>
          <button 
            type="button" 
            onClick={toggleAuthMode} 
            className="toggle-link"
            disabled={loading}  // ← NEW
          >
            {authMode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
