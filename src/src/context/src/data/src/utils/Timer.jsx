import React, { useState, useEffect } from 'react';

export default function Timer({ initialSeconds, onTimeUp, isActive }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!isActive) return;
    if (seconds === 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, isActive, onTimeUp]);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  return <span>{seconds}</span>;
}