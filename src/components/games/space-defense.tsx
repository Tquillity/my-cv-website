"use client";

import { useEffect, useRef, useState } from "react";

export const SpaceDefense = ({ onExit }: { onExit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Game State
    let animationId: number;
    let ship = { x: canvas.width / 2, y: canvas.height / 2, a: 0, v: { x: 0, y: 0 }, r: 10 };
    let asteroids: any[] = [];
    let bullets: any[] = [];
    let keys: { [key: string]: boolean } = {};
    let isRunning = true;
    let localScore = 0;

    // Resize
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Spawn Asteroid
    const spawnAsteroid = () => {
      const x = Math.random() < 0.5 ? 0 : canvas.width;
      const y = Math.random() * canvas.height;
      asteroids.push({
        x, y,
        v: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
        r: 20 + Math.random() * 20,
        verts: Math.floor(Math.random() * 5) + 5 // Polygon vertices
      });
    };

    // Init
    for (let i = 0; i < 5; i++) spawnAsteroid();

    // Controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      keys[e.code] = true;
      if (e.code === "Space" && isRunning) {
        bullets.push({
          x: ship.x + Math.cos(ship.a) * ship.r,
          y: ship.y + Math.sin(ship.a) * ship.r,
          v: { x: Math.cos(ship.a) * 5, y: Math.sin(ship.a) * 5 },
          life: 60
        });
      }
      if (e.code === "Escape") onExit();
    };

    const handleKeyUp = (e: KeyboardEvent) => keys[e.code] = false;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Game Loop
    const loop = () => {
      if (!isRunning) return;

      ctx.fillStyle = "rgba(0,0,0,0.3)"; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#22c55e"; // Tailwind Green-500
      ctx.lineWidth = 2;

      // Update Ship
      if (keys["ArrowLeft"]) ship.a -= 0.1;
      if (keys["ArrowRight"]) ship.a += 0.1;
      if (keys["ArrowUp"]) {
        ship.v.x += Math.cos(ship.a) * 0.1;
        ship.v.y += Math.sin(ship.a) * 0.1;
      }
      
      // Friction
      ship.v.x *= 0.99;
      ship.v.y *= 0.99;
      ship.x += ship.v.x;
      ship.y += ship.v.y;

      // Wrap Ship
      if (ship.x < 0) ship.x = canvas.width;
      if (ship.x > canvas.width) ship.x = 0;
      if (ship.y < 0) ship.y = canvas.height;
      if (ship.y > canvas.height) ship.y = 0;

      // Draw Ship
      ctx.beginPath();
      ctx.moveTo(ship.x + Math.cos(ship.a) * ship.r, ship.y + Math.sin(ship.a) * ship.r);
      ctx.lineTo(ship.x + Math.cos(ship.a + 2.6) * ship.r, ship.y + Math.sin(ship.a + 2.6) * ship.r);
      ctx.lineTo(ship.x + Math.cos(ship.a - 2.6) * ship.r, ship.y + Math.sin(ship.a - 2.6) * ship.r);
      ctx.closePath();
      ctx.stroke();

      // Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.x += b.v.x;
        b.y += b.v.y;
        b.life--;

        ctx.beginPath();
        ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
        ctx.stroke();

        if (b.life <= 0) bullets.splice(i, 1);
      }

      // Asteroids
      for (let i = asteroids.length - 1; i >= 0; i--) {
        let a = asteroids[i];
        a.x += a.v.x;
        a.y += a.v.y;

        // Wrap Asteroid
        if (a.x < -a.r) a.x = canvas.width + a.r;
        if (a.x > canvas.width + a.r) a.x = -a.r;
        if (a.y < -a.r) a.y = canvas.height + a.r;
        if (a.y > canvas.height + a.r) a.y = -a.r;

        // Draw Asteroid (Jagged Polygon)
        ctx.beginPath();
        for (let j = 0; j < a.verts; j++) {
            const angle = (Math.PI * 2 / a.verts) * j;
            ctx.lineTo(a.x + Math.cos(angle) * a.r, a.y + Math.sin(angle) * a.r);
        }
        ctx.closePath();
        ctx.stroke();

        // Collision: Bullet vs Asteroid
        for (let j = bullets.length - 1; j >= 0; j--) {
            const dx = bullets[j].x - a.x;
            const dy = bullets[j].y - a.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < a.r) {
                asteroids.splice(i, 1);
                bullets.splice(j, 1);
                localScore += 100;
                setScore(localScore);
                spawnAsteroid();
                // Spawn extra if cleared too fast
                if (Math.random() > 0.5) spawnAsteroid();
                break;
            }
        }

        // Collision: Ship vs Asteroid
        const dx = ship.x - a.x;
        const dy = ship.y - a.y;
        if (Math.sqrt(dx*dx + dy*dy) < a.r + ship.r) {
            isRunning = false;
            setGameOver(true);
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
  }, [onExit]);

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono">
      <div className="absolute top-4 left-4 text-green-500 text-xl font-bold">SCORE: {score}</div>
      <div className="absolute top-4 right-4 text-green-700 text-sm">ARROWS to Move | SPACE to Shoot | ESC to Quit</div>
      
      {gameOver && (
        <div className="absolute z-50 text-center bg-black/90 p-8 border border-green-500">
          <h2 className="text-3xl text-green-500 mb-4 animate-pulse">GAME OVER</h2>
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
