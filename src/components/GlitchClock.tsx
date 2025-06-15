
import React, { useState, useEffect } from 'react';

const GlitchClock = () => {
  const [time, setTime] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const generateRandomTime = () => {
    const randomHour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const randomMinute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    return `${randomHour}:${randomMinute}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isGlitching) {
        return; // Don't update time while a glitch animation is active
      }

      const realTime = formatTime(new Date());
      setTime(realTime);

      // 10% chance to glitch every second
      if (Math.random() < 0.1) {
        setIsGlitching(true);
        const glitchTime = generateRandomTime();
        setTime(glitchTime);

        setTimeout(() => {
          setTime(realTime); // Revert back to real time
          setIsGlitching(false);
        }, 150);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isGlitching]);

  return (
    <div className="fixed top-8 right-8 bg-black text-green-400 font-pixel p-2 border-2 border-green-400/50 shadow-lg">
      <p className="text-2xl tracking-widest">{time}</p>
    </div>
  );
};

export default GlitchClock;
