import React from 'react';
import Navbar from './Navbar';
import DestinationCard from './DestinationCard';
import { featuredDestinations } from '../data/featuredDestinations';

const HomePage = () => {
  const handleDestinationClick = (destinationId) => {
    console.log(`Clicked destination: ${destinationId}`);
    const destination = featuredDestinations.find(d => d.id === destinationId);
    alert(`Opening ${destination?.title}! (Next: detailed view - what should happen?)`);
  };

  return (
    <div className="home-page">
      
      <section className="hero">
        <div className="hero-content">
          <h1>Discover & Plan Unforgettable Trips Across India</h1>
          <p>
            Explore 100+ tourist destinations, create personalized itineraries, 
            and plan your perfect trip with smart budget suggestions.
          </p>
          <div className="hero-stats">
            <div><span>28</span> States</div>
            <div><span>500+</span> Cities</div>
            <div><span>5000+</span> Attractions</div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2>Featured Destinations</h2>
          <p>Click to explore and start planning your adventure</p>
          
          <div className="destinations-grid">
            {featuredDestinations.map(destination => (
              <DestinationCard 
                key={destination.id} 
                destination={destination}
                onClick={handleDestinationClick}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="about-grid">
            <div className="about-step">
              <h3>1. Explore</h3>
              <p>Browse states, cities & attractions with photos and details</p>
            </div>
            <div className="about-step">
              <h3>2. Plan</h3>
              <p>Add destinations to your trip with dates & budget</p>
            </div>
            <div className="about-step">
              <h3>3. Travel</h3>
              <p>Get itinerary, packing list & real-time updates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
