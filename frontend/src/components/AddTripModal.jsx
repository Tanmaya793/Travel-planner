import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AddTripModal = ({ isOpen, onClose, spot }) => {
  const { token, fetchUserTrips } = useAuth();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    budget: spot?.daily_cost ? spot.daily_cost * 3 : 5000, // Default 3 days
    reminderEmail: ''
  });
  const [loading, setLoading] = useState(false);

  // Reset form when spot changes
  useEffect(() => {
    if (spot) {
      setFormData({
        startDate: '',
        endDate: '',
        budget: spot.daily_cost ? spot.daily_cost * 3 : 5000,
        reminderEmail: ''
      });
    }
  }, [spot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `${spot.name} Trip`,
          destinations: [spot],
          start_date: formData.startDate,
          end_date: formData.endDate,
          budget: parseFloat(formData.budget)
        })
      });

      if (response.ok) {
        await fetchUserTrips(); // Refresh trips list
        onClose();
        alert('✅ Trip saved to MySQL database!');
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Failed to save trip'}`);
      }
    } catch (err) {
      alert('❌ Network error - check backend');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen || !spot) return null;

  return (
    <div className="trip-modal-overlay">
      <div className="trip-modal">
        <button 
          className="modal-close"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>
        
        <h2>Add {spot.name} to Your Trip</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Estimated Budget (₹)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              min="0"
              step="100"
              placeholder="5000"
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>Reminder Email (Optional)</label>
            <input
              type="email"
              name="reminderEmail"
              value={formData.reminderEmail}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
            >
              {loading ? '⏳ Saving...' : 'Save Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTripModal;
