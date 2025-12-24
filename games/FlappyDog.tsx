import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const FlappyDog: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');
  const [score, setScore] = useState(0);

  // Use refs for game loop logic
  const scoreRef = useRef(0);
  const birdY = useRef(200);
  const velocity = useRef(0);
  const pipes = useRef<{x: number, topHeight: number, passed: boolean}[]>([]);
  const clouds = useRef<{x: number, y: number, s: number}[]>([]);
  const frameCount = useRef(0);
  const reqRef = useRef<number>();

  // Constants
  const GRAVITY = 0.4; 
  const JUMP = -7;
  const PIPE_SPEED = 2.5;
  const PIPE_SPAWN_RATE = 150; 
  const PIPE_GAP = 160; 

  const resetGame = () => {
    birdY.current = 200;
    velocity.current = 0;
    pipes.current = [];
    clouds.current = [
        {x: 50, y: 50, s: 0.8}, {x: 200, y: 100, s: 1.2}, {x: 400, y: 60, s: 0.9}
    ];
    frameCount.current = 0;
    scoreRef.current = 0;
    setScore(0);
    setGameState('PLAYING');
  };

  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.arc(25, -10, 25, 0, Math.PI * 2);
    ctx.arc(50, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const drawDog = (ctx: CanvasRenderingContext2D, y: number) => {
    ctx.save();
    ctx.translate(60, y);
    const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (velocity.current * 0.1)));
    ctx.rotate(rotation);

    // Head
    ctx.fillStyle = '#D97706'; 
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#92400E'; 
    ctx.beginPath();
    ctx.ellipse(-12, -10, 8, 14, -0.6, 0, Math.PI * 2); 
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(12, -10, 8, 14, 0.6, 0, Math.PI * 2); 
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-8, -4, 5, 0, Math.PI * 2);
    ctx.arc(8, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-8, -4, 2.5, 0, Math.PI * 2);
    ctx.arc(8, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#FEF3C7'; 
    ctx.beginPath();
    ctx.ellipse(0, 6, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.ellipse(0, 4, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 8, 3, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Physics
    velocity.current += GRAVITY;
    birdY.current += velocity.current;

    if (birdY.current + 18 > canvas.height || birdY.current - 18 < 0) {
      setGameState('GAME_OVER');
      return;
    }

    // Clouds
    clouds.current.forEach(c => {
        c.x -= 0.5;
        if(c.x < -100) c.x = canvas.width + 50;
    });

    // Pipes
    if (frameCount.current % PIPE_SPAWN_RATE === 0) {
      const minPipe = 80;
      const maxPipe = canvas.height - PIPE_GAP - 80;
      const topHeight = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;
      pipes.current.push({ x: canvas.width, topHeight, passed: false });
    }

    pipes.current.forEach(pipe => {
      pipe.x -= PIPE_SPEED;
      
      const dogX = 60;
      const dogY = birdY.current;
      const pipeW = 50;

      if (
        dogX + 15 > pipe.x && 
        dogX - 15 < pipe.x + pipeW && 
        (dogY - 15 < pipe.topHeight || dogY + 15 > pipe.topHeight + PIPE_GAP)
      ) {
        setGameState('GAME_OVER');
      }

      if (!pipe.passed && pipe.x + pipeW < dogX) {
        scoreRef.current += 1;
        setScore(scoreRef.current); // Sync to React State for UI if needed, but we draw from Ref
        pipe.passed = true;
      }
    });

    if (pipes.current.length > 0 && pipes.current[0].x < -60) {
      pipes.current.shift();
    }

    frameCount.current++;

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#7DD3FC');
    gradient.addColorStop(1, '#E0F2FE');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    clouds.current.forEach(c => drawCloud(ctx, c.x, c.y, c.s));

    pipes.current.forEach(pipe => {
      ctx.fillStyle = '#4ADE80'; 
      ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
      ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, 50, canvas.height - (pipe.topHeight + PIPE_GAP));
      
      ctx.strokeStyle = '#15803D';
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, 0, 50, pipe.topHeight);
      ctx.strokeRect(pipe.x, pipe.topHeight + PIPE_GAP, 50, canvas.height - (pipe.topHeight + PIPE_GAP));

      ctx.fillStyle = '#22C55E';
      ctx.fillRect(pipe.x - 3, pipe.topHeight - 20, 56, 20);
      ctx.strokeRect(pipe.x - 3, pipe.topHeight - 20, 56, 20);
      
      ctx.fillRect(pipe.x - 3, pipe.topHeight + PIPE_GAP, 56, 20);
      ctx.strokeRect(pipe.x - 3, pipe.topHeight + PIPE_GAP, 56, 20);
    });

    drawDog(ctx, birdY.current);

    // Score from Ref to ensure it's up to date
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px "Quicksand"';
    ctx.strokeStyle = '#be123c';
    ctx.lineWidth = 5;
    ctx.strokeText(scoreRef.current.toString(), canvas.width / 2 - 10, 60);
    ctx.fillText(scoreRef.current.toString(), canvas.width / 2 - 10, 60);

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

  const handleJump = () => {
    if (gameState === 'PLAYING') {
      velocity.current = JUMP;
    }
  };

  return (
    <div className="relative w-full max-w-[320px] aspect-[3/4] bg-sky-200 rounded-xl overflow-hidden cursor-pointer shadow-lg border-4 border-love-100 mx-auto" onClick={handleJump}>
      <canvas 
        ref={canvasRef} 
        width={320} 
        height={427} 
        className="w-full h-full block"
      />
      
      {gameState === 'START' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white backdrop-blur-sm">
          <p className="text-3xl font-bold mb-4 font-script text-yellow-300 drop-shadow-md">Flappy Dog</p>
          <button 
            onClick={(e) => { e.stopPropagation(); resetGame(); }}
            className="px-8 py-3 bg-love-500 rounded-full flex items-center gap-2 hover:bg-love-600 transition shadow-xl transform hover:scale-105 font-bold"
          >
            <Play size={24} /> Jogar
          </button>
        </div>
      )}

      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-sm">
          <p className="text-4xl font-bold mb-2 font-script">Fim de Jogo!</p>
          <p className="mb-8 text-xl">Sua pontuação: <span className="text-yellow-400 font-bold">{scoreRef.current}</span></p>
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