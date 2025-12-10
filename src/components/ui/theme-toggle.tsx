"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Sunset, Check } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const themes = [
  { id: 'light', labelKey: 'theme_light', icon: Sun },
  { id: 'middle', labelKey: 'theme_middle', icon: Sunset },
  { id: 'dark', labelKey: 'theme_dark', icon: Moon },
];

export const ThemeToggle = () => {
  const t = useTranslations("Theme");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!mounted) return <div className="w-9 h-9" />;

  // Determine current icon for Mobile Trigger
  const currentThemeId = theme === 'system' ? resolvedTheme : theme;
  const currentThemeObj = themes.find(t => t.id === currentThemeId) || themes[0];
  const CurrentIcon = currentThemeObj.icon;

  return (
    <div ref={dropdownRef} className="relative">
      
      {/* --- DESKTOP VERSION (Hidden on Mobile) --- */}
      <div className="hidden sm:flex gap-1 bg-popover/80 rounded-full p-1 border border-border backdrop-blur-md">
        {themes.map((item) => {
          const Icon = item.icon;
          const effectiveTheme = theme === 'system' ? resolvedTheme : theme;
          const isActive = effectiveTheme === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setTheme(item.id)} 
              className={cn(
                "p-1.5 rounded-full transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-popover-foreground hover:text-foreground hover:bg-accent"
              )}
              aria-label={t(item.labelKey as any)}
              title={t(item.labelKey as any)}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* --- MOBILE VERSION (Dropdown) --- */}
      <div className="flex sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-full",
            "bg-popover/80 backdrop-blur-md border border-border",
            "text-popover-foreground hover:bg-popover transition-colors"
          )}
          aria-label={t('toggle_theme')}
        >
          <CurrentIcon className="w-4 h-4" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 min-w-[140px] bg-popover backdrop-blur-lg border border-border rounded-lg shadow-xl z-50 overflow-hidden"
            >
              {themes.map((item) => {
                const Icon = item.icon;
                const effectiveTheme = theme === 'system' ? resolvedTheme : theme;
                const isActive = effectiveTheme === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTheme(item.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                      "hover:bg-accent text-popover-foreground",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t(item.labelKey as any)}</span>
                    {isActive && <Check className="w-3 h-3 ml-auto text-primary" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
