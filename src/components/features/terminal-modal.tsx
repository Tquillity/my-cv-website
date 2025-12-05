"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TerminalIcon, Maximize2, Minimize2 } from "lucide-react";
import { useTerminal } from "@/lib/terminal-context";
import { MatrixRain } from "./matrix-rain";
import { useTranslations } from "next-intl";

interface Command {
  input: string;
  output: React.ReactNode;
  style?: "normal" | "error" | "success" | "warning";
}

// Simple Game State
type GameState = "NONE" | "GUESS_NUMBER";

export const TerminalModal = ({ locale }: { locale: string }) => {
  const t = useTranslations("AboutPage"); // Access existing data
  const { isOpen, close } = useTerminal();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([
    { input: "", output: "MIKAEL_OS v2.0.4 [Protected Mode]" },
    { input: "", output: "Type 'help' for a list of commands." }
  ]);

  // Advanced States
  const [matrixMode, setMatrixMode] = useState(false);
  const [gameState, setGameState] = useState<GameState>("NONE");
  const [gameData, setGameData] = useState<any>(null); // Store random number etc
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      scrollToBottom();
      // Reset warning state when terminal opens
      setShowWarning(false);
      setShowFinalModal(false);
      setClickCount(0);
    }
  }, [isOpen, history]);

  // Handle outside clicks with warning system
  useEffect(() => {
    if (!isOpen) return;

    let clickTimer: NodeJS.Timeout;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element;
      const terminalContainer = document.querySelector('[data-terminal-container]');

      // Don't close if clicking inside terminal
      if (terminalContainer && terminalContainer.contains(target)) {
        return;
      }

      // Don't trigger on warning modal or final modal clicks
      if (showWarning || showFinalModal) {
        return;
      }

      setClickCount(prev => {
        const newCount = prev + 1;

        if (newCount === 1) {
          // First click - show warning
          setShowWarning(true);

          // Reset click count after 6 seconds if no double click
          clickTimer = setTimeout(() => {
            setClickCount(0);
            setShowWarning(false);
          }, 6000);

        } else if (newCount === 2) {
          // Double click - show final modal
          clearTimeout(clickTimer);
          setShowWarning(false);
          setShowFinalModal(true);

          // Close terminal after 3 seconds
          setTimeout(() => {
            close();
          }, 3000);
        }

        return newCount;
      });
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (clickTimer) clearTimeout(clickTimer);
    };
  }, [isOpen, showWarning, showFinalModal, close]);

  const scrollToBottom = () => scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  // ----------------------------------------------------------------
  // LOGIC ENGINE
  // ----------------------------------------------------------------
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = input.trim();
    const cmd = rawCmd.toLowerCase();

    if (!cmd) return;

    // 1. GAME MODE INTERCEPTION
    if (gameState === "GUESS_NUMBER") {
        playGuessNumber(cmd);
        setInput("");
        return;
    }

    let output: React.ReactNode = "";
    let style: Command["style"] = "normal";

    // 2. STANDARD COMMANDS
    switch (true) {
      case cmd === "help":
        output = (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 max-w-md">
            <span>help</span> <span className="text-slate-500">Show this message</span>
            <span>whoami</span> <span className="text-slate-500">Current user info</span>
            <span>about</span> <span className="text-slate-500">Read bio (text mode)</span>
            <span>projects</span> <span className="text-slate-500">List projects (ASCII)</span>
            <span>skills</span> <span className="text-slate-500">Display technical stack</span>
            <span>games</span> <span className="text-slate-500">Play terminal games</span>
            <span>clear</span> <span className="text-slate-500">Clear screen</span>
            <span>exit</span> <span className="text-slate-500">Close terminal</span>
            <span className="col-span-2 text-slate-600 mt-2 italic">Try &apos;sudo&apos; commands for admin access...</span>
          </div>
        );
        break;

      case cmd === "clear":
        setHistory([]);
        setInput("");
        return;

      case cmd === "exit":
      case cmd === "logout":
      case cmd === "bye":
        close();
        break;

      // 3. DATA DISPLAY (Reading "files")
      case cmd === "about":
        output = (
            <div className="space-y-2 border-l-2 border-green-800 pl-4 my-2">
                <p className="text-white font-bold">Subject: Mikael Sundh</p>
                <p>{t('intro')}</p>
                <p className="opacity-70">Experience: {t('experience_section')}</p>
                <p className="text-xs text-green-700">END OF FILE</p>
            </div>
        );
        break;

      case cmd === "projects":
        output = (
            <div className="whitespace-pre font-mono text-xs sm:text-sm overflow-x-auto text-green-300">
{`
+----------------------+-------------------+-----------------------+
| PROJECT NAME         | STACK             | STATUS                |
+----------------------+-------------------+-----------------------+
| My CV Website        | Next.js, 3D, AI   | [Online]              |
| OmniComment          | React, Blockchain | [Archived]            |
| Smart Wallet         | Solidity, Web3    | [Deployed]            |
+----------------------+-------------------+-----------------------+
Type 'cat [project_name]' for details (Coming soon).
`}
            </div>
        );
        break;

      case cmd === "skills":
        output = (
            <div className="flex flex-wrap gap-2 text-sm">
                {["React", "Next.js", "Node.js", "Solidity", "Python", "Three.js"].map(s => (
                    <span key={s} className="bg-green-900/40 px-2 py-0.5 rounded border border-green-800">{s}</span>
                ))}
            </div>
        )
        break;

      // 4. GAMES
      case cmd === "games":
        output = (
            <div>
                <p>Available Games:</p>
                <ul className="list-disc pl-5 mt-1">
                    <li>guess (Guess the Number 1-100)</li>
                    <li>Duke Nukem Forever (Coming soon)</li>
                    <li>Half-Life 3 (Coming soon)</li>
                </ul>
            </div>
        );
        break;

      case cmd === "guess":
        setGameState("GUESS_NUMBER");
        setGameData({ target: Math.floor(Math.random() * 100) + 1, attempts: 0 });
        output = "GAME STARTED: I am thinking of a number between 1 and 100. Guess it.";
        style = "success";
        break;

      // 5. SUDO / EASTER EGGS
      case cmd.startsWith("sudo"):
        if (cmd === "sudo matrix") {
            setMatrixMode(prev => !prev);
            output = matrixMode ? "Disabling visual overlay..." : "Injecting visual code...";
            style = "success";
        } else if (cmd.includes("rm -rf")) {
            output = "CRITICAL ERROR: SYSTEM DELETION PREVENTED. NICE TRY.";
            style = "error";
        } else if (cmd.includes("make me a sandwich")) {
            output = "sudo: User is not in the sudoers file. Go make it yourself.";
            style = "warning";
        } else if (cmd.includes("godmode")) {
            output = "God Mode Unlocked: Just kidding, you are still a guest.";
            style = "success";
        } else {
            output = `Password for user 'guest': *********\nAccess Denied.`;
            style = "error";
        }
        break;

      case cmd === "whoami":
         output = "User: Guest | IP: ::1 | Access Level: Read Only";
         break;

      default:
        output = `Command not found: ${rawCmd}. Type 'help' for commands.`;
        style = "error";
    }

    setHistory(prev => [...prev, { input: rawCmd, output, style }]);
    setInput("");
  };

  // ----------------------------------------------------------------
  // GAME ENGINES
  // ----------------------------------------------------------------
  const playGuessNumber = (guessStr: string) => {
     if (guessStr === "quit" || guessStr === "exit") {
         setGameState("NONE");
         setHistory(prev => [...prev, { input: guessStr, output: "Game Exited." }]);
         return;
     }

     const guess = parseInt(guessStr);
     let response = "";
     let style: Command["style"] = "normal";

     if (isNaN(guess)) {
         response = "Please enter a valid number or type 'quit'.";
         style = "warning";
     } else {
         const { target, attempts } = gameData;
         const newAttempts = attempts + 1;

         if (guess === target) {
             response = `CORRECT! The number was ${target}. You won in ${newAttempts} attempts. (Game Over)`;
             style = "success";
             setGameState("NONE");
         } else if (guess < target) {
             response = "Too Low. Try again.";
             setGameData({ ...gameData, attempts: newAttempts });
         } else {
             response = "Too High. Try again.";
             setGameData({ ...gameData, attempts: newAttempts });
         }
     }

     setHistory(prev => [...prev, { input: guessStr, output: response, style }]);
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* BACKDROP DIMMER - Remove onClick since we handle it differently now */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* WARNING MODAL */}
            <AnimatePresence>
              {showWarning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-[110] flex items-center justify-center p-4"
                >
                  <div className="bg-black/90 border-2 border-green-500 rounded-lg p-6 max-w-md mx-4 text-center text-green-400 font-mono">
                    <div className="text-lg font-bold mb-4">⚠️ Welcome to 1994</div>
                    <div className="text-sm space-y-2">
                      <p>Clicking the desktop has never worked — not even back in X11 R5 days.</p>
                      <p>Please type &quot;exit&quot;, &quot;logout&quot;, or &quot;bye&quot; …or just use the proper [X] in the corner.</p>
                      <p className="text-xs opacity-70 mt-4">(Your mouse appreciates the gentle treatment!)</p>
                      <div className="text-2xl mt-4">❤️</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FINAL MODAL */}
            <AnimatePresence>
              {showFinalModal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-[110] flex items-center justify-center p-4"
                >
                  <div className="bg-black/90 border-2 border-green-500 rounded-lg p-6 max-w-md mx-4 text-center text-green-400 font-mono">
                    <div className="text-lg font-bold mb-4">OK, Sigh.</div>
                    <div className="text-sm">
                      <p>Modernity wins.</p>
                      <p className="text-xs opacity-70 mt-4">Closing terminal...</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CRT CONTAINER */}
            <motion.div
                data-terminal-container
                initial={{ scaleY: 0.1, scaleX: 0.8, opacity: 0 }}
                animate={{
                    scaleY: 1,
                    scaleX: 1,
                    opacity: 1,
                    transition: {
                        type: "spring",
                        duration: 0.4,
                        bounce: 0.3
                    }
                }}
                exit={{ scaleY: 0.1, scaleX: 0, opacity: 0, transition: { duration: 0.2 } }}
                className={`relative bg-black border-2 border-green-800 shadow-[0_0_50px_rgba(0,255,0,0.2)] overflow-hidden flex flex-col font-mono text-sm md:text-base ${
                    isFullScreen ? "w-full h-full" : "w-full max-w-4xl h-[80vh] rounded-lg"
                }`}
                onClick={() => inputRef.current?.focus()}
            >
                {/* 1. MATRIX RAIN LAYER (Conditional) */}
                {matrixMode && <MatrixRain />}

                {/* 2. CRT SCANLINE OVERLAY (Always on) */}
                <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

                {/* 3. HEADER */}
                <div className="relative z-30 flex justify-between items-center px-4 py-2 bg-green-900/20 border-b border-green-800 text-green-400">
                    <div className="flex items-center gap-2">
                        <TerminalIcon className="w-4 h-4" />
                        <span className="font-bold tracking-wider">MIKAEL_OS_TERMINAL</span>
                    </div>
                    <div className="flex gap-4">
                         <button onClick={() => setIsFullScreen(!isFullScreen)} className="hover:text-white">
                            {isFullScreen ? <Minimize2 className="w-4 h-4"/> : <Maximize2 className="w-4 h-4"/>}
                         </button>
                        <button onClick={close} className="hover:text-red-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 4. CONTENT AREA */}
                <div className="relative z-30 flex-1 overflow-y-auto p-4 md:p-6 space-y-2 text-green-500 scrollbar-hide">
                    {history.map((line, i) => (
                        <div key={i} className={`${
                            line.style === 'error' ? 'text-red-400' :
                            line.style === 'success' ? 'text-green-300' :
                            line.style === 'warning' ? 'text-yellow-400' :
                            'text-green-500'
                        }`}>
                            {line.input && (
                                <div className="flex gap-2 opacity-70">
                                    <span>guest@mikael-cv:~$</span>
                                    <span>{line.input}</span>
                                </div>
                            )}
                            <div className="whitespace-pre-wrap leading-relaxed ml-2">{line.output}</div>
                        </div>
                    ))}

                    {/* INPUT LINE */}
                    <form onSubmit={handleCommand} className="flex gap-2 items-center mt-4">
                        <span className="text-green-400 shrink-0 font-bold">
                            {gameState === "GUESS_NUMBER" ? "GAME >>" : "guest@mikael-cv:~$"}
                        </span>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-transparent border-none outline-none flex-1 text-green-100 placeholder-green-800 caret-green-500 terminal-text"
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </form>
                    <div ref={scrollRef} />
                </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};