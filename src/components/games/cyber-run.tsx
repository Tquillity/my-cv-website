"use client";

import { useEffect, useRef, useState } from "react";

export const CyberRun = ({ onExit }: { onExit: () => void }) => {
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

    // Resize
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Game Objects
    let animationId: number;
    let frame = 0;
    let gameSpeed = 5;
    let spawnRate = 80;
    let isRunning = true;
    let localScore = 0;

    // Player
    const dino = { 
        x: 50, y: canvas.height - 60, 
        w: 30, h: 40, 
        dy: 0, jumpPower: -12, 
        grounded: true, 
        ducking: false 
    };
    
    // Arrays
    // Added 'vx' property for independent velocity control (for back attacks)
    let obstacles: { x: number, y: number, w: number, h: number, type: 'ground' | 'air' | 'back_runner', vx: number }[] = [];
    let bullets: { x: number, y: number }[] = [];
    
    const gravity = 0.6;

    // CONTROLS
    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Scroll
      if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
          e.preventDefault();
      }
      
      keys[e.code] = true;

      // Jump
      if (e.code === "ArrowUp" && dino.grounded && isRunning) {
        dino.dy = dino.jumpPower;
        dino.grounded = false;
      }

      // Shoot
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
        // Stop ducking
        if (e.code === "ArrowDown") {
            dino.ducking = false;
            dino.h = 40; 
            dino.y = canvas.height - 30 - 40; // Reset pos
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const loop = () => {
      if (!isRunning) return;
      frame++;
      
      // --- LOGIC ---

      // 1. Movement Left/Right
      if (keys["ArrowLeft"] && dino.x > 0) dino.x -= 5;
      if (keys["ArrowRight"] && dino.x < canvas.width / 2) dino.x += 5;

      // 2. Ducking
      if (keys["ArrowDown"]) {
          dino.ducking = true;
          dino.h = 20;
      } else {
          dino.ducking = false;
          dino.h = 40;
      }

      // 3. Physics
      dino.dy += gravity;
      dino.y += dino.dy;

      // Ground Collision
      const groundY = canvas.height - 30;
      if (dino.y + dino.h > groundY) {
        dino.y = groundY - dino.h;
        dino.dy = 0;
        dino.grounded = true;
      }

      // 4. Spawn Enemies (Accelerating Difficulty)
      // Every 900 frames (approx 15s at 60fps), increase spawn rate
      if (frame % 900 === 0) {
          spawnRate = Math.max(25, spawnRate - 10); // Cap minimum interval at 25 frames
          gameSpeed += 0.5; // Also speed up the world slightly
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
            vx: -gameSpeed // Moves left with the world
        });
      }

      // 5. Back Attack (Spawn from Left -> Right) after 60s (3600 frames)
      if (frame > 3600 && frame % (spawnRate * 3) === 0) {
          obstacles.push({
              x: -30, // Spawn off-screen left
              y: groundY - 40, // Ground level
              w: 20,
              h: 40,
              type: 'back_runner',
              vx: gameSpeed * 0.5
          });
      }

      // --- RENDER ---
      
      // Clear
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Floor
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      // Draw Player
      ctx.strokeStyle = "#22c55e"; 
      ctx.strokeRect(dino.x, dino.y, dino.w, dino.h);
      if (!dino.ducking) ctx.fillRect(dino.x + 20, dino.y + 5, 4, 4);

      // Draw Bullets
      ctx.fillStyle = "#22c55e"; 
      for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.x += 10;
          ctx.fillRect(b.x, b.y, 8, 2);
          if (b.x > canvas.width) bullets.splice(i, 1);
      }

      // Draw & Update Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        
        // Move Logic
        if (obs.type === 'back_runner') {
            obs.x += 2; // Move right across the screen
        } else {
            obs.x += obs.vx; // Standard enemies have negative vx (from spawn)
            // Actually, gameSpeed changes, so we should stick to:
            // obs.x -= gameSpeed
            // But for back runners, we want them to move right.
            // So:
            // Standard: x -= gameSpeed
            // Back Runner: x += 2 (independent of gameSpeed, it chases you)
        }
        
        // Re-verify logic:
        // If I use the loop below:
        if (obs.type === 'back_runner') {
             obs.x += 3; // Chasing speed
        } else {
             obs.x -= gameSpeed; // World movement
        }

        ctx.strokeStyle = "#22c55e";
        
        if (obs.type === 'air') {
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y + 10);
            ctx.lineTo(obs.x + 15, obs.y);
            ctx.lineTo(obs.x + 30, obs.y + 10);
            ctx.stroke();
        } else if (obs.type === 'back_runner') {
            // Draw Back Runner (maybe different look?)
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
            // Add an "eye" looking right
            ctx.fillStyle = "#22c55e";
            ctx.fillRect(obs.x + 15, obs.y + 5, 4, 4); 
        } else {
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        }

        // Bullet Collision
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

        // Player Collision
        if (
          dino.x < obs.x + obs.w &&
          dino.x + dino.w > obs.x &&
          dino.y < obs.y + obs.h &&
          dino.y + dino.h > obs.y
        ) {
          isRunning = false;
          setGameOver(true);
        }

        // Remove offscreen
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
      <div className="absolute top-4 left-4 text-green-500 text-xl font-bold">SCORE: {score}</div>
      <div className="absolute top-4 right-4 text-green-700 text-sm">ARROWS: Move/Jump/Duck | SPACE: Shoot</div>
      
      {gameOver && (
        <div className="absolute z-50 text-center bg-black/90 p-8 border border-green-500">
          <h2 className="text-3xl text-green-500 mb-4 animate-pulse">MISSION FAILED</h2>
          <p className="text-green-300 mb-6">Score: {score}</p>
          <div className="flex flex-col gap-3">
            <button 
                onClick={restartGame}
                className="px-4 py-2 bg-green-700 text-black font-bold hover:bg-green-500 transition-colors border border-green-500"
            >
                PLAY AGAIN
            </button>
            <button 
                onClick={onExit}
                className="px-4 py-2 bg-green-900/50 text-green-400 hover:bg-green-500 hover:text-black transition-colors border border-green-500"
            >
                RETURN TO TERMINAL
            </button>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
