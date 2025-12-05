"use client";

import { useEffect, useRef, useState } from "react";

export const CyberSnake = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Grid System
    const gridSize = 20;
    let tileCountX = 0;
    let tileCountY = 0;

    // Resize
    const resize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        tileCountX = Math.floor(canvas.width / gridSize);
        tileCountY = Math.floor(canvas.height / gridSize);
    };
    resize();

    // Game State
    let speed = 7;
    let xv = 1;
    let yv = 0;
    let px = 10;
    let py = 10;
    let trail: {x: number, y: number}[] = [];
    let tail = 5;
    let ax = 15;
    let ay = 15;
    let isRunning = true;
    let animationId: number;

    const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent Scrolling
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
            e.preventDefault();
        }

        if (e.code === "Escape") onExit();
        if (!isRunning) return;

        switch(e.code) {
            case "ArrowLeft":
                if (xv !== 1) { xv = -1; yv = 0; }
                break;
            case "ArrowRight":
                if (xv !== -1) { xv = 1; yv = 0; }
                break;
            case "ArrowUp":
                if (yv !== 1) { xv = 0; yv = -1; }
                break;
            case "ArrowDown":
                if (yv !== -1) { xv = 0; yv = 1; }
                break;
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Game Loop (Using interval logic inside RequestAnimationFrame for speed control)
    let lastTime = 0;
    const loop = (currentTime: number) => {
        animationId = requestAnimationFrame(loop);
        if (!isRunning) return;

        const secondsSinceLastRender = (currentTime - lastTime) / 1000;
        if (secondsSinceLastRender < 1 / speed) return;

        lastTime = currentTime;

        // Logic
        px += xv;
        py += yv;

        // Wrapping
        if (px < 0) px = tileCountX - 1;
        if (px > tileCountX - 1) px = 0;
        if (py < 0) py = tileCountY - 1;
        if (py > tileCountY - 1) py = 0;

        // Background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Snake
        ctx.fillStyle = "#22c55e"; // Green
        for (let i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);
            
            // Collision (Death)
            if (trail[i].x === px && trail[i].y === py) {
                if (tail > 5) { // Ignore immediate collision on start
                    isRunning = false;
                    setGameOver(true);
                }
            }
        }

        trail.push({ x: px, y: py });
        while (trail.length > tail) {
            trail.shift();
        }

        // Eat Apple
        if (ax === px && ay === py) {
            tail++;
            setScore(prev => prev + 10);
            // Spawn new apple
            ax = Math.floor(Math.random() * tileCountX);
            ay = Math.floor(Math.random() * tileCountY);
            
            // Speed up slightly
            if (speed < 20) speed += 0.5;
        }

        // Draw Apple
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 2;
        ctx.strokeRect(ax * gridSize, ay * gridSize, gridSize - 2, gridSize - 2);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animationId);
    };
  }, [onExit]);

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono">
      <div className="absolute top-4 left-4 text-green-500 text-xl font-bold">LENGTH: {score}</div>
      <div className="absolute top-4 right-4 text-green-700 text-sm">ARROWS to Move | ESC to Quit</div>
      
      {gameOver && (
        <div className="absolute z-50 text-center bg-black/90 p-8 border border-green-500">
          <h2 className="text-3xl text-green-500 mb-4 animate-pulse">TERMINATED</h2>
          <p className="text-green-300 mb-6">Final Score: {score}</p>
          <button 
            onClick={onExit}
            className="px-4 py-2 bg-green-900/50 text-green-400 hover:bg-green-500 hover:text-black transition-colors border border-green-500"
          >
            RETURN TO TERMINAL
          </button>
        </div>
      )}
      
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
