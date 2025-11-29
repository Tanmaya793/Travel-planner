import React from 'react';

const DestinationCard = ({ destination, onClick }) => {
  return (
    <div 
      className="destination-card"
      onClick={() => onClick(destination.id)}
      role="button"
      tabIndex={0}
    >
      <div className="destination-image">
        <img src={destination.image} alt={destination.title} loading="lazy" />
      </div>
      <div className="destination-content">
        <h3>{destination.title}</h3>
        <p className="subtitle">{destination.subtitle}</p>
        <p>{destination.description}</p>
        <div className="explore-btn">Explore →</div>
      </div>
    </div>
  );
};

export default DestinationCard;
