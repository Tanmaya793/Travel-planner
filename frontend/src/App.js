// /frontend/src/App.js
import React, { useState } from 'react';
import TripList from './components/TripList';
import AddTripForm from './components/AddTripForm';

function App() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const handleAddTrip = (trip) => {
    setTrips([...trips, { ...trip, id: Date.now() }]);
  };

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
  };

  return (
    <div>
      <h1>India Trip Planner</h1>
      <AddTripForm onAddTrip={handleAddTrip} />
      <TripList trips={trips} onSelectTrip={handleSelectTrip} />
      {selectedTrip && (
        <div>
          <h2>{selectedTrip.name}</h2>
          <p>Destinations: {selectedTrip.destination}</p>
          <p>Dates: {selectedTrip.startDate} to {selectedTrip.endDate}</p>
          <p>Budget: ₹{selectedTrip.budget}</p>
        </div>
      )}
    </div>
  );
}

export default App;
