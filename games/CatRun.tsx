import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const ClaraSaltadora: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');
  const [score, setScore] = useState(0);

  // Score Ref
  const scoreRef = useRef(0);

  const WIDTH = 800;
  const HEIGHT = 400;
  const GRAVITY = 0.8;
  const JUMP_FORCE = -14;
  const SPEED = 6;
  const GROUND_Y = 320;

  const cat = useRef({ y: GROUND_Y, dy: 0, isJumping: false });
  const obstacles = useRef<{x: number, width: number, height: number, type: number}[]>([]);
  const frameCount = useRef(0);
  const reqRef = useRef<number>();
  const sunX = useRef(700);

  const resetGame = () => {
    cat.current = { y: GROUND_Y, dy: 0, isJumping: false };
    obstacles.current = [];
    frameCount.current = 0;
    scoreRef.current = 0;
    setScore(0);
    setGameState('PLAYING');
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // Sky
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#bae6fd');
    gradient.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Sun
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(sunX.current, 60, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(253, 224, 71, 0.3)';
    ctx.beginPath();
    ctx.arc(sunX.current, 60, 55, 0, Math.PI * 2);
    ctx.fill();

    // Mountains
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(200, 150);
    ctx.lineTo(400, GROUND_Y);
    ctx.fill();
    
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(300, GROUND_Y);
    ctx.lineTo(550, 100);
    ctx.lineTo(800, GROUND_Y);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#65a30d';
    ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
    ctx.fillStyle = '#84cc16'; 
    ctx.fillRect(0, GROUND_Y, WIDTH, 15);
  };

  const drawCat = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const width = 40;
    const height = 40;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x + 20, y, 15, 4, 0, 0, Math.PI*2);
    ctx.fill();

    // Body (Black)
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.roundRect(x, y - height, width, height, 5);
    ctx.fill();

    // Head
    const headX = x + 25;
    const headY = y - height - 12;
    ctx.beginPath();
    ctx.arc(headX + 12, headY + 12, 16, 0, Math.PI*2);
    ctx.fill();
    
    // Ears
    ctx.beginPath();
    ctx.moveTo(headX + 2, headY + 5);
    ctx.lineTo(headX - 3, headY - 8);
    ctx.lineTo(headX + 10, headY);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(headX + 22, headY + 5);
    ctx.lineTo(headX + 27, headY - 8);
    ctx.lineTo(headX + 14, headY);
    ctx.fill();

    // White chest
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(x + 20, y - 10, 10, 12, 0, 0, Math.PI*2); 
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.ellipse(headX + 8, headY + 10, 3, 4, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headX + 16, headY + 10, 3, 4, 0, 0, Math.PI*2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = 'black';
    ctx.fillRect(headX + 7, headY + 9, 1, 3);
    ctx.fillRect(headX + 15, headY + 9, 1, 3);

    // Whiskers
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(headX + 20, headY + 16); ctx.lineTo(headX + 30, headY + 14);
    ctx.moveTo(headX + 20, headY + 18); ctx.lineTo(headX + 30, headY + 18);
    ctx.stroke();

    // Tail
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 5, y - height + 10);
    ctx.quadraticCurveTo(x - 20, y - height, x - 10, y - height - 20);
    ctx.stroke();
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (cat.current.isJumping) {
      cat.current.dy += GRAVITY;
      cat.current.y += cat.current.dy;
      
      if (cat.current.y >= GROUND_Y) {
        cat.current.y = GROUND_Y;
        cat.current.isJumping = false;
        cat.current.dy = 0;
      }
    }

    if (frameCount.current % 90 === 0) {
      if (Math.random() > 0.4) {
        const type = Math.floor(Math.random() * 2); 
        obstacles.current.push({
          x: WIDTH,
          width: 35,
          height: type === 0 ? 40 : 30,
          type
        });
      }
    }

    obstacles.current.forEach(obs => {
      obs.x -= SPEED;

      const catX = 50;
      const catY = cat.current.y - 40;
      const catW = 40;
      const catH = 40;

      if (
        catX < obs.x + obs.width - 5 &&
        catX + catW - 5 > obs.x &&
        catY < GROUND_Y &&
        catY + catH > GROUND_Y - obs.height + 5
      ) {
        setGameState('GAME_OVER');
      }
    });

    if (obstacles.current.length > 0 && obstacles.current[0].x < -50) {
      obstacles.current.shift();
      scoreRef.current += 10;
      setScore(scoreRef.current);
    }

    frameCount.current++;
    sunX.current -= 0.05;

    // Draw
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    drawBackground(ctx);
    drawCat(ctx, 50, cat.current.y);

    obstacles.current.forEach(obs => {
      if(obs.type === 0) {
         ctx.fillStyle = '#b45309';
         ctx.fillRect(obs.x, GROUND_Y - obs.height, obs.width, obs.height);
         ctx.strokeStyle = '#78350f';
         ctx.lineWidth = 2;
         ctx.strokeRect(obs.x, GROUND_Y - obs.height, obs.width, obs.height);
         ctx.beginPath();
         ctx.moveTo(obs.x, GROUND_Y - obs.height);
         ctx.lineTo(obs.x + 15, GROUND_Y - obs.height + 10);
         ctx.stroke();
      } else {
         ctx.fillStyle = '#db2777';
         ctx.beginPath();
         ctx.arc(obs.x + 15, GROUND_Y - 15, 15, 0, Math.PI*2);
         ctx.fill();
         ctx.strokeStyle = '#fbcfe8';
         ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.arc(obs.x + 15, GROUND_Y - 15, 10, 0, Math.PI*2);
         ctx.stroke();
      }
    });

    // Score on Canvas
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px "Quicksand"';
    ctx.fillText(`Score: ${scoreRef.current}`, 20, 40);

    if (gameState === 'PLAYING') {
      reqRef.current = requestAnimationFrame(loop);
    }
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      reqRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [gameState]);

  const jump = () => {
    if (gameState === 'PLAYING' && !cat.current.isJumping) {
      cat.current.isJumping = true;
      cat.current.dy = JUMP_FORCE;
    }
  };

  return (
    <div className="relative w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-lg border-2 border-love-100 cursor-pointer mx-auto" onClick={jump}>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="w-full h-auto block bg-blue-50"
      />
      
      {gameState === 'START' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white backdrop-blur-sm">
          <p className="text-3xl font-bold mb-4 font-script text-pink-300 drop-shadow-md">Clara Saltadora</p>
          <button 
            onClick={(e) => { e.stopPropagation(); resetGame(); }}
            className="px-8 py-3 bg-love-500 rounded-full flex items-center gap-2 hover:bg-love-600 transition shadow-xl transform hover:scale-105 font-bold"
          >
            <Play size={24} /> Correr
          </button>
        </div>
      )}
       {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-sm">
          <p className="text-3xl font-bold mb-2 font-script">Ops!</p>
          <p className="mb-6 text-xl">Score: <span className="font-bold text-yellow-400">{scoreRef.current}</span></p>
          <button 
            onClick={(e) => { e.stopPropagation(); resetGame(); }}
            className="px-8 py-3 bg-love-500 rounded-full flex items-center gap-2 hover:bg-love-600 transition shadow-xl"
          >
            <RotateCcw size={24} /> Tentar de novo
          </button>
        </div>
      )}
    </div>
  );
};