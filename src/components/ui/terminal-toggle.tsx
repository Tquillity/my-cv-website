"use client";

import { Terminal } from "lucide-react";
import { useTerminal } from "@/lib/terminal-context";

export const TerminalToggle: React.FC = () => {
  const { toggle } = useTerminal();

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground hover:bg-black hover:text-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-300"
      aria-label="Toggle Terminal Mode"
    >
      <Terminal className="w-6 h-6" />
    </button>
  );
};

