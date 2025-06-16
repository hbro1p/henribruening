
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface FallingItem {
  id: number;
  type: 'file' | 'virus' | 'star';
  icon: string;
  x: number;
  y: number;
  speed: number;
  color: string;
}

const fileIcons = ['📁', '📄', '🖼️', '🎵', '🎬', '⚙️'];
const virusIcons = ['💀', '⚠️', '🔥', '💥'];
const starIcons = ['⭐', '✨', '🌟'];

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout>();
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  const spawnRate = Math.max(300, 1000 - (level * 100));

  const spawnItem = useCallback(() => {
    if (!gameStarted || gameEnded) return;

    const rand = Math.random();
    let type: 'file' | 'virus' | 'star';
    let icon: string;
    let color: string;

    if (rand < 0.6) {
      type = 'file';
      icon = fileIcons[Math.floor(Math.random() * fileIcons.length)];
      color = '#4ade80';
    } else if (rand < 0.85) {
      type = 'virus';
      icon = virusIcons[Math.floor(Math.random() * virusIcons.length)];
      color = '#ef4444';
    } else {
      type = 'star';
      icon = starIcons[Math.floor(Math.random() * starIcons.length)];
      color = '#fbbf24';
    }

    const newItem: FallingItem = {
      id: Math.random(),
      type,
      icon,
      x: Math.random() * 340,
      y: -20,
      speed: 1.5 + Math.random() * 2 + (level * 0.3),
      color
    };

    setFallingItems(prev => [...prev, newItem]);
  }, [gameStarted, gameEnded, level]);

  const updateItems = useCallback(() => {
    if (!gameStarted || gameEnded) return;

    setFallingItems(prev => {
      const updated = prev.map(item => ({ ...item, y: item.y + item.speed }));
      
      // Remove items that fell off screen and check for virus hits
      const remaining = updated.filter(item => {
        if (item.y > 420) {
          if (item.type === 'virus') {
            setLives(current => current - 1);
            setCombo(0);
          }
          return false;
        }
        return true;
      });

      return remaining;
    });
  }, [gameStarted, gameEnded]);

  const catchItem = (itemId: number, itemType: 'file' | 'virus' | 'star') => {
    setFallingItems(prev => prev.filter(item => item.id !== itemId));
    
    if (itemType === 'file') {
      const points = 10 + (combo * 2);
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
    } else if (itemType === 'virus') {
      setLives(prev => prev - 1);
      setScore(prev => Math.max(0, prev - 20));
      setCombo(0);
    } else if (itemType === 'star') {
      const points = 50 + (combo * 5);
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setLives(prev => Math.min(5, prev + 1));
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setLives(3);
    setTimeLeft(45);
    setFallingItems([]);
    setLevel(1);
    setCombo(0);
  };

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  // Game timer effect
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

  // Item spawning effect
  useEffect(() => {
    if (gameStarted && !gameEnded) {
      spawnTimerRef.current = setInterval(spawnItem, spawnRate);
      return () => {
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      };
    }
  }, [gameStarted, gameEnded, spawnItem, spawnRate]);

  // Animation loop
  useEffect(() => {
    if (gameStarted && !gameEnded) {
      const animate = () => {
        updateItems();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [gameStarted, gameEnded, updateItems]);

  // Level progression
  useEffect(() => {
    const newLevel = Math.floor(score / 500) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [score, level]);

  // Game over check
  useEffect(() => {
    if (lives <= 0 && gameStarted) {
      endGame();
    }
  }, [lives, gameStarted]);

  const getGradeAndMessage = () => {
    if (score >= 2000) return { grade: 'S+', message: 'Legendary System Admin!' };
    if (score >= 1500) return { grade: 'S', message: 'Master of the Digital Realm!' };
    if (score >= 1000) return { grade: 'A', message: 'Excellent File Management!' };
    if (score >= 750) return { grade: 'B', message: 'Good Virus Protection!' };
    if (score >= 500) return { grade: 'C', message: 'Basic Computer Skills' };
    if (score >= 250) return { grade: 'D', message: 'Needs More Practice...' };
    return { grade: 'F', message: 'Time for a Computer Course!' };
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Window Frame with 3D effect */}
      <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 p-2 border-2 border-black/30 w-full max-w-2xl shadow-2xl rounded-lg">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-2 rounded-t border-b-2 border-black/20 shadow-inner">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">System Defender 2000</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-6 border-2 border-white/20 shadow-inner rounded-b">
          
          {!gameStarted && !gameEnded && (
            <div className="text-center">
              <h1 className="text-3xl mb-4 text-black font-pixel drop-shadow-lg">SYSTEM DEFENDER 2000</h1>
              <div className="mb-6 text-black font-pixel drop-shadow-sm space-y-2">
                <p>🖥️ Protect your system from digital threats!</p>
                <p>📁 Catch files (+10 pts) ⭐ Collect stars (+50 pts)</p>
                <p>💀 Avoid viruses (-1 life, -20 pts)</p>
                <p>🎯 Build combos for bonus points!</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-br from-green-400 via-green-500 to-green-700 border-2 border-black/30 hover:from-green-300 hover:via-green-400 hover:to-green-600 active:scale-95 text-white font-pixel font-bold transition-all rounded shadow-lg text-lg"
              >
                🚀 INITIALIZE SYSTEM
              </button>
            </div>
          )}

          {gameStarted && !gameEnded && (
            <div>
              {/* Game UI */}
              <div className="flex justify-between items-center mb-4 text-black font-pixel drop-shadow-sm">
                <div className="flex space-x-4">
                  <span>💯 {score}</span>
                  <span>❤️ {lives}</span>
                  <span>⏱️ {timeLeft}s</span>
                </div>
                <div className="flex space-x-4">
                  <span>📊 LV.{level}</span>
                  <span>🔥 x{combo}</span>
                </div>
              </div>
              
              {/* Game Area */}
              <div 
                ref={gameAreaRef}
                className="relative bg-gradient-to-br from-black via-blue-900 to-purple-900 border-4 border-gray-600 h-96 overflow-hidden rounded shadow-inner"
                style={{ width: '100%' }}
              >
                {/* Animated background grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-cyan-400/30"></div>
                    ))}
                  </div>
                </div>

                {fallingItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => catchItem(item.id, item.type)}
                    className={`absolute text-2xl hover:scale-110 cursor-pointer transition-all duration-100 ${
                      item.type === 'virus' ? 'animate-pulse' : ''
                    } ${item.type === 'star' ? 'animate-bounce' : ''}`}
                    style={{
                      left: `${item.x}px`,
                      top: `${item.y}px`,
                      transform: 'translate(-50%, -50%)',
                      textShadow: `0 0 10px ${item.color}`,
                      filter: `drop-shadow(0 0 5px ${item.color})`
                    }}
                  >
                    {item.icon}
                  </button>
                ))}

                {/* System scan lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-ping"></div>
                  <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-40"></div>
                </div>
              </div>
            </div>
          )}

          {gameEnded && (
            <div className="text-center">
              <h2 className="text-3xl mb-4 text-black font-pixel drop-shadow-lg">SYSTEM ANALYSIS COMPLETE</h2>
              <div className="mb-6 space-y-2">
                <div className="text-4xl font-pixel text-yellow-600 drop-shadow-lg">
                  GRADE: {getGradeAndMessage().grade}
                </div>
                <p className="text-xl text-black font-pixel drop-shadow-sm">
                  {getGradeAndMessage().message}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4 text-black font-pixel">
                  <div className="bg-white/20 p-3 rounded border-2 border-black/20">
                    <div>💯 Final Score</div>
                    <div className="text-2xl font-bold">{score}</div>
                  </div>
                  <div className="bg-white/20 p-3 rounded border-2 border-black/20">
                    <div>📊 Max Level</div>
                    <div className="text-2xl font-bold">{level}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  onClick={startGame}
                  className="block mx-auto px-8 py-4 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 border-2 border-black/30 hover:from-blue-300 hover:via-blue-400 hover:to-blue-600 active:scale-95 text-white font-pixel font-bold transition-all rounded shadow-lg text-lg"
                >
                  🔄 RESTART SYSTEM
                </button>
                <Link 
                  to="/desktop"
                  className="block text-purple-800 hover:text-purple-900 transition-colors font-pixel underline drop-shadow-sm text-lg"
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
                className="text-purple-800 hover:text-purple-900 transition-colors font-pixel underline drop-shadow-sm"
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
