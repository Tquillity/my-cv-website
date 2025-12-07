"use client";

import { Terminal } from "lucide-react";
import { useTerminal } from "@/lib/terminal-context";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface TerminalToggleProps {
  className?: string;
}

export const TerminalToggle: React.FC<TerminalToggleProps> = ({ className }) => {
  const { toggle } = useTerminal();
  const t = useTranslations("Terminal");

  return (
    <button
      onClick={toggle}
      className={cn(
        "p-3 rounded-full bg-primary text-primary-foreground hover:bg-black hover:text-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-300 shadow-lg",
        className
      )}
      aria-label={t('toggle_terminal')}
    >
      <Terminal className="w-6 h-6" />
    </button>
  );
};
