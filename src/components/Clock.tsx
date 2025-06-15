
import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(() => formatTime(new Date()));

  function formatTime(date: Date) {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed top-4 right-4 md:top-8 md:right-8 bg-windows-gray text-black font-pixel p-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-lg">
      <p className="text-lg md:text-2xl tracking-widest">{time}</p>
    </div>
  );
};

export default Clock;
