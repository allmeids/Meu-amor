import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const SPEED = 130;

type Point = { x: number, y: number };

export const SnakeGame: React.FC = () => {
  // Logic Refs
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 15, y: 15 });
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const scoreRef = useRef(0);
  const directionChangedRef = useRef(false);
  const gameLoopRef = useRef<number | null>(null);

  // UI State
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');
  const [_, setRenderTrigger] = useState(0); // Force re-render

  const spawnFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    foodRef.current = spawnFood();
    directionRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    directionChangedRef.current = false;
    setGameState('PLAYING');
    setRenderTrigger(prev => prev + 1);
  };

  const checkCollision = (head: Point) => {
    // Walls
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) return true;
    // Self
    for (const segment of snakeRef.current) {
      if (head.x === segment.x && head.y === segment.y) return true;
    }
    return false;
  };

  const moveSnake = () => {
    const head = snakeRef.current[0];
    const dir = directionRef.current;
    const newHead = { x: head.x + dir.x, y: head.y + dir.y };

    if (checkCollision(newHead)) {
      setGameState('GAME_OVER');
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      return;
    }

    const newSnake = [newHead, ...snakeRef.current];

    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      scoreRef.current += 1;
      foodRef.current = spawnFood();
    } else {
      newSnake.pop();
    }
    
    snakeRef.current = newSnake;
    directionChangedRef.current = false;
    
    setRenderTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = window.setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState !== 'PLAYING' || directionChangedRef.current) return;

      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (dir.y === 0) { directionRef.current = { x: 0, y: -1 }; directionChangedRef.current = true; }
          break;
        case 'ArrowDown':
          if (dir.y === 0) { directionRef.current = { x: 0, y: 1 }; directionChangedRef.current = true; }
          break;
        case 'ArrowLeft':
          if (dir.x === 0) { directionRef.current = { x: -1, y: 0 }; directionChangedRef.current = true; }
          break;
        case 'ArrowRight':
          if (dir.x === 0) { directionRef.current = { x: 1, y: 0 }; directionChangedRef.current = true; }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[500px] bg-green-50 rounded-lg">
      <div className="relative bg-[#a3d55f] border-8 border-[#8bac0f] rounded-lg shadow-xl overflow-hidden" 
           style={{ width: 320, height: 320 }}>
        
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
               backgroundSize: '40px 40px',
               backgroundPosition: '0 0, 20px 20px'
             }}>
        </div>

        {(gameState === 'PLAYING' || gameState === 'GAME_OVER') && (
          <>
            {/* Food */}
            <div 
              className="absolute flex items-center justify-center text-xl transition-all"
              style={{
                left: foodRef.current.x * (320/GRID_SIZE),
                top: foodRef.current.y * (320/GRID_SIZE),
                width: (320/GRID_SIZE),
                height: (320/GRID_SIZE),
              }}
            >
              🍎
            </div>

            {/* Snake */}
            {snakeRef.current.map((segment, i) => {
               const isHead = i === 0;
               return (
                <div 
                  key={i}
                  className={`absolute transition-all duration-75 flex items-center justify-center ${isHead ? 'z-20' : 'z-10'}`}
                  style={{
                    left: segment.x * (320/GRID_SIZE),
                    top: segment.y * (320/GRID_SIZE),
                    width: (320/GRID_SIZE),
                    height: (320/GRID_SIZE),
                  }}
                >
                  <div className={`w-full h-full ${isHead ? 'bg-love-600 rounded-sm' : 'bg-love-400 rounded-sm'} shadow-sm relative`}>
                    {isHead && (
                      <>
                        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full"><div className="w-0.5 h-0.5 bg-black rounded-full mx-auto mt-0.5"></div></div>
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full"><div className="w-0.5 h-0.5 bg-black rounded-full mx-auto mt-0.5"></div></div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-red-600"></div>
                      </>
                    )}
                  </div>
                </div>
               );
            })}
          </>
        )}

        {gameState === 'START' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-30">
            <h3 className="text-3xl font-bold text-white mb-4 font-script">Snake Love</h3>
            <button onClick={resetGame} className="bg-love-500 hover:bg-love-600 text-white px-8 py-3 rounded-full font-bold flex gap-2 transition-transform hover:scale-105 shadow-lg">
              <Play /> Jogar
            </button>
            <p className="text-white text-xs mt-4 bg-black/20 px-2 py-1 rounded">Use as setas para mover</p>
          </div>
        )}

        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white z-30">
            <p className="text-4xl font-bold font-script mb-2 text-love-300">Fim de jogo!</p>
            <p className="mb-6 text-xl">Maçãs: <span className="font-bold text-yellow-400">{scoreRef.current}</span></p>
            <button onClick={resetGame} className="bg-white text-love-600 px-8 py-3 rounded-full font-bold flex gap-2 hover:bg-gray-100 transition-colors">
              <RotateCcw /> Tentar de novo
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 mt-6 md:hidden">
        <div></div>
        <button className="bg-love-500 text-white p-4 rounded-xl shadow-md active:bg-love-700 transition-colors" onClick={() => {if (directionRef.current.y === 0) directionRef.current = {x:0, y:-1}}}>↑</button>
        <div></div>
        <button className="bg-love-500 text-white p-4 rounded-xl shadow-md active:bg-love-700 transition-colors" onClick={() => {if (directionRef.current.x === 0) directionRef.current = {x:-1, y:0}}}>←</button>
        <button className="bg-love-500 text-white p-4 rounded-xl shadow-md active:bg-love-700 transition-colors" onClick={() => {if (directionRef.current.y === 0) directionRef.current = {x:0, y:1}}}>↓</button>
        <button className="bg-love-500 text-white p-4 rounded-xl shadow-md active:bg-love-700 transition-colors" onClick={() => {if (directionRef.current.x === 0) directionRef.current = {x:1, y:0}}}>→</button>
      </div>

    </div>
  );
};