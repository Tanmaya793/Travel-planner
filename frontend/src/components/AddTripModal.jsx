import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const AddTripModal = ({ isOpen, onClose, spot }) => {
  const { token, fetchUserTrips } = useAuth();
  const [formData, setFormData] = useState({
    startDate: '',
    members: 1,
    days: 1,
    reminderEmail: ''
  });
  const [loading, setLoading] = useState(false);

  const perDayCost = useMemo(() => {
    return Number(spot?.daily_cost || 0);
  }, [spot]);

  const totalCost = useMemo(() => {
    return perDayCost * (formData.days || 1) * (formData.members || 1);
  }, [perDayCost, formData.days, formData.members]);

  const endDate = useMemo(() => {
    if (!formData.startDate) return '';
    const start = new Date(formData.startDate);
    const end = new Date(start.getTime() + (formData.days - 1) * 24 * 60 * 60 * 1000);
    return end.toISOString().split('T')[0];
  }, [formData.startDate, formData.days]);

  useEffect(() => {
    if (spot) {
      setFormData({
        startDate: '',
        members: 1,
        days: 1,
        reminderEmail: ''
      });
    }
  }, [spot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'members' || name === 'days'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDateTime = formData.startDate
        ? `${formData.startDate} 09:00:00`
        : null;

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
          end_date: endDate,
          start_datetime: startDateTime,
          members: formData.members,
          days: formData.days,
          per_day_cost: perDayCost,
          total_cost: totalCost
        })
      });

      const data = await response.json();

      if (response.ok) {
        await fetchUserTrips();
        onClose();
        alert('✅ Trip saved! Check My Trips section.');
      } else {
        alert(`❌ ${data.error || 'Failed to save trip'}`);
      }
    } catch (err) {
      alert('❌ Network error - check backend');
    } finally {
      setLoading(false);
    }
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
            <label>Number of Days</label>
            <input
              type="number"
              name="days"
              min="1"
              max="365"
              value={formData.days}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {formData.startDate && (
            <div className="input-group">
              <label>Auto-calculated End Date</label>
              <input
                type="date"
                value={endDate}
                disabled
                style={{opacity: 0.6}}
              />
            </div>
          )}

          <div className="input-group">
            <label>Number of Members</label>
            <input
              type="number"
              name="members"
              min="1"
              max="50"
              value={formData.members}
              onChange={handleChange}
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
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div className="trip-cost-summary">
            <div className="cost-item">
              <span>Per Day Cost:</span>
              <strong>₹{perDayCost.toLocaleString()}</strong>
            </div>
            <div className="cost-item">
              <span>Days × Members:</span>
              <strong>{formData.days} × {formData.members}</strong>
            </div>
            <div className="cost-item total">
              <span>Total Cost:</span>
              <strong>₹{totalCost.toLocaleString()}</strong>
            </div>
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
