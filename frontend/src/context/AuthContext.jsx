import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  useEffect(() => {
    // Check localStorage for persisted login
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
    
        if (!response.ok) {
            console.error(data.error);
            return;
        }
    
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAuthModalOpen(false);
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

  const signup = async (name, email, password) => {
    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
    
        if (!response.ok) {
            console.error(data.error);
            return;
        }
    
        await login(email, password);
        } catch (err) {
            console.error('Signup failed:', err);
        }
    };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const [userTrips, setUserTrips] = useState([]);

  return (
    <AuthContext.Provider value={{
        user, login, signup, logout, isAuthModalOpen, setIsAuthModalOpen,
        authMode, setAuthMode, userTrips, setUserTrips, token: localStorage.getItem('token')
    }}>
        {children}
    </AuthContext.Provider>
    );
};
