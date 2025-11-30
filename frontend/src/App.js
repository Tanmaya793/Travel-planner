import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './components/Home'; 
import ExplorePage from './components/ExplorePage';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import './App.css';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  
  const navigateToHome = () => setCurrentPage('home');
  const navigateToExplore = () => setCurrentPage('explore');

  return (
    <div className="App">
      <Navbar 
        currentPage={currentPage}
        onNavigateToHome={navigateToHome}
        onNavigateToExplore={navigateToExplore}
      />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'explore' && <ExplorePage />}
      
      <AuthModal />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
