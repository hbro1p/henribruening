
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Heart, Shield, Sword } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
}

interface Player {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  level: number;
  experience: number;
  experienceToNext: number;
}

const Game = () => {
  const { theme } = useSettings();
  const [gameStarted, setGameStarted] = useState(false);
  const [player, setPlayer] = useState<Player>({
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    level: 1,
    experience: 0,
    experienceToNext: 100
  });

  const enemies = [
    { name: 'Goblin', health: 30, maxHealth: 30, attack: 8 },
    { name: 'Orc', health: 50, maxHealth: 50, attack: 12 },
    { name: 'Dragon', health: 100, maxHealth: 100, attack: 20 },
  ];

  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  const getThemeStyles = () => {
    switch (theme) {
      case 'space-mood':
        return {
          windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
          titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
          windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
          text: 'text-black',
          button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
          statBar: 'bg-gradient-to-r from-green-400 to-green-600',
          enemyStatBar: 'bg-gradient-to-r from-red-400 to-red-600',
          logBg: 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400',
        };
      case 'dark-vhs':
        return {
          windowFrame: 'bg-gradient-to-br from-gray-600 via-gray-700 to-black',
          titleBar: 'bg-gradient-to-r from-red-600 via-red-700 to-red-800',
          windowContent: 'bg-gradient-to-br from-gray-700 via-black to-gray-800',
          text: 'text-white',
          button: 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 hover:from-red-400 hover:via-red-500 hover:to-red-700 text-white',
          statBar: 'bg-gradient-to-r from-green-400 to-green-600',
          enemyStatBar: 'bg-gradient-to-r from-red-400 to-red-600',
          logBg: 'bg-gradient-to-br from-gray-800 to-black border-white/20 text-white',
        };
      case 'retro-chrome':
        return {
          windowFrame: 'bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600',
          titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-700',
          windowContent: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
          text: 'text-blue-200',
          button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
          statBar: 'bg-gradient-to-r from-cyan-400 to-blue-600',
          enemyStatBar: 'bg-gradient-to-r from-red-400 to-red-600',
          logBg: 'bg-gradient-to-br from-slate-800 to-blue-900 border-blue-400/30 text-blue-200',
        };
      default:
        return {
          windowFrame: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
          titleBar: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
          windowContent: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
          text: 'text-black',
          button: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-400 hover:via-blue-500 hover:to-blue-700 text-white',
          statBar: 'bg-gradient-to-r from-green-400 to-green-600',
          enemyStatBar: 'bg-gradient-to-r from-red-400 to-red-600',
          logBg: 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400',
        };
    }
  };

  const styles = getThemeStyles();

  const spawnEnemy = useCallback(() => {
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    setCurrentEnemy({ ...randomEnemy });
    setBattleLog(prev => [...prev, `A wild ${randomEnemy.name} appears!`]);
  }, []);

  const levelUp = useCallback(() => {
    setPlayer(prev => ({
      ...prev,
      level: prev.level + 1,
      maxHealth: prev.maxHealth + 20,
      health: prev.maxHealth + 20,
      attack: prev.attack + 3,
      defense: prev.defense + 2,
      experience: prev.experience - prev.experienceToNext,
      experienceToNext: Math.floor(prev.experienceToNext * 1.5)
    }));
    setBattleLog(prev => [...prev, `🎉 Level up! You are now level ${player.level + 1}!`]);
  }, [player.level]);

  const playerAttack = () => {
    if (!currentEnemy) return;

    const damage = Math.max(1, player.attack - Math.floor(Math.random() * 5));
    const newEnemyHealth = Math.max(0, currentEnemy.health - damage);
    
    setCurrentEnemy(prev => prev ? { ...prev, health: newEnemyHealth } : null);
    setBattleLog(prev => [...prev, `You deal ${damage} damage to ${currentEnemy.name}!`]);

    if (newEnemyHealth <= 0) {
      const expGained = currentEnemy.maxHealth * 2;
      setBattleLog(prev => [...prev, `${currentEnemy.name} defeated! +${expGained} XP`]);
      
      setPlayer(prev => {
        const newExp = prev.experience + expGained;
        if (newExp >= prev.experienceToNext) {
          setTimeout(levelUp, 1000);
        }
        return { ...prev, experience: newExp };
      });

      setTimeout(() => {
        spawnEnemy();
      }, 2000);
    } else {
      // Enemy attacks back
      setTimeout(() => {
        const enemyDamage = Math.max(1, currentEnemy.attack - player.defense);
        const newPlayerHealth = Math.max(0, player.health - enemyDamage);
        
        setPlayer(prev => ({ ...prev, health: newPlayerHealth }));
        setBattleLog(prev => [...prev, `${currentEnemy.name} deals ${enemyDamage} damage to you!`]);

        if (newPlayerHealth <= 0) {
          setGameOver(true);
          setBattleLog(prev => [...prev, '💀 Game Over! You have been defeated.']);
        }
      }, 1000);
    }
  };

  const heal = () => {
    const healAmount = Math.floor(player.maxHealth * 0.3);
    const newHealth = Math.min(player.maxHealth, player.health + healAmount);
    setPlayer(prev => ({ ...prev, health: newHealth }));
    setBattleLog(prev => [...prev, `You heal for ${healAmount} HP!`]);
  };

  const startGame = () => {
    setGameStarted(true);
    setBattleLog(['🎮 Welcome to the Retro RPG Adventure!']);
    spawnEnemy();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setVictory(false);
    setCurrentEnemy(null);
    setBattleLog([]);
    setPlayer({
      health: 100,
      maxHealth: 100,
      attack: 10,
      defense: 5,
      level: 1,
      experience: 0,
      experienceToNext: 100
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      {/* Window Frame */}
      <div className={`p-2 border-2 border-black/30 w-full max-w-4xl shadow-2xl rounded-lg ${styles.windowFrame}`}>
        {/* Title bar */}
        <div className={`p-2 rounded-t border-b-2 border-black/20 shadow-inner ${styles.titleBar}`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border border-black/20"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-black/20"></div>
            <span className="text-white font-pixel text-sm ml-2">RetroRPG.exe</span>
          </div>
        </div>
        
        {/* Window content */}
        <div className={`p-6 sm:p-8 border-2 border-white/20 shadow-inner rounded-b ${styles.windowContent}`}>
          <div className="text-center">
            <h1 className={`text-4xl mb-8 font-pixel drop-shadow-lg ${styles.text}`}>[ Retro RPG Adventure ]</h1>
            
            {!gameStarted ? (
              <div className="space-y-6">
                <p className={`mb-6 font-pixel text-lg ${styles.text}`}>
                  🗡️ Embark on a classic RPG adventure! Fight enemies, level up, and survive as long as you can!
                </p>
                <button
                  onClick={startGame}
                  className={`px-8 py-4 font-pixel text-lg border-2 border-black/30 shadow-lg transition-all active:scale-95 rounded ${styles.button}`}
                >
                  Start Adventure
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Player Stats */}
                <div className={`p-4 border-2 rounded shadow-inner ${styles.logBg}`}>
                  <h3 className={`font-pixel mb-2 ${styles.text}`}>Player Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span className={`font-pixel ${styles.text}`}>Health: {player.health}/{player.maxHealth}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded h-2 mt-1">
                        <div 
                          className={`h-2 rounded transition-all ${styles.statBar}`}
                          style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span className={`font-pixel ${styles.text}`}>Level {player.level}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded transition-all"
                          style={{ width: `${(player.experience / player.experienceToNext) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4" />
                      <span className={`font-pixel ${styles.text}`}>Attack: {player.attack}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className={`font-pixel ${styles.text}`}>Defense: {player.defense}</span>
                    </div>
                  </div>
                </div>

                {/* Enemy Stats */}
                {currentEnemy && (
                  <div className={`p-4 border-2 rounded shadow-inner ${styles.logBg}`}>
                    <h3 className={`font-pixel mb-2 ${styles.text}`}>Enemy</h3>
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`font-pixel ${styles.text}`}>{currentEnemy.name}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded h-2 mt-1">
                        <div 
                          className={`h-2 rounded transition-all ${styles.enemyStatBar}`}
                          style={{ width: `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`font-pixel text-xs ${styles.text}`}>
                        {currentEnemy.health}/{currentEnemy.maxHealth} HP
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!gameOver && currentEnemy && (
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={playerAttack}
                      className={`px-6 py-3 font-pixel border-2 border-black/30 shadow-lg transition-all active:scale-95 rounded ${styles.button}`}
                    >
                      ⚔️ Attack
                    </button>
                    <button
                      onClick={heal}
                      className={`px-6 py-3 font-pixel border-2 border-black/30 shadow-lg transition-all active:scale-95 rounded ${styles.button}`}
                    >
                      ❤️ Heal
                    </button>
                  </div>
                )}

                {/* Battle Log */}
                <div className={`p-4 border-2 rounded shadow-inner max-h-40 overflow-y-auto ${styles.logBg}`}>
                  <h3 className={`font-pixel mb-2 ${styles.text}`}>Battle Log</h3>
                  <div className="space-y-1">
                    {battleLog.slice(-8).map((log, index) => (
                      <p key={index} className={`text-xs font-pixel ${styles.text}`}>
                        {log}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Game Over */}
                {gameOver && (
                  <div className="text-center space-y-4">
                    <button
                      onClick={resetGame}
                      className={`px-8 py-4 font-pixel text-lg border-2 border-black/30 shadow-lg transition-all active:scale-95 rounded ${styles.button}`}
                    >
                      Play Again
                    </button>
                  </div>
                )}
              </div>
            )}

            <Link 
              to="/desktop" 
              className={`mt-8 inline-block text-xl underline transition-colors font-pixel drop-shadow-sm ${
                theme === 'space-mood' 
                  ? 'text-blue-800 hover:text-blue-900'
                  : theme === 'dark-vhs'
                  ? 'text-red-400 hover:text-red-300'
                  : theme === 'retro-chrome'
                  ? 'text-blue-300 hover:text-blue-200'
                  : 'text-blue-800 hover:text-blue-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Back to Desktop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
