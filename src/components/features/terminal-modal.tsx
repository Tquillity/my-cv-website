"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TerminalIcon, Maximize2, Minimize2, Gamepad2 } from "lucide-react";
import { useTerminal } from "@/lib/terminal-context";
import { MatrixRain } from "./matrix-rain";
import { useTranslations } from "next-intl";
import { useTerminalSound } from "@/hooks/use-terminal-sound";

// Import Games
import { SpaceDefense } from "@/components/games/space-defense";
import { CyberRun } from "@/components/games/cyber-run";
import { CyberSnake } from "@/components/games/cyber-snake";
import { VectorRacer } from "@/components/games/vector-racer";

interface Command {
  input: string;
  output: React.ReactNode;
  style?: "normal" | "error" | "success" | "warning";
  prompt?: string;
}

// 1. UPDATE TYPE
type GameState = "NONE" | "ASTEROIDS" | "RUNNER" | "SNAKE" | "RACER";

export const TerminalModal = ({ locale }: { locale: string }) => {
  const t = useTranslations("Terminal");
  const t_data = useTranslations("AboutPage");
  const { isOpen, close } = useTerminal();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([
    { input: "", output: "MIKAEL_OS v2.0.4 [Protected Mode]" }, // Kept hardcoded as it's a system string, or could use t('welcome_os') if preferred but prompt says "welcome_os" in json
  ]);

  // Init history with localized strings on mount/open
  useEffect(() => {
      if (isOpen) {
          setHistory([
              { input: "", output: t('welcome_os') },
              { input: "", output: t('help_prompt') }
          ]);
      }
  }, [isOpen, t]);


  // Advanced States
  const [matrixMode, setMatrixMode] = useState(false);
  const [gameState, setGameState] = useState<GameState>("NONE");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [showJokeModal, setShowJokeModal] = useState(false);
  const [jokeContent, setJokeContent] = useState({ title: "", body: "" });
  const [clickCount, setClickCount] = useState(0);
  const [isRoot, setIsRoot] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const { playKeystroke } = useTerminalSound();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // History Navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const validHistory = history.filter(h => h.input.trim() !== "");
      if (validHistory.length === 0) return;
      
      const newIndex = Math.min(historyIndex + 1, validHistory.length - 1);
      setHistoryIndex(newIndex);
      setInput(validHistory[validHistory.length - 1 - newIndex].input);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      if (newIndex === -1) {
        setInput("");
      } else {
        const validHistory = history.filter(h => h.input.trim() !== "");
        setInput(validHistory[validHistory.length - 1 - newIndex].input);
      }
    }
  };

  // Prevent browser scroll when terminal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Prevent scroll on arrow keys globally when terminal is open
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
          e.preventDefault();
        }
      };

      window.addEventListener("keydown", handleGlobalKeyDown, { passive: false });

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleGlobalKeyDown);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && gameState === "NONE") {
      setIsBooting(true);
      setBootLines([]);
      setHistory([
          { input: "", output: t('welcome_os') },
          { input: "", output: t('help_prompt') }
      ]); // Prepare main history for after boot

      // Boot Sequence
      const timeouts = [
        setTimeout(() => setBootLines(p => [...p, t('boot_line1')]), 100),
        setTimeout(() => setBootLines(p => [...p, t('boot_line2')]), 600),
        setTimeout(() => setBootLines(p => [...p, t('boot_line3')]), 1200),
        setTimeout(() => setBootLines(p => [...p, t('boot_line4')]), 1800),
        setTimeout(() => {
            setIsBooting(false);
            // Focus input after boot
            setTimeout(() => inputRef.current?.focus(), 50);
        }, 2600),
      ];

      scrollToBottom();
      setShowWarning(false);
      setShowFinalModal(false);
      setShowJokeModal(false);
      setClickCount(0);

      return () => timeouts.forEach(clearTimeout);
    }
  }, [isOpen, gameState, t]);

  useEffect(() => {
      scrollToBottom();
  }, [bootLines, history]);


  // Handle outside clicks with warning system
  useEffect(() => {
    if (!isOpen) return;

    let clickTimer: NodeJS.Timeout;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element;
      const terminalContainer = document.querySelector('[data-terminal-container]');

      if (terminalContainer && terminalContainer.contains(target)) return;

      if (showWarning || showFinalModal || showJokeModal) return;

      setClickCount(prev => {
        const newCount = prev + 1;

        if (newCount === 1) {
          setShowWarning(true);
          clickTimer = setTimeout(() => {
            setClickCount(0);
            setShowWarning(false);
          }, 6000);

        } else if (newCount === 2) {
          clearTimeout(clickTimer);
          setShowWarning(false);
          setShowFinalModal(true);
          setTimeout(() => close(), 3000);
        }

        return newCount;
      });
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (clickTimer) clearTimeout(clickTimer);
    };
  }, [isOpen, showWarning, showFinalModal, showJokeModal, close]);

  const scrollToBottom = () => scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  // ----------------------------------------------------------------
  // LOGIC ENGINE
  // ----------------------------------------------------------------
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    setHistoryIndex(-1);
    const rawCmd = input.trim();
    const cmd = rawCmd.toLowerCase();

    if (!cmd) return;

    let output: React.ReactNode = "";
    let style: Command["style"] = "normal";

    // 2. STANDARD COMMANDS
    switch (true) {
      case cmd === "help":
        output = (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 max-w-md">
            <span>help</span> <span className="text-slate-500">{t('help_desc')}</span>
            <span>whoami</span> <span className="text-slate-500">{t('whoami_desc')}</span>
            <span>about</span> <span className="text-slate-500">{t('about_desc')}</span>
            <span>projects</span> <span className="text-slate-500">{t('projects_desc')}</span>
            <span>skills</span> <span className="text-slate-500">{t('skills_desc')}</span>
            <span>games</span> <span className="text-slate-500">{t('games_desc')}</span>
            <span>clear</span> <span className="text-slate-500">{t('clear_desc')}</span>
            <span>exit</span> <span className="text-slate-500">{t('exit_desc')}</span>
            <span className="col-span-2 text-slate-600 mt-2 italic">{t('sudo_hint')}</span>
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
        if (isRoot) {
             setIsRoot(false);
             output = t('root_logout');
        } else {
             close();
        }
        break;

      // 3. DATA DISPLAY (Reading "files")
      case cmd === "about":
        output = (
            <div className="space-y-2 border-l-2 border-green-800 pl-4 my-2">
                <p className="text-white font-bold">Subject: Mikael Sundh</p>
                <p>{t_data('intro')}</p>
                <p className="opacity-70">Experience: {t_data('experience_section')}</p>
                <p className="text-xs text-green-700">END OF FILE</p>
            </div>
        );
        break;

      case cmd === "projects":
        output = (
            <div className="whitespace-pre font-mono text-xs sm:text-sm overflow-x-auto text-green-300">
{t('projects_table')}
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
            <div className="space-y-2">
                <p>{t('games_header')}</p>
                <ul className="list-disc pl-5 text-green-300">
                    <li>{t('game_asteroids')}</li>
                    <li>{t('game_runner')}</li>
                    <li>{t('game_snake')}</li>
                    <li>{t('game_racer')}</li>
                    <li>{t('game_nuke')}</li>
                    <li>{t('game_hl3')}</li>
                </ul>
            </div>
        );
        break;
      
      // 5. GAME TRIGGERS
      case cmd === "asteroids":
        setGameState("ASTEROIDS");
        setInput("");
        return; // Return early to skip history update
      case cmd === "runner":
        setGameState("RUNNER");
        setInput("");
        return; 
      case cmd === "snake":
        setGameState("SNAKE");
        setInput("");
        return;
      case cmd === "racer":
        setGameState("RACER");
        setInput("");
        return;
      case cmd === "nuke":
        setJokeContent({ title: "Duke Nukem Forever", body: "😂 😂 😂" });
        setShowJokeModal(true);
        setTimeout(() => setShowJokeModal(false), 3000);
        setInput("");
        return;
      case cmd === "hl3":
        setJokeContent({ title: "Half-Life 3", body: "😂 😂 😂" });
        setShowJokeModal(true);
        setTimeout(() => setShowJokeModal(false), 3000);
        setInput("");
        return;

      // 6. SUDO / EASTER EGGS
      case cmd.startsWith("sudo"):
        // ROOT CHECK
        if (isRoot && cmd !== "sudo system_override") {
             output = t('root_exists');
             style = "success";
             break;
        }

        if (cmd === "sudo matrix") {
            setMatrixMode(prev => !prev);
            output = matrixMode ? t('matrix_disabled') : t('matrix_enabled');
            style = "success";
        } else if (cmd.includes("rm -rf")) {
            output = t('rm_rf_error');
            style = "error";
        } else if (cmd.includes("make me a sandwich")) {
            output = t('sudo_sandwich');
            style = "warning";
        } else if (cmd === "sudo coin") {
            // Coin Egg
            const result = Math.random() > 0.5 ? t('coin_heads') : t('coin_tails');
            output = `${t('coin_flipping')} ${result}`;
            style = "success";
        } else if (cmd === "sudo system_override") {
            if(isRoot) {
                 output = t('already_root');
            } else {
                 setIsRoot(true);
                 output = t('root_granted');
                 style = "success";
            }
        } else if (cmd.includes("godmode")) {
            output = t('godmode_unlocked');
            style = "success";
        } else {
            output = t('access_denied');
            style = "error";
        }
        break;

      case cmd === "whoami":
         output = isRoot 
            ? t('whoami_root')
            : t('whoami_guest');
         break;

      default:
        output = `Command not found: ${rawCmd}`;
        style = "error";
    }

    setHistory(prev => [...prev, { 
        input: rawCmd, 
        output, 
        style,
        prompt: isRoot ? "root@mikael-cv:~#" : "guest@mikael-cv:~$"
    }]);
    setInput("");
  };

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* BACKDROP DIMMER */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={close} 
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
                    <div className="text-lg font-bold mb-4">{t('warning_title')}</div>
                    <div className="text-sm space-y-2">
                      <p>{t('warning_line1')}</p>
                      <p>{t('warning_line2')}</p>
                      <p className="text-xs opacity-70 mt-4">{t('warning_line3')}</p>
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
                    <div className="text-lg font-bold mb-4">{t('final_title')}</div>
                    <div className="text-sm">
                      <p>{t('final_line1')}</p>
                      <p className="text-xs opacity-70 mt-4">{t('final_line2')}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* JOKE MODAL */}
            <AnimatePresence>
              {showJokeModal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-[110] flex items-center justify-center p-4"
                >
                  <div className="bg-black/90 border-2 border-green-500 rounded-lg p-6 max-w-md mx-4 text-center text-green-400 font-mono">
                    <div className="text-lg font-bold mb-4">{jokeContent.title}</div>
                    <div className="text-sm">
                      <div className="text-4xl mb-4">{jokeContent.body}</div>
                      <p className="text-green-300 font-bold">{t('coming_soon')}!</p>
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
                onClick={() => gameState === "NONE" && inputRef.current?.focus()}
            >
                {/* 1. MATRIX RAIN LAYER (Conditional) */}
                {matrixMode && <MatrixRain />}

                {/* 2. CRT SCANLINE OVERLAY (Always on) */}
                <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

                {/* 3. HEADER */}
                <div className="relative z-30 flex justify-between items-center px-4 py-2 bg-green-900/20 border-b border-green-800 text-green-400">
                    <div className="flex items-center gap-2">
                         {gameState !== "NONE" ? <Gamepad2 className="w-4 h-4 text-green-300 animate-pulse" /> : <TerminalIcon className="w-4 h-4" />}
                        <span className="font-bold tracking-wider">
                             {gameState === "NONE" ? "MIKAEL_OS_TERMINAL" : `PLAYING: ${gameState}`}
                        </span>
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
                <div className="relative z-30 flex-1 overflow-hidden bg-black/50">
                  {gameState === "ASTEROIDS" && (
                      <SpaceDefense onExit={() => setGameState("NONE")} />
                  )}
                  {gameState === "RUNNER" && (
                      <CyberRun onExit={() => setGameState("NONE")} />
                  )}
                  {gameState === "SNAKE" && (
                      <CyberSnake onExit={() => setGameState("NONE")} />
                  )}
                  {gameState === "RACER" && (
                      <VectorRacer onExit={() => setGameState("NONE")} />
                  )}

                  {gameState === "NONE" && (
                    <div 
                      className="h-full overflow-y-auto p-4 md:p-6 space-y-2 text-green-500 scrollbar-hide" 
                      onClick={() => inputRef.current?.focus()}
                      onWheel={(e) => {
                        // Prevent scroll propagation to browser when scrolling inside terminal
                        e.stopPropagation();
                      }}
                      onTouchMove={(e) => {
                        // Prevent touch scroll propagation
                        e.stopPropagation();
                      }}
                    >
                        
                        {/* BOOT SCREEN */}
                        {isBooting ? (
                            <div className="space-y-1">
                                {bootLines.map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                                <div className="animate-pulse">_</div>
                            </div>
                        ) : (
                            /* MAIN TERMINAL */
                            <>
                                {history.map((line, i) => (
                                    <div key={i} className={`${
                                        line.style === 'error' ? 'text-red-400' :
                                        line.style === 'success' ? 'text-green-300' :
                                        line.style === 'warning' ? 'text-yellow-400' :
                                        'text-green-500'
                                    }`}>
                                        {line.input && (
                                            <div className="flex gap-2 opacity-70">
                                                <span>{line.prompt || "guest@mikael-cv:~$"}</span>
                                                <span>{line.input}</span>
                                            </div>
                                        )}
                                        <div className="whitespace-pre-wrap leading-relaxed ml-2">{line.output}</div>
                                    </div>
                                ))}

                                {/* CUSTOM BLOCK CURSOR INPUT */}
                                <form onSubmit={handleCommand} className="flex gap-2 items-center mt-4 relative">
                                    <span className={`shrink-0 font-bold ${isRoot ? "text-red-500" : "text-green-400"}`}>
                                        {isRoot ? "root@mikael-cv:~#" : "guest@mikael-cv:~$"}
                                    </span>
                                    
                                    <div className="relative flex-1">
                                        {/* Visible Text & Cursor */}
                                        <div className="absolute inset-0 pointer-events-none flex items-center">
                                            <span className="whitespace-pre-wrap text-green-100">{input}</span>
                                            <span className={`w-3 h-5 animate-pulse ml-0.5 align-middle ${isRoot ? "bg-red-500" : "bg-green-500"}`}></span>
                                        </div>

                                        {/* Hidden Real Input */}
                                        <input
                                            ref={inputRef}
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value);
                                                playKeystroke();
                                            }}
                                            onKeyDown={handleKeyDown}
                                            className="w-full opacity-0 bg-transparent border-none outline-none text-transparent caret-transparent cursor-default"
                                            autoFocus
                                            spellCheck={false}
                                            autoComplete="off"
                                        />
                                    </div>
                                </form>
                            </>
                        )}
                        <div ref={scrollRef} />
                    </div>
                  )}
                </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
