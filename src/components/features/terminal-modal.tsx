"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TerminalIcon, Maximize2, Minimize2, Gamepad2 } from "lucide-react";
import { useTerminal } from "@/lib/terminal-context";
import { MatrixRain } from "./matrix-rain";
import { useTerminalSound } from "@/hooks/use-terminal-sound";
import { getTerminalString, getAboutPageString } from "@/lib/terminal-strings";
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

type GameState = "NONE" | "ASTEROIDS" | "RUNNER" | "SNAKE" | "RACER";

const t = (key: string): string => getTerminalString(key);
const t_data = (key: string): string => getAboutPageString(key);

export const TerminalModal = ({ locale }: { locale: string }) => {
  const { isOpen, close } = useTerminal();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([]);

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
  const containerRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    if (isOpen) {
      lastActiveElementRef.current = document.activeElement as HTMLElement | null;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          close();
          return;
        }

        const active = document.activeElement;
        const inTerminal = !!(containerRef.current && active && containerRef.current.contains(active));
        if (!inTerminal) return;

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
        }

        if (e.key === "Tab" && containerRef.current) {
          const focusable = Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(
              'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          const current = document.activeElement as HTMLElement | null;

          if (!e.shiftKey && current === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && current === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };

      window.addEventListener("keydown", handleGlobalKeyDown, { passive: false });

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleGlobalKeyDown);
        lastActiveElementRef.current?.focus();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHistory([
        { input: "", output: t('welcome_os') },
        { input: "", output: t('help_prompt') }
      ]);
    }
  }, [isOpen]); // Removed 't' dependency

  useEffect(() => {
    if (isOpen && gameState === "NONE") {
      setIsBooting(true);
      setBootLines([]);

      const bootSequence = [
        { line: t('boot_line1'), delay: 100 },
        { line: t('boot_line2'), delay: 600 },
        { line: t('boot_line3'), delay: 1200 },
        { line: t('boot_line4'), delay: 1800 },
      ];

      const timers = bootSequence.map(item => 
        setTimeout(() => setBootLines(prev => [...prev, item.line]), item.delay)
      );

      const endTimer = setTimeout(() => {
        setIsBooting(false);
      }, 2600);

      scrollToBottom();
      setShowWarning(false);
      setShowFinalModal(false);
      setShowJokeModal(false);
      setClickCount(0);

      return () => {
        timers.forEach(clearTimeout);
        clearTimeout(endTimer);
      };
    }
  }, [isOpen]); // Removed gameState dependency to prevent re-booting when returning from games

  useEffect(() => {
    if (!isBooting && isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isBooting, isOpen]);

  useEffect(() => {
      scrollToBottom();
  }, [bootLines, history]);


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

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    setHistoryIndex(-1);
    const rawCmd = input.trim();
    const cmd = rawCmd.toLowerCase();

    if (!cmd) return;

    let output: React.ReactNode = "";
    let style: Command["style"] = "normal";

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

      case cmd === "about":
        output = (
            <div className="space-y-2 border-l-2 border-green-800 pl-4 my-2">
                <p className="text-white font-bold">{t("about_subject")}</p>
                <p>{t_data('intro')}</p>
                <p className="opacity-70">{t("experience_prefix")} {t_data('experience_section')}</p>
                <p className="text-xs text-green-700">{t("end_of_file")}</p>
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
        setJokeContent({ title: t('duke_nukem'), body: t("joke_body") });
        setShowJokeModal(true);
        setTimeout(() => setShowJokeModal(false), 3000);
        setInput("");
        return;
      case cmd === "hl3":
        setJokeContent({ title: t('half_life_3'), body: t("joke_body") });
        setShowJokeModal(true);
        setTimeout(() => setShowJokeModal(false), 3000);
        setInput("");
        return;

      case cmd.startsWith("sudo"):
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
        output = `${t('command_not_found')}: ${rawCmd}`;
        style = "error";
    }

    setHistory(prev => [...prev, { 
        input: rawCmd, 
        output, 
        style,
        prompt: isRoot ? t("prompt_root") : t("prompt_guest")
    }]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={close} 
            />

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
                      <div className="text-2xl mt-4">{t("heart")}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

            <motion.div
                data-terminal-container
                ref={containerRef}
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
                role="dialog"
                aria-modal="true"
                aria-labelledby="terminal-title"
            >
                {matrixMode && <MatrixRain />}

                <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

                <div className="relative z-30 flex justify-between items-center px-4 py-2 bg-green-900/20 border-b border-green-800 text-green-400">
                    <div className="flex items-center gap-2">
                         {gameState !== "NONE" ? <Gamepad2 className="w-4 h-4 text-green-300 animate-pulse" /> : <TerminalIcon className="w-4 h-4" />}
                        <h2 id="terminal-title" className="font-bold tracking-wider">
                             {gameState === "NONE" ? t('terminal_title') : `${t('playing')} ${gameState}`}
                        </h2>
                    </div>
                    <div className="flex gap-4">
                         <button
                           onClick={() => setIsFullScreen(!isFullScreen)}
                           className="hover:text-white"
                           aria-label={isFullScreen ? t("exit_fullscreen") : t("enter_fullscreen")}
                         >
                            {isFullScreen ? <Minimize2 className="w-4 h-4"/> : <Maximize2 className="w-4 h-4"/>}
                         </button>
                        <button onClick={close} className="hover:text-red-500 transition-colors" aria-label={t("close_terminal")}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="relative z-30 flex-1 overflow-hidden bg-black/50">
                  {gameState === "ASTEROIDS" && (
                      <SpaceDefense 
                        onExit={() => setGameState("NONE")}
                        strings={{
                          score: t('game_score'),
                          controls: t('space_defense_controls'),
                          gameOver: t('game_over'),
                          finalScore: t('game_final_score'),
                          playAgain: t('game_play_again'),
                          returnTerminal: t('game_return_terminal')
                        }}
                      />
                  )}
                  {gameState === "RUNNER" && (
                      <CyberRun 
                        onExit={() => setGameState("NONE")}
                        strings={{
                          score: t('game_score'),
                          controls: t('cyber_run_controls'),
                          missionFailed: t('mission_failed'),
                          scoreLabel: t('game_score_label'),
                          playAgain: t('game_play_again'),
                          returnTerminal: t('game_return_terminal')
                        }}
                      />
                  )}
                  {gameState === "SNAKE" && (
                      <CyberSnake 
                        onExit={() => setGameState("NONE")}
                        strings={{
                          length: t('game_length'),
                          controls: t('cyber_snake_controls'),
                          terminated: t('terminated'),
                          finalScore: t('game_final_score'),
                          playAgain: t('game_play_again'),
                          returnTerminal: t('game_return_terminal')
                        }}
                      />
                  )}
                  {gameState === "RACER" && (
                      <VectorRacer 
                        onExit={() => setGameState("NONE")}
                        strings={{
                          score: t('racer_score'),
                          controls: t('racer_controls'),
                          crashed: t('racer_crashed'),
                          finalScore: t('racer_final_score'),
                          playAgain: t('racer_play_again'),
                          returnTerminal: t('racer_return')
                        }}
                      />
                  )}

                  {gameState === "NONE" && (
                    <div 
                      className="h-full overflow-y-auto p-4 md:p-6 space-y-2 text-green-500 scrollbar-hide" 
                      onClick={() => inputRef.current?.focus()}
                      onWheel={(e) => {
                        e.stopPropagation();
                      }}
                      onTouchMove={(e) => {
                        e.stopPropagation();
                      }}
                    >
                        
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
                                <div className="sr-only" role="status" aria-live="polite">
                                  {t("terminal_ready")}
                                </div>
                                {history.map((line, i) => (
                                    <div key={i} className={`${
                                        line.style === 'error' ? 'text-red-400' :
                                        line.style === 'success' ? 'text-green-300' :
                                        line.style === 'warning' ? 'text-yellow-400' :
                                        'text-green-500'
                                    }`}>
                                        {line.input && (
                                            <div className="flex gap-2 opacity-70">
                                                <span>{line.prompt || t("prompt_guest")}</span>
                                                <span>{line.input}</span>
                                            </div>
                                        )}
                                        <div className="whitespace-pre-wrap leading-relaxed ml-2">{line.output}</div>
                                    </div>
                                ))}

                                <form onSubmit={handleCommand} className="flex gap-2 items-center mt-4 relative">
                                    <span className={`shrink-0 font-bold ${isRoot ? "text-red-500" : "text-green-400"}`}>
                                        {isRoot ? t("prompt_root") : t("prompt_guest")}
                                    </span>
                                    
                                    <div className="relative flex-1">
                                        <div className="absolute inset-0 pointer-events-none flex items-center">
                                            <span className="whitespace-pre-wrap text-green-100">{input}</span>
                                            <span className={`w-3 h-5 animate-pulse ml-0.5 align-middle ${isRoot ? "bg-red-500" : "bg-green-500"}`}></span>
                                        </div>

                                        <input
                                            id="terminal-input"
                                            name="terminal-command"
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
                                            aria-label={t("terminal_input")}
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
