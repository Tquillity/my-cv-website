"use client";

import { useBackground, BackgroundType } from "@/lib/background-context";
import { Sparkles, Network, Cloud, Star, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

// Static config for icons and IDs
const VARIANTS_CONFIG: { id: BackgroundType; icon: any }[] = [
  { id: "deep_space", icon: Sparkles },
  { id: "stars", icon: Star },
  { id: "network", icon: Network },
  { id: "nebula", icon: Cloud },
];

export const BackgroundSwitcher = () => {
  const t = useTranslations("Theme");
  const { variant, setVariant } = useBackground();
  const [isOpen, setIsOpen] = useState(false);

  // Fallback to first variant if undefined
  const currentVariantConfig = VARIANTS_CONFIG.find((v) => v.id === variant) || VARIANTS_CONFIG[0];
  const Icon = currentVariantConfig.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        aria-label={t("select_atmosphere")}
      >
        <Icon size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible backdrop to close menu when clicking outside */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full mt-2 right-0 w-48 bg-[#0B1120] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-1"
            >
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("select_atmosphere")}
              </div>
              {VARIANTS_CONFIG.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setVariant(v.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                    variant === v.id
                      ? "bg-primary/20 text-primary"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <v.icon size={16} />
                  <span className="flex-1">{t(v.id)}</span>
                  {variant === v.id && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
