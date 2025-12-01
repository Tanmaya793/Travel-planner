import React from 'react';
import Navbar from './Navbar';
import DestinationCard from './DestinationCard';
import TopRatedSpots from './TopRatedSpots';

const HomePage = () => {

  return (
    <div className="home-page">
      
      <section className="hero">
        <div className="hero-content">
          <h1>Discover & Plan Unforgettable Trips Across India</h1>
          <p>
            Explore 200+ tourist destinations, create personalized itineraries, 
            and plan your perfect trip with smart budget suggestions.
          </p>
          <div className="hero-stats">
            <div><span>28</span> States</div>
            <div><span>8</span> Union Territories</div>
            <div><span>250+</span> Attractions</div>
          </div>
        </div>
      </section>

      <TopRatedSpots />


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
