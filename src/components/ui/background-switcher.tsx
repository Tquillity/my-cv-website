"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Stars, Network, Cloud, Sparkles } from "lucide-react";
import { useBackground } from "@/lib/background-context";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const variants = [
  { id: "stars", name: "Stars", icon: Stars },
  { id: "network", name: "Network", icon: Network },
  { id: "nebula", name: "Nebula", icon: Cloud },
  { id: "deep_space", name: "Deep Space", icon: Sparkles },
];

export const BackgroundSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { variant, setVariant } = useBackground();
  const t = useTranslations("Theme");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current variant icon
  const currentVariant = variants.find(v => v.id === variant) || variants[0];
  const CurrentIcon = currentVariant.icon;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-full",
          "bg-popover/80 backdrop-blur-md border border-border",
          "text-popover-foreground hover:bg-popover transition-colors"
        )}
        aria-label={t('select_atmosphere')}
      >
        <CurrentIcon className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 min-w-[160px] bg-popover/90 backdrop-blur-md border border-border rounded-lg shadow-lg z-50"
          >
            {variants.map((v) => {
              const Icon = v.icon;
              const isActive = variant === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setVariant(v.id as any);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                    "hover:bg-accent text-popover-foreground",
                    isActive && "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t(`select_atmosphere_${v.id}` as any) || v.name}</span>
                  {isActive && <div className="w-2 h-2 bg-primary rounded-full ml-auto" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
