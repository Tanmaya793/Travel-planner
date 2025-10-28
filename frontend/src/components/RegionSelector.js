// /frontend/src/components/RegionSelector.js
import React from 'react';

function RegionSelector({ regions, selectedRegion, onSelectRegion }) {
  return (
    <div>
      <label>Select Region:</label>
      <select value={selectedRegion} onChange={e => onSelectRegion(e.target.value)}>
        <option value="">--Choose a region--</option>
        {Object.keys(regions).map(region => (
          <option key={region} value={region}>{region}</option>
        ))}
      </select>
    </div>
  );
}

export default RegionSelector;
