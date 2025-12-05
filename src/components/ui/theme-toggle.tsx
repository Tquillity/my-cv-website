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
    <div className="flex gap-1 bg-popover/80 rounded-full p-1 border border-border">
      <button 
        onClick={() => setTheme("light")} 
        className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'text-popover-foreground hover:text-foreground'}`}
        aria-label="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button 
        onClick={() => setTheme("middle")} 
        className={`p-1.5 rounded-full transition-colors ${theme === 'middle' ? 'bg-primary text-primary-foreground' : 'text-popover-foreground hover:text-foreground'}`}
        aria-label="Middle Mode"
      >
        <Sunset className="w-4 h-4" />
      </button>
      <button 
        onClick={() => setTheme("dark")} 
        className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'text-popover-foreground hover:text-foreground'}`}
        aria-label="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
};
