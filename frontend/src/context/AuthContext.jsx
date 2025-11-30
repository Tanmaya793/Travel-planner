import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userTrips, setUserTrips] = useState([]);

  // Check token on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      fetchUserTrips(); // Load trips on startup
    }
  }, []);

  // Fetch user trips
  const fetchUserTrips = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const trips = await response.json();
        setUserTrips(trips);
      }
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      
      // Success
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
      fetchUserTrips(); // Load trips after login
    } catch (err) {
      setError('Network error - check backend');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }
      
      // Auto-login after signup
      await login(email, password);
    } catch (err) {
      setError('Signup failed - network error');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserTrips([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user, 
      token, 
      login, 
      signup, 
      logout, 
      isAuthModalOpen, 
      setIsAuthModalOpen,
      authMode, 
      setAuthMode, 
      loading, 
      error, 
      setError,
      userTrips, 
      setUserTrips,
      fetchUserTrips
    }}>
      {children}
    </AuthContext.Provider>
  );
};
