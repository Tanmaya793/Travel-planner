import React, { useState, useEffect } from 'react';

const TripCountdown = ({ startDate, tripTitle }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [tripStarted, setTripStarted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const tripDate = new Date(startDate).getTime();
      const now = new Date().getTime();
      const distance = tripDate - now;

      if (distance < 0) {
        setTripStarted(true);
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      // Alert if 1 day left
      if (days === 1 && hours === 0 && minutes === 0 && seconds === 0) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==');
        audio.play().catch(() => {});
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  if (tripStarted) {
    return (
      <div className="countdown">
        <p className="trip-started">🎉 Your trip has started! Enjoy!</p>
      </div>
    );
  }

  if (!timeLeft) {
    return <div className="countdown">Calculating...</div>;
  }

  const isLastDay = timeLeft.days === 0;

  return (
    <div className={`countdown ${isLastDay ? 'last-day' : ''}`}>
      <p className="countdown-title">⏱️ Trip starts in:</p>
      <div className="countdown-display">
        <div className="countdown-item">
          <span className="number">{timeLeft.days}</span>
          <span className="label">Days</span>
        </div>
        <div className="countdown-item">
          <span className="number">{timeLeft.hours}</span>
          <span className="label">Hours</span>
        </div>
        <div className="countdown-item">
          <span className="number">{timeLeft.minutes}</span>
          <span className="label">Mins</span>
        </div>
        <div className="countdown-item">
          <span className="number">{timeLeft.seconds}</span>
          <span className="label">Secs</span>
        </div>
      </div>
      {isLastDay && (
        <p className="reminder-text">⚠️ Your trip starts in less than 24 hours!</p>
      )}
    </div>
  );
};

export default TripCountdown;
