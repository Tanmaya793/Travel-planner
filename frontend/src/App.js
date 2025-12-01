import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './components/HomePage'; 
import ExplorePage from './components/ExplorePage';
import MyTripsPage from './components/MyTripsPage';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  
  const navigateToHome = () => setCurrentPage('home');
  const navigateToExplore = () => setCurrentPage('explore');
  const navigateToTrips = () => setCurrentPage('trips');

  return (
    <div className="App">
      <Navbar 
        currentPage={currentPage}
        onNavigateToHome={navigateToHome}
        onNavigateToExplore={navigateToExplore}
        onNavigateToTrips={navigateToTrips}
      />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'explore' && <ExplorePage />}
      {currentPage === 'trips' && <MyTripsPage />}
      
      <AuthModal />
      <Footer />
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
