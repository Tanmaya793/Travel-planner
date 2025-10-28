import React from 'react';

const TripList = ({ trips, onSelectTrip }) => (
  <div>
    <h2>Your Trips</h2>
    <ul>
      {trips.map(trip => (
        <li key={trip.id} onClick={() => onSelectTrip(trip)}>
          {trip.name} ({trip.startDate} - {trip.endDate})
        </li>
      ))}
    </ul>
  </div>
);

export default TripList;
