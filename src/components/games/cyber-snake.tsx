"use client";

import { useEffect, useRef, useState } from "react";

interface CyberSnakeStrings {
  length: string;
  controls: string;
  terminated: string;
  finalScore: string;
  playAgain: string;
  returnTerminal: string;
}

export const CyberSnake = ({ 
  onExit, 
  strings 
}: { 
  onExit: () => void;
  strings: CyberSnakeStrings;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState(0);
  
  // Track held keys for sprint
  const keysHeld = useRef<Set<string>>(new Set());

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

    // Reset held keys
    keysHeld.current.clear();

    // Grid System
    const gridSize = 20;
    let tileCountX = 0;
    let tileCountY = 0;
    let offsetX = 0;
    let offsetY = 0;

    const resize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        tileCountX = Math.floor(canvas.width / gridSize);
        tileCountY = Math.floor(canvas.height / gridSize);
        offsetX = (canvas.width - tileCountX * gridSize) / 2;
        offsetY = (canvas.height - tileCountY * gridSize) / 2;
    };
    resize();

    // Game State
    let baseSpeed = 7;
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
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
            e.preventDefault();
        }
        keysHeld.current.add(e.code); // Add to held set

        if (e.code === "Escape") onExit();
        if (!isRunning) return;

        // Direction logic
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

    const handleKeyUp = (e: KeyboardEvent) => {
        keysHeld.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let lastTime = 0;
    const loop = (currentTime: number) => {
        animationId = requestAnimationFrame(loop);
        if (!isRunning) return;

        // SPRINT LOGIC
        let currentSpeed = baseSpeed;
        const held = keysHeld.current;
        // If holding the button for the current direction, double speed
        if (
            (xv === -1 && held.has("ArrowLeft")) ||
            (xv === 1 && held.has("ArrowRight")) ||
            (yv === -1 && held.has("ArrowUp")) ||
            (yv === 1 && held.has("ArrowDown"))
        ) {
            currentSpeed = baseSpeed * 2.5;
        }

        const secondsSinceLastRender = (currentTime - lastTime) / 1000;
        if (secondsSinceLastRender < 1 / currentSpeed) return;

        lastTime = currentTime;

        px += xv;
        py += yv;

        // WALL COLLISION (Wrap)
        if (px < 0) px = tileCountX - 1;
        if (px > tileCountX - 1) px = 0;
        if (py < 0) py = tileCountY - 1;
        if (py > tileCountY - 1) py = 0;

        // Render Background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // APPLY OFFSET
        ctx.save();
        ctx.translate(offsetX, offsetY);

        // Draw Bounds
        ctx.strokeStyle = "#0f3918"; // Dark green boundary
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, tileCountX * gridSize, tileCountY * gridSize);

        // Render Snake
        ctx.fillStyle = "#22c55e";
        for (let i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);
            if (trail[i].x === px && trail[i].y === py) {
                if (tail > 5) {
                    isRunning = false;
                    setGameOver(true);
                }
            }
        }

        trail.push({ x: px, y: py });
        while (trail.length > tail) {
            trail.shift();
        }

        if (ax === px && ay === py) {
            tail++;
            setScore(prev => prev + 10);
            ax = Math.floor(Math.random() * tileCountX);
            ay = Math.floor(Math.random() * tileCountY);
            if (baseSpeed < 20) baseSpeed += 0.5;
        }

        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 2;
        ctx.strokeRect(ax * gridSize, ay * gridSize, gridSize - 2, gridSize - 2);
        
        ctx.restore();
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
      <div className="absolute top-4 left-4 text-green-500 text-xl font-bold">{strings.length} {score}</div>
      <div className="absolute top-4 right-4 text-green-700 text-sm">{strings.controls}</div>
      
      {gameOver && (
        <div className="absolute z-50 text-center bg-black/90 p-8 border border-green-500">
          <h2 className="text-3xl text-green-500 mb-4 animate-pulse">{strings.terminated}</h2>
          <p className="text-green-300 mb-6">{strings.finalScore} {score}</p>
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
