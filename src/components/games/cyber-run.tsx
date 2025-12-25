"use client";

import { useEffect, useRef, useState } from "react";

interface CyberRunStrings {
  score: string;
  controls: string;
  missionFailed: string;
  scoreLabel: string;
  playAgain: string;
  returnTerminal: string;
}

export const CyberRun = ({ 
  onExit, 
  strings 
}: { 
  onExit: () => void;
  strings: CyberRunStrings;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState(0);

  const restartGame = () => {
      setGameOver(false);
      setScore(0);
      setGameId(prev => prev + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let animationId: number;
    let frame = 0;
    let gameSpeed = 5;
    let spawnRate = 80;
    let isRunning = true;
    let localScore = 0;

    const dino = { 
        x: 50, y: canvas.height - 60, 
        w: 30, h: 40, 
        dy: 0, jumpPower: -12, 
        grounded: true, 
        ducking: false 
    };
    
    let obstacles: { x: number, y: number, w: number, h: number, type: 'ground' | 'air' | 'back_runner', vx: number }[] = [];
    let bullets: { x: number, y: number }[] = [];
    
    const gravity = 0.6;

    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
          e.preventDefault();
      }
      
      keys[e.code] = true;

      if (e.code === "ArrowUp" && dino.grounded && isRunning) {
        dino.dy = dino.jumpPower;
        dino.grounded = false;
      }

      if (e.code === "Space" && isRunning) {
          bullets.push({ 
              x: dino.x + dino.w, 
              y: dino.y + (dino.h / 2) 
          });
      }
      if (e.code === "Escape") onExit();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        keys[e.code] = false;
        if (e.code === "ArrowDown") {
            dino.ducking = false;
            dino.h = 40; 
            dino.y = canvas.height - 30 - 40;
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const loop = () => {
      if (!isRunning) return;
      frame++;
      
      if (keys["ArrowLeft"] && dino.x > 0) dino.x -= 5;
      if (keys["ArrowRight"] && dino.x < canvas.width / 2) dino.x += 5;

      if (keys["ArrowDown"]) {
          dino.ducking = true;
          dino.h = 20;
      } else {
          dino.ducking = false;
          dino.h = 40;
      }

      dino.dy += gravity;
      dino.y += dino.dy;

      const groundY = canvas.height - 30;
      if (dino.y + dino.h > groundY) {
        dino.y = groundY - dino.h;
        dino.dy = 0;
        dino.grounded = true;
      }

      if (frame % 900 === 0) {
          spawnRate = Math.max(25, spawnRate - 10);
          gameSpeed += 0.5;
      }

      if (frame % spawnRate === 0) {
        const isAir = Math.random() > 0.6;
        
        // Standard Enemies (Right -> Left)
        obstacles.push({ 
            x: canvas.width, 
            y: isAir ? groundY - 50 : groundY - 40, 
            w: isAir ? 30 : 20, 
            h: isAir ? 20 : 40,
            type: isAir ? 'air' : 'ground',
            vx: -gameSpeed
        });
      }

      if (frame > 3600 && frame % (spawnRate * 3) === 0) {
          obstacles.push({
              x: -30,
              y: groundY - 40,
              w: 20,
              h: 40,
              type: 'back_runner',
              vx: gameSpeed * 0.5
          });
      }

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      ctx.strokeStyle = "#22c55e"; 
      ctx.strokeRect(dino.x, dino.y, dino.w, dino.h);
      if (!dino.ducking) ctx.fillRect(dino.x + 20, dino.y + 5, 4, 4);

      ctx.fillStyle = "#22c55e"; 
      for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.x += 10;
          ctx.fillRect(b.x, b.y, 8, 2);
          if (b.x > canvas.width) bullets.splice(i, 1);
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        
        if (obs.type === 'back_runner') {
            obs.x += 2;
        } else {
            obs.x += obs.vx;
        }
        
        if (obs.type === 'back_runner') {
             obs.x += 3;
        } else {
             obs.x -= gameSpeed;
        }

        ctx.strokeStyle = "#22c55e";
        
        if (obs.type === 'air') {
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y + 10);
            ctx.lineTo(obs.x + 15, obs.y);
            ctx.lineTo(obs.x + 30, obs.y + 10);
            ctx.stroke();
        } else if (obs.type === 'back_runner') {
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
            ctx.fillStyle = "#22c55e";
            ctx.fillRect(obs.x + 15, obs.y + 5, 4, 4); 
        } else {
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        }

        for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            if (
                b.x > obs.x && b.x < obs.x + obs.w &&
                b.y > obs.y && b.y < obs.y + obs.h
            ) {
                obstacles.splice(i, 1);
                bullets.splice(j, 1);
                localScore += 50;
                setScore(localScore);
                break; 
            }
        }

        if (
          dino.x < obs.x + obs.w &&
          dino.x + dino.w > obs.x &&
          dino.y < obs.y + obs.h &&
          dino.y + dino.h > obs.y
        ) {
          isRunning = false;
          setGameOver(true);
        }

        if (obs.type === 'back_runner') {
            if (obs.x > canvas.width) obstacles.splice(i, 1);
        } else {
            if (obs.x + obs.w < 0) {
                 if (obstacles[i]) { 
                     obstacles.splice(i, 1);
                     localScore += 10; 
                     setScore(localScore);
                 }
            }
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [onExit, gameId]);

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono">
      <div className="absolute top-4 left-4 text-green-500 text-xl font-bold">{strings.score} {score}</div>
      <div className="absolute top-4 right-4 text-green-700 text-sm">{strings.controls}</div>
      
      {gameOver && (
        <div className="absolute z-50 text-center bg-black/90 p-8 border border-green-500">
          <h2 className="text-3xl text-green-500 mb-4 animate-pulse">{strings.missionFailed}</h2>
          <p className="text-green-300 mb-6">{strings.scoreLabel} {score}</p>
          <div className="flex flex-col gap-3">
            <button 
                onClick={restartGame}
                className="px-4 py-2 bg-green-700 text-black font-bold hover:bg-green-500 transition-colors border border-green-500"
            >
                {strings.playAgain}
            </button>
            <button 
                onClick={onExit}
                className="px-4 py-2 bg-green-900/50 text-green-400 hover:bg-green-500 hover:text-black transition-colors border border-green-500"
            >
                {strings.returnTerminal}
            </button>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
