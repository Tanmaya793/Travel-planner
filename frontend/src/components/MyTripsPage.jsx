import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TripCountdown from './TripCountdown';

const MyTripsPage = () => {
  const { token, userTrips, fetchUserTrips } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Delete this trip?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchUserTrips();
        alert('✅ Trip deleted');
      }
    } catch (err) {
      alert('❌ Failed to delete trip');
    }
  };

  const getEndDate = (startDate, days) => {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
    return end.toISOString().split('T')[0];
  };

  if (loading) {
    return <div className="loading">Loading your trips...</div>;
  }

  return (
    <div className="my-trips-page">
      <div className="trips-header">
        <h1>My Trips</h1>
        <p>Manage and track your upcoming adventures</p>
      </div>

      {userTrips.length === 0 ? (
        <div className="no-trips">
          <p>🎒 No trips planned yet</p>
          <p>Go to Explore section and add your first trip!</p>
        </div>
      ) : (
        <div className="trips-container">
          {userTrips.map(trip => (
            <div key={trip.id} className="trip-card">
              <div className="trip-header">
                <h3>{trip.title}</h3>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteTrip(trip.id)}
                  title="Delete trip"
                >
                  🗑️
                </button>
              </div>

              <div className="trip-details">
                <p>
                  <strong>📅 Dates:</strong> {trip.start_date} to {getEndDate(trip.start_date, trip.days || 1)}
                </p>
                <p>
                  <strong>👥 Members:</strong> {trip.members || 1}
                </p>
                <p>
                  <strong>⏱️ Days:</strong> {trip.days || 1} days
                </p>
                <p>
                  <strong>💰 Per Day Cost:</strong> ₹{Number(trip.per_day_cost || 0).toLocaleString()}
                </p>
                <p>
                  <strong>💵 Total Cost:</strong> ₹{Number(trip.total_cost || 0).toLocaleString()}
                </p>
              </div>

              <TripCountdown startDate={trip.start_date} tripTitle={trip.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTripsPage;
