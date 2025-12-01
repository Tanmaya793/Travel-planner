import React from 'react';

const SpotCard = ({ spot, onAddTrip }) => {
  // Convert lat/lng to number and check presence
  const lat = spot.lat != null ? Number(spot.lat) : null;
  const lng = spot.lng != null ? Number(spot.lng) : null;

  // Google Maps URL
  const mapsUrl = lat && lng
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : null;

  const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="spot-card">
      <div className="spot-image">
        <img src={spot.image_url} alt={spot.name} loading="lazy" onError={e => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMG;
  }} />
        <div className="spot-map-placeholder">
          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
              title="Open on Google Maps"
              style={{color: "#36bfff", textDecoration: "underline", fontWeight: 700}}
            >
              🗺️ View on Google Maps<br />
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </a>
          ) : (
            <>
              🗺️ Map unavailable<br />
            </>
          )}
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
