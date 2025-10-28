// /frontend/src/components/PlaceSelector.js
import React from 'react';

function PlaceSelector({ places, selectedPlace, onSelectPlace }) {
  return (
    <div>
      <label>Select Place:</label>
      <select value={selectedPlace} onChange={e => onSelectPlace(e.target.value)}>
        <option value="">--Choose a place--</option>
        {places.map(place => (
          <option key={place} value={place}>{place}</option>
        ))}
      </select>
    </div>
  );
}

export default PlaceSelector;
