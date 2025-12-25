"use client";

import { useCallback } from "react";

export interface TerminalHistoryLine {
  input: string;
  output: React.ReactNode;
  style?: "normal" | "error" | "success" | "warning";
  prompt?: string;
}

export type TerminalGameState = "NONE" | "ASTEROIDS" | "RUNNER" | "SNAKE" | "RACER";

type TFn = (key: string) => string;

interface UseTerminalEngineArgs {
  input: string;
  setInput: (next: string) => void;
  setHistory: React.Dispatch<React.SetStateAction<TerminalHistoryLine[]>>;
  setHistoryIndex: (next: number) => void;

  isRoot: boolean;
  setIsRoot: (next: boolean) => void;

  matrixMode: boolean;
  setMatrixMode: React.Dispatch<React.SetStateAction<boolean>>;

  setGameState: (next: TerminalGameState) => void;
  close: () => void;

  setShowJokeModal: (next: boolean) => void;
  setJokeContent: (next: { title: string; body: string }) => void;

  t: TFn;
  t_data: TFn;
}

export function useTerminalEngine({
  input,
  setInput,
  setHistory,
  setHistoryIndex,
  isRoot,
  setIsRoot,
  matrixMode,
  setMatrixMode,
  setGameState,
  close,
  setShowJokeModal,
  setJokeContent,
  t,
  t_data,
}: UseTerminalEngineArgs) {
  const handleCommand = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setHistoryIndex(-1);

      const rawCmd = input.trim();
      const cmd = rawCmd.toLowerCase();
      if (!cmd) return;

      let output: React.ReactNode = "";
      let style: TerminalHistoryLine["style"] = "normal";

      switch (true) {
        case cmd === "help":
          output = (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 max-w-md">
              <span>help</span> <span className="text-slate-500">{t("help_desc")}</span>
              <span>whoami</span> <span className="text-slate-500">{t("whoami_desc")}</span>
              <span>about</span> <span className="text-slate-500">{t("about_desc")}</span>
              <span>projects</span> <span className="text-slate-500">{t("projects_desc")}</span>
              <span>skills</span> <span className="text-slate-500">{t("skills_desc")}</span>
              <span>games</span> <span className="text-slate-500">{t("games_desc")}</span>
              <span>clear</span> <span className="text-slate-500">{t("clear_desc")}</span>
              <span>exit</span> <span className="text-slate-500">{t("exit_desc")}</span>
              <span className="col-span-2 text-slate-600 mt-2 italic">{t("sudo_hint")}</span>
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
            output = t("root_logout");
          } else {
            close();
          }
          break;

        case cmd === "about":
          output = (
            <div className="space-y-2 border-l-2 border-green-800 pl-4 my-2">
              <p className="text-white font-bold">{t("about_subject")}</p>
              <p>{t_data("intro")}</p>
              <p className="opacity-70">
                {t("experience_prefix")} {t_data("experience_section")}
              </p>
              <p className="text-xs text-green-700">{t("end_of_file")}</p>
            </div>
          );
          break;

        case cmd === "projects":
          output = (
            <div className="whitespace-pre font-mono text-xs sm:text-sm overflow-x-auto text-green-300">{t("projects_table")}</div>
          );
          break;

        case cmd === "skills":
          output = (
            <div className="flex flex-wrap gap-2 text-sm">
              {["React", "Next.js", "Node.js", "Solidity", "Python", "Three.js"].map((s) => (
                <span key={s} className="bg-green-900/40 px-2 py-0.5 rounded border border-green-800">
                  {s}
                </span>
              ))}
            </div>
          );
          break;

        case cmd === "games":
          output = (
            <div className="space-y-2">
              <p>{t("games_header")}</p>
              <ul className="list-disc pl-5 text-green-300">
                <li>{t("game_asteroids")}</li>
                <li>{t("game_runner")}</li>
                <li>{t("game_snake")}</li>
                <li>{t("game_racer")}</li>
                <li>{t("game_nuke")}</li>
                <li>{t("game_hl3")}</li>
              </ul>
            </div>
          );
          break;

        case cmd === "asteroids":
          setGameState("ASTEROIDS");
          setInput("");
          return;
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
          setJokeContent({ title: t("duke_nukem"), body: t("joke_body") });
          setShowJokeModal(true);
          setTimeout(() => setShowJokeModal(false), 3000);
          setInput("");
          return;
        case cmd === "hl3":
          setJokeContent({ title: t("half_life_3"), body: t("joke_body") });
          setShowJokeModal(true);
          setTimeout(() => setShowJokeModal(false), 3000);
          setInput("");
          return;

        case cmd.startsWith("sudo"):
          if (isRoot && cmd !== "sudo system_override") {
            output = t("root_exists");
            style = "success";
            break;
          }

          if (cmd === "sudo matrix") {
            setMatrixMode((prev) => !prev);
            output = matrixMode ? t("matrix_disabled") : t("matrix_enabled");
            style = "success";
          } else if (cmd.includes("rm -rf")) {
            output = t("rm_rf_error");
            style = "error";
          } else if (cmd.includes("make me a sandwich")) {
            output = t("sudo_sandwich");
            style = "warning";
          } else if (cmd === "sudo coin") {
            const result = Math.random() > 0.5 ? t("coin_heads") : t("coin_tails");
            output = `${t("coin_flipping")} ${result}`;
            style = "success";
          } else if (cmd === "sudo system_override") {
            if (isRoot) {
              output = t("already_root");
            } else {
              setIsRoot(true);
              output = t("root_granted");
              style = "success";
            }
          } else if (cmd.includes("godmode")) {
            output = t("godmode_unlocked");
            style = "success";
          } else {
            output = t("access_denied");
            style = "error";
          }
          break;

        case cmd === "whoami":
          output = isRoot ? t("whoami_root") : t("whoami_guest");
          break;

        default:
          output = `${t("command_not_found")}: ${rawCmd}`;
          style = "error";
      }

      setHistory((prev) => [
        ...prev,
        {
          input: rawCmd,
          output,
          style,
          prompt: isRoot ? t("prompt_root") : t("prompt_guest"),
        },
      ]);
      setInput("");
    },
    [
      close,
      input,
      isRoot,
      matrixMode,
      setGameState,
      setHistory,
      setHistoryIndex,
      setInput,
      setIsRoot,
      setJokeContent,
      setMatrixMode,
      setShowJokeModal,
      t,
      t_data,
    ]
  );

  return { handleCommand };
}


