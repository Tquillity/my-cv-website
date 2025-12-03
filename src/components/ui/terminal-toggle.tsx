"use client";

import { Terminal } from "lucide-react";

export const TerminalToggle: React.FC = () => {
  const handleClick = () => {
    console.log("Toggle Terminal Mode");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
      aria-label="Toggle Terminal Mode"
    >
      <Terminal className="w-6 h-6" />
    </button>
  );
};

