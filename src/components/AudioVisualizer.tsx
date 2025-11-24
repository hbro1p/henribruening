import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioElement, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [bars] = useState(32);

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioElement);
    
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    return () => {
      source.disconnect();
      analyser.disconnect();
      audioContext.close();
    };
  }, [audioElement]);

  useEffect(() => {
    if (!isPlaying || !analyserRef.current || !dataArrayRef.current || !canvasRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = canvas.width / bars;
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(0.5, '#f97316');
      gradient.addColorStop(1, '#facc15');
      
      for (let i = 0; i < bars; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        const x = i * barWidth;
        
        // Main bar
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ef4444';
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        ctx.shadowBlur = 0;
        
        // Cap
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, canvas.height - barHeight - 3, barWidth - 2, 3);
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, bars]);

  return (
    <div className="w-full h-16 rounded-lg overflow-hidden bg-black/30 border border-white/20">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={64}
        className="w-full h-full"
      />
    </div>
  );
};

