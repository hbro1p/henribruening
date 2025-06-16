
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

interface Dot {
  id: number;
  x: number;
  y: number;
  color: string;
  points: number;
}

const colors = [
  { color: '#ff6b6b', points: 10 },
  { color: '#4ecdc4', points: 15 },
  { color: '#45b7d1', points: 20 },
  { color: '#96ceb4', points: 25 },
  { color: '#feca57', points: 30 },
];

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [dots, setDots] = useState<Dot[]>([]);
  const [combo, setCombo] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const spawnTimerRef = useRef<NodeJS.Timeout>();
  const { t, theme } = useSettings();

  const spawnDot = useCallback(() => {
    if (!gameStarted || gameEnded) return;

    const colorData = colors[Math.floor(Math.random() * colors.length)];
    const newDot: Dot = {
      id: Math.random(),
      x: Math.random() * 320 + 40, // Keep dots away from edges
      y: Math.random() * 240 + 40,
      color: colorData.color,
      points: colorData.points
    };

    setDots(prev => [...prev, newDot]);

    // Remove dot after 3 seconds if not clicked
    setTimeout(() => {
      setDots(prev => prev.filter(dot => dot.id !== newDot.id));
    }, 3000);
  }, [gameStarted, gameEnded]);

  const clickDot = (dotId: number, points: number) => {
    setDots(prev => prev.filter(dot => dot.id !== dotId));
    setScore(prev => prev + points + combo);
    setCombo(prev => prev + 5);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setTimeLeft(30);
    setDots([]);
    setCombo(0);
  };

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
  };

  // Game timer
  useEffect(() => {
    if (gameStarted && !gameEnded) {
      gameTimerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      };
    }
  }, [gameStarted, gameEnded]);

  // Dot spawning
  useEffect(() => {
    if (gameStarted && !gameEnded) {
      spawnTimerRef.current = setInterval(spawnDot, 800);
      return () => {
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      };
    }
  }, [gameStarted, gameEnded, spawnDot]);

  const getGrade = () => {
    if (score >= 1000) return 'S+';
    if (score >= 750) return 'S';
    if (score >= 500) return 'A';
    if (score >= 300) return 'B';
    if (score >= 150) return 'C';
    return 'D';
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className={`p-3 border-2 w-full max-w-2xl shadow-2xl rounded-lg ${
        theme === 'space-mood'
          ? 'bg-gradient-to-br from-black/80 via-blue-900/40 to-purple-900/40 border-blue-400/30'
          : theme === 'dark-vhs'
          ? 'bg-gradient-to-br from-black/90 via-gray-900/50 to-black/80 border-white/20'
          : theme === 'matrix-terminal'
          ? 'bg-gradient-to-br from-black/90 via-green-900/40 to-black/80 border-green-500/30'
          : 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-black/30'
      }`}>
        {/* Title bar */}
        <div className={`p-3 rounded-t border-b-2 ${
          theme === 'space-mood'
            ? 'bg-gradient-to-r from-blue-800/80 via-purple-800/80 to-blue-900/80 border-blue-400/20'
            : theme === 'dark-vhs'
            ? 'bg-gradient-to-r from-gray-800/80 via-black/90 to-gray-700/80 border-white/10'
            : theme === 'matrix-terminal'
            ? 'bg-gradient-to-r from-green-800/80 via-black/90 to-green-700/80 border-green-500/20'
            : 'bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 border-black/20'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={`font-pixel text-lg ${
              theme === 'space-mood' ? 'text-blue-200' 
              : theme === 'dark-vhs' ? 'text-white' 
              : theme === 'matrix-terminal' ? 'text-green-400' 
              : 'text-white'
            }`}>Dot Catcher</span>
          </div>
        </div>
        
        {/* Game content */}
        <div className="p-6">
          
          {!gameStarted && !gameEnded && (
            <div className="text-center">
              <h1 className={`text-3xl mb-4 font-pixel ${
                theme === 'space-mood' ? 'text-blue-200' 
                : theme === 'dark-vhs' ? 'text-white' 
                : theme === 'matrix-terminal' ? 'text-green-400' 
                : 'text-black'
              }`}>DOT CATCHER</h1>
              <div className={`mb-6 font-pixel space-y-2 ${
                theme === 'space-mood' ? 'text-blue-300' 
                : theme === 'dark-vhs' ? 'text-gray-300' 
                : theme === 'matrix-terminal' ? 'text-green-300' 
                : 'text-black'
              }`}>
                <p>🎯 Click the colored dots to score points!</p>
                <p>⚡ Build combos for bonus points</p>
                <p>⏰ You have 30 seconds - go fast!</p>
              </div>
              <button
                onClick={startGame}
                className={`px-8 py-4 border-2 font-pixel font-bold transition-all rounded shadow-lg text-lg active:scale-95 ${
                  theme === 'space-mood'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400/30 text-white hover:from-blue-400 hover:to-purple-500'
                    : theme === 'dark-vhs'
                    ? 'bg-gradient-to-br from-gray-600 to-black border-white/20 text-white hover:from-gray-500 hover:to-gray-800'
                    : theme === 'matrix-terminal'
                    ? 'bg-gradient-to-br from-green-600 to-black border-green-500/30 text-green-100 hover:from-green-500 hover:to-green-800'
                    : 'bg-gradient-to-br from-green-400 to-green-600 border-black/30 text-white hover:from-green-300 hover:to-green-500'
                }`}
              >
                🚀 START GAME
              </button>
            </div>
          )}

          {gameStarted && !gameEnded && (
            <div>
              {/* Game UI */}
              <div className={`flex justify-between items-center mb-4 font-pixel ${
                theme === 'space-mood' ? 'text-blue-200' 
                : theme === 'dark-vhs' ? 'text-white' 
                : theme === 'matrix-terminal' ? 'text-green-400' 
                : 'text-black'
              }`}>
                <div className="flex space-x-4">
                  <span>💯 {score}</span>
                  <span>⏱️ {timeLeft}s</span>
                </div>
                <div>
                  <span>🔥 +{combo}</span>
                </div>
              </div>
              
              {/* Game Area */}
              <div 
                ref={gameAreaRef}
                className={`relative border-2 h-80 overflow-hidden rounded ${
                  theme === 'space-mood'
                    ? 'bg-gradient-to-br from-black/60 via-blue-900/20 to-purple-900/20 border-blue-400/20'
                    : theme === 'dark-vhs'
                    ? 'bg-gradient-to-br from-black/80 via-gray-900/20 to-black/60 border-white/10'
                    : theme === 'matrix-terminal'
                    ? 'bg-gradient-to-br from-black/80 via-green-900/20 to-black/60 border-green-500/20'
                    : 'bg-gradient-to-br from-black via-blue-900 to-purple-900 border-gray-600'
                }`}
              >
                {dots.map((dot) => (
                  <button
                    key={dot.id}
                    onClick={() => clickDot(dot.id, dot.points)}
                    className="absolute w-8 h-8 rounded-full hover:scale-110 cursor-pointer transition-all duration-100 border-2 border-white/30 shadow-lg"
                    style={{
                      left: `${dot.x}px`,
                      top: `${dot.y}px`,
                      backgroundColor: dot.color,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: `0 0 20px ${dot.color}50`
                    }}
                  >
                    <span className="text-xs font-bold text-white">+{dot.points}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameEnded && (
            <div className="text-center">
              <h2 className={`text-3xl mb-4 font-pixel ${
                theme === 'space-mood' ? 'text-blue-200' 
                : theme === 'dark-vhs' ? 'text-white' 
                : theme === 'matrix-terminal' ? 'text-green-400' 
                : 'text-black'
              }`}>GAME COMPLETE</h2>
              <div className="mb-6 space-y-2">
                <div className={`text-4xl font-pixel ${
                  theme === 'space-mood' ? 'text-purple-300' 
                  : theme === 'dark-vhs' ? 'text-gray-200' 
                  : theme === 'matrix-terminal' ? 'text-green-300' 
                  : 'text-yellow-600'
                }`}>
                  GRADE: {getGrade()}
                </div>
                <div className={`grid grid-cols-1 gap-4 mt-4 font-pixel ${
                  theme === 'space-mood' ? 'text-blue-300' 
                  : theme === 'dark-vhs' ? 'text-gray-300' 
                  : theme === 'matrix-terminal' ? 'text-green-300' 
                  : 'text-black'
                }`}>
                  <div className={`p-3 rounded border ${
                    theme === 'space-mood' ? 'bg-blue-900/20 border-blue-400/20' 
                    : theme === 'dark-vhs' ? 'bg-white/10 border-white/20' 
                    : theme === 'matrix-terminal' ? 'bg-green-900/20 border-green-500/20' 
                    : 'bg-white/20 border-black/20'
                  }`}>
                    <div>💯 Final Score</div>
                    <div className="text-2xl font-bold">{score}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  onClick={startGame}
                  className={`block mx-auto px-8 py-4 border-2 font-pixel font-bold transition-all rounded shadow-lg text-lg active:scale-95 ${
                    theme === 'space-mood'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400/30 text-white hover:from-blue-400 hover:to-purple-500'
                      : theme === 'dark-vhs'
                      ? 'bg-gradient-to-br from-gray-600 to-black border-white/20 text-white hover:from-gray-500 hover:to-gray-800'
                      : theme === 'matrix-terminal'
                      ? 'bg-gradient-to-br from-green-600 to-black border-green-500/30 text-green-100 hover:from-green-500 hover:to-green-800'
                      : 'bg-gradient-to-br from-blue-400 to-blue-600 border-black/30 text-white hover:from-blue-300 hover:to-blue-500'
                  }`}
                >
                  🔄 PLAY AGAIN
                </button>
                <Link 
                  to="/desktop"
                  className={`block transition-colors font-pixel underline text-lg ${
                    theme === 'space-mood' ? 'text-purple-300 hover:text-purple-200' 
                    : theme === 'dark-vhs' ? 'text-gray-300 hover:text-white' 
                    : theme === 'matrix-terminal' ? 'text-green-300 hover:text-green-200' 
                    : 'text-purple-800 hover:text-purple-900'
                  }`}
                >
                  🏠 Return to Desktop
                </Link>
              </div>
            </div>
          )}

          {!gameEnded && (
            <div className="mt-6 text-center">
              <Link 
                to="/desktop"
                className={`transition-colors font-pixel underline ${
                  theme === 'space-mood' ? 'text-purple-300 hover:text-purple-200' 
                  : theme === 'dark-vhs' ? 'text-gray-300 hover:text-white' 
                  : theme === 'matrix-terminal' ? 'text-green-300 hover:text-green-200' 
                  : 'text-purple-800 hover:text-purple-900'
                }`}
              >
                🏠 Return to Desktop
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Game;
