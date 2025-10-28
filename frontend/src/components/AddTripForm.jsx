import React, { useState } from 'react';
import { regions } from '../data/regions.jsx';
import styles from './AddTripForm.module.css';
import RegionSelector from './RegionSelector';
import PlaceSelector from './PlaceSelector';

function AddTripForm({ onAddTrip }) {
  const [name, setName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [travelMode, setTravelMode] = useState('');
  const [notes, setNotes] = useState('');

  // Get recommended places based on selected region and place
  const recommendedSpots =
    selectedRegion && selectedPlace
      ? regions[selectedRegion][selectedPlace] || []
      : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRegion || !selectedPlace) {
      alert('Please select both region and place');
      return;
    }
    onAddTrip({
      name,
      region: selectedRegion,
      destination: selectedPlace,
      startDate,
      endDate,
      budget,
      travelMode,
      notes,
    });
    // Reset the form after submission
    setName('');
    setSelectedRegion('');
    setSelectedPlace('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setTravelMode('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Trip</h2>

      <input
        type="text"
        placeholder="Trip Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

      <RegionSelector
        regions={regions}
        selectedRegion={selectedRegion}
        onSelectRegion={region => {
          setSelectedRegion(region);
          setSelectedPlace('');
        }}
      />

      {selectedRegion && (
        <PlaceSelector
          places={Object.keys(regions[selectedRegion])}
          selectedPlace={selectedPlace}
          onSelectPlace={setSelectedPlace}
        />
      )}

      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        required
      />

      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Budget (INR)"
        value={budget}
        onChange={e => setBudget(e.target.value)}
        required
      />

      <select
        value={travelMode}
        onChange={e => setTravelMode(e.target.value)}
        required
      >
        <option value="">Select Travel Mode</option>
        <option value="Train">Train</option>
        <option value="Bus">Bus</option>
        <option value="Flight">Flight</option>
        <option value="Car">Car</option>
      </select>

      <textarea
        placeholder="Notes or Special Requests"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      {recommendedSpots.length > 0 && (
        <div>
          <h3>Recommended Places in {selectedPlace}:</h3>
          <ul>
            {recommendedSpots.map(spot => (
              <li key={spot}>{spot}</li>
            ))}
          </ul>
        </div>
      )}

      <button type="submit">Add Trip</button>
    </form>
  );
}

export default AddTripForm;
