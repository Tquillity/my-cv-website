"use client";

import { useState } from "react";
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-mono font-bold",
          "bg-popover/80 backdrop-blur-md border border-border",
          "text-popover-foreground hover:bg-popover transition-colors"
        )}
      >
        <span className="hidden sm:inline">{t('select_atmosphere')}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
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
