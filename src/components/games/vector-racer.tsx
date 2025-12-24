"use client";

import { useEffect, useRef, useState } from "react";

interface VectorRacerStrings {
  score: string;
  controls: string;
  crashed: string;
  finalScore: string;
  playAgain: string;
  returnTerminal: string;
}

export const VectorRacer = ({ 
  onExit, 
  strings 
}: { 
  onExit: () => void;
  strings: VectorRacerStrings;
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

    // Resize
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Game State
    let animationId: number;
    let frame = 0;
    let speed = 5;
    let isRunning = true;
    let carX = canvas.width / 2;
    const carY = canvas.height - 100;
    const carW = 30;
    const carH = 50;
    
    let obstacles: { x: number, y: number, w: number, h: number }[] = [];
    let roadLines: { y: number }[] = [];

    // Controls
    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent browser scroll
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
            e.preventDefault();
        }
        keys[e.code] = true;
        if (e.code === "Escape") onExit();
    };

    const handleKeyUp = (e: KeyboardEvent) => keys[e.code] = false;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Init Road Lines
    for(let i=0; i<10; i++) roadLines.push({ y: i * 100 });

    const loop = () => {
      if (!isRunning) return;
      frame++;
      
      // Speed up
      if (frame % 600 === 0) speed += 1;

      // Move Car
      if (keys["ArrowLeft"] && carX > canvas.width * 0.25) carX -= 7;
      if (keys["ArrowRight"] && carX < canvas.width * 0.75 - carW) carX += 7;

      // Spawn Obstacles
      if (frame % (60 - Math.min(40, speed)) === 0) {
          const laneWidth = (canvas.width * 0.5);
          const spawnX = (canvas.width * 0.25) + Math.random() * (laneWidth - 40);
          obstacles.push({ x: spawnX, y: -50, w: 40, h: 40 });
      }

      // Render Background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Road Borders
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.25, 0);
      ctx.lineTo(canvas.width * 0.25, canvas.height);
      ctx.moveTo(canvas.width * 0.75, 0);
      ctx.lineTo(canvas.width * 0.75, canvas.height);
      ctx.stroke();

      // Render Moving Road Lines
      ctx.lineWidth = 2;
      ctx.beginPath();
      roadLines.forEach(line => {
          line.y += speed;
          if (line.y > canvas.height) line.y = -100;
          ctx.moveTo(canvas.width / 2, line.y);
          ctx.lineTo(canvas.width / 2, line.y + 50);
      });
      ctx.stroke();

      // Render Car
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(carX, carY, carW, carH);

      // Wheels
      ctx.fillRect(carX - 2, carY + 5, 2, 10);
      ctx.fillRect(carX + carW, carY + 5, 2, 10);
      ctx.fillRect(carX - 2, carY + 35, 2, 10);
      ctx.fillRect(carX + carW, carY + 35, 2, 10);

      // Render Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
          let obs = obstacles[i];
          obs.y += speed;
          ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
          
          // Collision
          if (
              carX < obs.x + obs.w &&
              carX + carW > obs.x &&
              carY < obs.y + obs.h &&
              carY + carH > obs.y
          ) {
              isRunning = false;
              setGameOver(true);
          }

          if (obs.y > canvas.height) {
              obstacles.splice(i, 1);
              setScore(s => s + 10);
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
          <h2 className="text-3xl text-green-500 mb-4 animate-pulse">{strings.crashed}</h2>
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
