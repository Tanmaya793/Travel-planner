import React from 'react'

const SpotFilter = ({ selectedState, onStateChange, states = [] }) => {
  const totalSpots = states.reduce((sum, s) => sum + (s.spot_count || 0), 0);

  return (
    <div className="filter-container">
      <select
        value={selectedState}
        onChange={(e) => onStateChange(e.target.value)}
        className="state-filter"
      >
        <option value="all">All States ({totalSpots} spots)</option>
        {states.map((state) => (
          <option key={state.id} value={state.name}>
            {state.name} ({state.spot_count || 0} spots)
          </option>
        ))}
      </select>
    </div>
  );
};

export default SpotFilter;