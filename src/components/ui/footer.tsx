"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Github, Linkedin } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeImage } from "./theme-image";
import { TerminalToggle } from "./terminal-toggle";
import { AIChat } from "@/components/features/ai-chat";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("Navigation");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Theme-aware icon colors matching the logo
  const getIconColor = () => {
    if (!mounted) return 'text-muted-foreground';

    switch (resolvedTheme) {
      case 'light':
        return 'text-black';
      case 'dark':
        return 'text-white';
      case 'middle':
        return 'text-yellow-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="fixed bottom-0 w-full h-14 z-40 bg-background/80 backdrop-blur-md border-t border-border/50"
    >
      <div className="flex items-center justify-between px-6 h-full py-1.5">
        {/* Left: Logo and Social Icons */}
        <div className="flex items-center gap-4 h-full">
          <Link
            href="/"
            className="flex items-center justify-center hover:opacity-80 transition-opacity h-full"
            aria-label={t('home')}
          >
            <ThemeImage
              srcLight="/logos/logo-black.png"
              srcDark="/logos/logo-white.png"
              srcMiddle="/logos/logo-gold.png"
              alt="Logo"
              width={160}
              height={160}
              className="w-auto h-8 sm:h-9 object-contain"
            />
          </Link>

          {/* Social Icons */}
          <div className="flex items-center gap-2 h-full">
            <a
              href="https://github.com/Tquillity"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center p-3 rounded-full hover:bg-primary/10 transition-colors ${getIconColor()}`}
              aria-label={t('github')}
            >
              <Github className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/mikael-sundh/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center p-3 rounded-full hover:bg-primary/10 transition-colors ${getIconColor()}`}
              aria-label={t('linkedin')}
            >
              <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
        </div>

        {/* Right: Toggle Buttons */}
        <div className="flex items-center gap-4 h-full">
          <div className="flex items-center h-full">
            <AIChat />
          </div>
          <div className="flex items-center h-full">
            <TerminalToggle />
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
