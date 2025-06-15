
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
      <div className="bg-windows-gray p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black w-full max-w-2xl shadow-2xl">
        <div className="bg-windows-blue text-white p-2 border-b-2 border-black font-pixel text-sm">
          Game.exe - Vibe Catcher 2000
        </div>
        <div className="border-b-2 border-r-2 border-white border-t-2 border-l-2 border-black p-6">
          
          {!gameStarted && !gameEnded && (
            <div className="text-center">
              <h1 className="text-3xl mb-4 text-black font-pixel">VIBE CATCHER 2000</h1>
              <p className="mb-6 text-black">Catch the falling words to collect vibes!</p>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white text-black font-pixel"
              >
                START GAME
              </button>
            </div>
          )}

          {gameStarted && !gameEnded && (
            <div>
              <div className="flex justify-between mb-4 text-black font-pixel">
                <span>Score: {score}</span>
                <span>Time: {timeLeft}s</span>
              </div>
              <div 
                ref={gameAreaRef}
                className="relative bg-black border-2 border-gray-400 h-96 overflow-hidden"
                style={{ width: '100%' }}
              >
                {fallingWords.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => catchWord(word.id)}
                    className="absolute bg-green-400 text-black px-2 py-1 text-sm font-pixel border border-white hover:bg-green-300 cursor-pointer"
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
              <h2 className="text-2xl mb-4 text-black font-pixel">GAME OVER</h2>
              <p className="mb-2 text-black font-pixel">Final Score: {score}</p>
              <p className="mb-6 text-black font-pixel italic">"{message}"</p>
              <div className="space-y-4">
                <button
                  onClick={startGame}
                  className="block mx-auto px-6 py-3 bg-windows-gray border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-2 active:border-l-2 active:border-black active:border-b-2 active:border-r-2 active:border-white text-black font-pixel"
                >
                  PLAY AGAIN
                </button>
                <Link 
                  to="/desktop"
                  className="block text-windows-blue hover:text-blue-700 transition-colors font-pixel underline"
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
                className="text-windows-blue hover:text-blue-700 transition-colors font-pixel underline"
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
