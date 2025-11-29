import React from 'react';
import { AuthProvider } from './context/AuthContext';
import HomePage from './components/Home';
import AuthModal from './components/AuthModal';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <HomePage />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}

export default App;
