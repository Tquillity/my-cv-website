"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TerminalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTerminal } from "@/lib/terminal-context";

interface Command {
  input: string;
  output: React.ReactNode;
}

export const TerminalModal = ({ locale }: { locale: string }) => {
  const { isOpen, close } = useTerminal();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([
    { input: "", output: "Welcome to MIKAEL_OS v1.0. Type 'help' for commands." }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      scrollToBottom();
    }
  }, [isOpen, history]);

  const scrollToBottom = () => scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    let output: React.ReactNode = "";

    switch (cmd) {
      case "help":
        output = "Available commands: about, projects, home, clear, contact, whoami";
        break;
      case "about":
        output = "Navigating to /about...";
        setTimeout(() => { close(); router.push(`/${locale}/about`); }, 800);
        break;
      case "projects":
        output = "Accessing secure project database...";
        setTimeout(() => { close(); router.push(`/${locale}/portfolio`); }, 800);
        break;
      case "home":
        output = "Returning to base...";
        setTimeout(() => { close(); router.push(`/${locale}/`); }, 800);
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "whoami":
        output = "User: Guest | Role: Recruiter/Visitor";
        break;
      case "contact":
        output = "Initializing email protocol...";
        window.location.href = "mailto:your-email@example.com";
        break;
      default:
        output = `Command not found: ${cmd}. Type 'help' for assistance.`;
    }

    setHistory(prev => [...prev, { input: cmd, output }]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-black/95 text-green-500 font-mono p-4 md:p-10 flex flex-col"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%]" />

          <div className="relative z-20 flex justify-between items-center mb-4 border-b border-green-500/30 pb-2">
            <div className="flex items-center gap-2">
               <TerminalIcon className="w-5 h-5" />
               <span>MIKAEL_OS TERMINAL</span>
            </div>
            <button onClick={close} className="hover:text-green-400"><X className="w-6 h-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pb-4 font-bold text-sm md:text-base">
            {history.map((line, i) => (
              <div key={i}>
                {line.input && <div className="opacity-50">$ {line.input}</div>}
                <div className="whitespace-pre-wrap">{line.output}</div>
              </div>
            ))}

            <form onSubmit={handleCommand} className="flex gap-2">
              <span className="text-green-500">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-green-400 placeholder-green-800"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </form>
            <div ref={scrollRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};