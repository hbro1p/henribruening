import React, { useEffect, useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

const AdventureCanyonAmbient: React.FC = () => {
  const { theme } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (theme === 'adventure-canyon') {
      // Create audio context for ambient sounds
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        
        // Create a simple ambient soundscape using Web Audio API
        try {
          const createAmbientSound = () => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            // Create wind sound using noise
            const createWindSound = () => {
              const bufferSize = audioContext.sampleRate * 2;
              const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
              const output = noiseBuffer.getChannelData(0);
              
              for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
              }
              
              const noise = audioContext.createBufferSource();
              noise.buffer = noiseBuffer;
              noise.loop = true;
              
              const filter = audioContext.createBiquadFilter();
              filter.type = 'lowpass';
              filter.frequency.value = 400;
              
              const gain = audioContext.createGain();
              gain.gain.value = 0.1;
              
              noise.connect(filter);
              filter.connect(gain);
              gain.connect(audioContext.destination);
              
              return { noise, gain };
            };
            
            // Create water sound
            const createWaterSound = () => {
              const bufferSize = audioContext.sampleRate * 4;
              const waterBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
              const output = waterBuffer.getChannelData(0);
              
              for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.01);
              }
              
              const water = audioContext.createBufferSource();
              water.buffer = waterBuffer;
              water.loop = true;
              
              const filter = audioContext.createBiquadFilter();
              filter.type = 'highpass';
              filter.frequency.value = 200;
              
              const gain = audioContext.createGain();
              gain.gain.value = 0.15;
              
              water.connect(filter);
              filter.connect(gain);
              gain.connect(audioContext.destination);
              
              return { water, gain };
            };
            
            const windSound = createWindSound();
            const waterSound = createWaterSound();
            
            windSound.noise.start();
            waterSound.water.start();
            
            return () => {
              windSound.noise.stop();
              waterSound.water.stop();
              audioContext.close();
            };
          };
          
          const cleanup = createAmbientSound();
          
          return () => {
            cleanup();
          };
        } catch (error) {
          console.log('Web Audio API not supported, using fallback');
        }
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [theme]);

  return null; // This component only manages audio
};

export default AdventureCanyonAmbient;