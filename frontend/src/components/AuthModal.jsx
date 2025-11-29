import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login, signup, user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (formData.email && formData.password) {
        login(formData.email, formData.password);
      }
    } else {
      if (formData.name && formData.email && formData.password) {
        signup(formData.name, formData.email, formData.password);
      }
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setFormData({ name: '', email: '', password: '' });
    setError('');
  };

  useEffect(() => {
    if (user) setIsAuthModalOpen(false);
  }, [user]);

  if (!isAuthModalOpen) return null;

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button 
          className="modal-close"
          onClick={() => setIsAuthModalOpen(false)}
        >
          ×
        </button>
        
        <div className="auth-header">
          <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{authMode === 'login' ? 'Sign in to your account' : 'Join IndiaTrip today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="auth-btn">
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          <span>
            {authMode === 'login' 
              ? "Don't have an account?" 
              : "Already have an account?"
            }
          </span>
          <button type="button" onClick={toggleAuthMode} className="toggle-link">
            {authMode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
