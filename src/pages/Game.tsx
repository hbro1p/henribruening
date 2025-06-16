
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface FallingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
}

const words = ['dream', 'blur', 'vibe', 'chill', 'mood', 'aesthetic', 'retro'];
const funMessages = [
  "You just wasted 43 seconds. Good job.",
  "Now go look at the photos. They matter more.",
  "Congratulations! You caught some vibes.",
  "Time well spent... or was it?",
  "The 2000s called. They want their game back."
];

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [message, setMessage] = useState('');
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const gameTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gameStarted && !gameEnded) {
      // Game timer
      gameTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Spawn words
      intervalRef.current = setInterval(() => {
        spawnWord();
      }, 800);

      // Update word positions
      const updateInterval = setInterval(() => {
        setFallingWords((prev) => 
          prev.map(word => ({ ...word, y: word.y + word.speed }))
            .filter(word => word.y < 400)
        );
      }, 16);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        clearInterval(updateInterval);
      };
    }
  }, [gameStarted, gameEnded]);

  const spawnWord = () => {
    const newWord: FallingWord = {
      id: Math.random(),
      word: words[Math.floor(Math.random() * words.length)],
      x: Math.random() * 300,
      y: 0,
      speed: 2 + Math.random() * 2
    };
    setFallingWords(prev => [...prev, newWord]);
  };

  const catchWord = (wordId: number) => {
    setFallingWords(prev => prev.filter(word => word.id !== wordId));
    setScore(prev => prev + 10);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setTimeLeft(30);
    setFallingWords([]);
    setMessage('');
  };

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    setMessage(funMessages[Math.floor(Math.random() * funMessages.length)]);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8 bg-black">
      {/* Window Frame with 3D effect */}
      <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 p-2 border-2 border-black/30 w-full max-w-2xl shadow-2xl rounded-lg">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 p-2 rounded-t border-b-2 border-black/20 shadow-inner">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">Game.exe - Vibe Catcher 2000</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-6 border-2 border-white/20 shadow-inner rounded-b">
          
          {!gameStarted && !gameEnded && (
            <div className="text-center">
              <h1 className="text-3xl mb-4 text-black font-pixel drop-shadow-lg">VIBE CATCHER 2000</h1>
              <p className="mb-6 text-black font-pixel drop-shadow-sm">Catch the falling words to collect vibes!</p>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-2 border-black/30 hover:from-gray-200 hover:via-gray-300 hover:to-gray-500 active:scale-95 text-black font-pixel font-bold transition-all rounded shadow-lg"
              >
                START GAME
              </button>
            </div>
          )}

          {gameStarted && !gameEnded && (
            <div>
              <div className="flex justify-between mb-4 text-black font-pixel drop-shadow-sm">
                <span>Score: {score}</span>
                <span>Time: {timeLeft}s</span>
              </div>
              <div 
                ref={gameAreaRef}
                className="relative bg-gradient-to-br from-black via-gray-900 to-black border-2 border-gray-600 h-96 overflow-hidden rounded shadow-inner"
                style={{ width: '100%' }}
              >
                {fallingWords.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => catchWord(word.id)}
                    className="absolute bg-gradient-to-br from-green-400 to-green-600 text-black px-2 py-1 text-sm font-pixel border-2 border-black/20 hover:from-green-300 hover:to-green-500 cursor-pointer rounded shadow-lg active:scale-95 transition-all"
                    style={{
                      left: `${word.x}px`,
                      top: `${word.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {word.word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameEnded && (
            <div className="text-center">
              <h2 className="text-2xl mb-4 text-black font-pixel drop-shadow-lg">GAME OVER</h2>
              <p className="mb-2 text-black font-pixel drop-shadow-sm">Final Score: {score}</p>
              <p className="mb-6 text-black font-pixel italic drop-shadow-sm">"{message}"</p>
              <div className="space-y-4">
                <button
                  onClick={startGame}
                  className="block mx-auto px-6 py-3 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 border-2 border-black/30 hover:from-gray-200 hover:via-gray-300 hover:to-gray-500 active:scale-95 text-black font-pixel font-bold transition-all rounded shadow-lg"
                >
                  PLAY AGAIN
                </button>
                <Link 
                  to="/desktop"
                  className="block text-yellow-800 hover:text-yellow-900 transition-colors font-pixel underline drop-shadow-sm"
                >
                  &lt;- Back to Desktop
                </Link>
              </div>
            </div>
          )}

          {!gameEnded && (
            <div className="mt-6 text-center">
              <Link 
                to="/desktop"
                className="text-yellow-800 hover:text-yellow-900 transition-colors font-pixel underline drop-shadow-sm"
              >
                &lt;- Back to Desktop
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Game;
