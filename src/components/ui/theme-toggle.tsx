"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Sunset } from "lucide-react"; // Sunset represents "Middle"
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex gap-1 bg-white/10 rounded-full p-1 border border-white/10">
      <button 
        onClick={() => setTheme("light")} 
        className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
        aria-label="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button 
        onClick={() => setTheme("middle")} 
        className={`p-1.5 rounded-full transition-colors ${theme === 'middle' ? 'bg-slate-500 text-white' : 'text-slate-400 hover:text-white'}`}
        aria-label="Middle Mode"
      >
        <Sunset className="w-4 h-4" />
      </button>
      <button 
        onClick={() => setTheme("dark")} 
        className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white'}`}
        aria-label="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
};
