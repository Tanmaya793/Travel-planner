import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SpotFilter from './SpotFilter';
import SpotCard from './SpotCard';
import AddTripModal from './AddTripModal';

const ExplorePage = () => {
  const { user, fetchUserTrips } = useAuth();
  const [selectedState, setSelectedState] = useState('all');
  const [spots, setSpots] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showAddTripModal, setShowAddTripModal] = useState(false);

  // Fetch real data from MySQL
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setLoading(true);
        const url = `http://localhost:5000/api/spots?state=${selectedState}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
          setSpots(data);
        } else {
          console.error('Failed to fetch spots:', data.error);
        }
      } catch (err) {
        console.error('Network error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, [selectedState]);

  // Fetch states for filter
  useEffect(() => {
    const fetchStates = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/states');
            const data = await res.json();
            console.log('States API response:', data); // ← check this in console
            if (res.ok) {
                setStates(data);
            } else {
                console.error('States fetch failed:', data.error);
            }
        } catch (err) {
            console.error('States network error:', err);
        }
    };

    fetchStates();
    }, []);


  const handleAddTrip = (spot) => {
    if (!user) {
      alert('Please login to save trips!');
      return;
    }
    setSelectedSpot(spot);
    setShowAddTripModal(true);
  };

  if (loading) {
    return <div className="loading">Loading spots from database...</div>;
  }

  const totalSpots = spots.length;           // current filtered list
  const totalStates = states.length;         // total states & UTs from backend

  let headerText;

  if (selectedState === 'all') {
    headerText = `${totalSpots} tourist spots across ${totalStates} states & UTs`;
  } else {
    headerText = `Amazing ${totalSpots} spot${totalSpots !== 1 ? 's' : ''} from ${selectedState} for you!`;
  }


  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1>Explore India</h1>
        <p>{headerText}</p>
      </div>

      <SpotFilter 
        selectedState={selectedState} 
        onStateChange={setSelectedState}
        states={states}
      />

      <div className="spots-grid">
        {spots.length === 0 ? (
          <p className="no-spots">No spots found for "{selectedState}". Try another state!</p>
        ) : (
          spots.map(spot => (
            <SpotCard 
              key={spot.id}
              spot={spot}
              onAddTrip={handleAddTrip}
            />
          ))
        )}
      </div>

      {selectedSpot && (
        <AddTripModal
          isOpen={showAddTripModal}
          onClose={() => setShowAddTripModal(false)}
          spot={selectedSpot}
          onTripSaved={fetchUserTrips}
        />
      )}
    </div>
  );
};

export default ExplorePage;
