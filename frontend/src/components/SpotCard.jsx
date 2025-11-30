import React from 'react';

const SpotCard = ({ spot, onAddTrip }) => {
  const lat = spot.lat != null ? Number(spot.lat) : null;
  const lng = spot.lng != null ? Number(spot.lng) : null;

  return (
    <div className="spot-card">
      <div className="spot-image">
        <img src={spot.image_url} alt={spot.name} loading="lazy" />
        <div className="spot-map-placeholder">
          🗺️ Google Maps<br />
          {lat !== null && lng !== null
            ? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
            : 'Location not available'}
        </div>
      </div>
      <div className="spot-content">
        <h3>{spot.name}</h3>
        <p className="spot-city">{spot.city}, {spot.state_name}</p>
        <p className="spot-desc">{spot.description}</p>
        <div className="spot-cost">
          <span className="cost">₹{Number(spot.daily_cost || 0).toLocaleString()}/day</span>
        </div>
        <button className="add-trip-btn" onClick={() => onAddTrip(spot)}>
          + Add to Trip
        </button>
      </div>
    </div>
  );
};

export default SpotCard;
