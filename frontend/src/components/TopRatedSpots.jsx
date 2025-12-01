import React, { useState, useEffect } from 'react';

const PLACE_QUOTES = [
  "Leave the map, follow your curiosity.",
  "Every corner here has a story to tell.",
  "Slow down and let this place surprise you.",
  "Perfect spot to forget the clock and just be.",
  "Come for the views, stay for the memories.",
  "A moment here feels like a lifetime’s escape.",
  "Some places feel like they were waiting just for you.",
  "Collect moments here, not things.",
  "Breathe in, look around, stay a little longer.",
  "Where the journey feels as beautiful as the destination.",
  "Turn off your phone, turn on your senses.",
  "You’ll remember this sky for a long time."
];

const TopRatedSpots = () => {
  const [topSpots, setTopSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSpots = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/spots/top-rated?limit=12');
        const data = await response.json();
        setTopSpots(data);
      } catch (err) {
        console.error('Failed to fetch top spots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSpots();
  }, []);

  if (loading) return <div className="loading">Finding beautiful places for you...</div>;

  const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=800&q=80';

  return (
    <section className="top-rated-section">
      <div className="container">
        <h2>🌟 Places You’ll Love</h2>
        <p>Handpicked spots that are pure joy to explore</p>
        
        <div className="top-rated-grid">
          {topSpots.map((spot, index) => (
            <React.Fragment key={spot.id}>
              {/* card */}
              <div className="top-rated-card">
                <img src={spot.image_url} alt={spot.name} onError={e => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMG;
  }} />
                <div className="card-body">
                  <h3>{spot.name}</h3>
                  <p className="location">{spot.city}, {spot.state_name}</p>
                  <p className="quote">
                    {PLACE_QUOTES[index % PLACE_QUOTES.length]}
                  </p>
                </div>
              </div>

              {/* break text after 4th spot (index 3) */}
              {index === 3 && (
                <div className="top-rated-break">
                  <h3>Take a pause. Imagine yourself there.</h3>
                  <p>
                    From quiet beaches to misty hills, pick the place that feels like your next escape.
                    Scroll down for more hidden gems waiting for you.
                  </p>
                </div>
              )}
              {index === 7 && (
                <div className="top-rated-break">
                  <h3>Take a pause. Imagine yourself there.</h3>
                  <p>
                    Already found a favorite? Or still browsing vibes? 
                    The next few places might become your new go-to stories.
                  </p>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedSpots;
