"use client";

import { useBackground } from "@/lib/background-context";
import { motion } from "framer-motion";
import { Sparkles, Zap, Stars as StarsIcon, Rocket } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

// Fixed star positions to prevent re-rendering issues
const STAR_POSITIONS = [
  { top: "15%", left: "20%" },
  { top: "35%", left: "75%" },
  { top: "60%", left: "30%" },
  { top: "80%", left: "65%" },
  { top: "25%", left: "50%" },
  { top: "70%", left: "10%" },
];

export const ProjectPlaceholder = () => {
  const { variant } = useBackground();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("PortfolioPage");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-muted/20 animate-pulse" />;
  }

  const isMiddle = resolvedTheme === 'middle';
  const isLight = resolvedTheme === 'light';

  const variants = {
    stars: (
      <div className={`absolute inset-0 overflow-hidden ${
        isLight ? "bg-slate-100" : isMiddle ? "bg-slate-800" : "bg-slate-950"
      }`}>
        {STAR_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isLight ? "bg-slate-400" : "bg-white"
            }`}
            style={{ 
              top: pos.top, 
              left: pos.left 
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + i, repeat: Infinity }}
          />
        ))}
        <div className="flex items-center justify-center h-full opacity-20">
          <StarsIcon className={`w-12 h-12 ${
            isMiddle ? "text-amber-500" : isLight ? "text-slate-900" : "text-white"
          }`} />
        </div>
      </div>
    ),
    nebula: (
      <div className={`absolute inset-0 overflow-hidden flex items-center justify-center ${
        isLight ? "bg-slate-200" : isMiddle ? "bg-slate-800" : "bg-slate-900"
      }`}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`w-[150%] h-[150%] opacity-30 blur-3xl ${
            isMiddle 
              ? "bg-[conic-gradient(from_0deg,transparent,theme(colors.amber.600),theme(colors.amber.400),transparent)]" 
              : isLight
                ? "bg-[conic-gradient(from_0deg,transparent,theme(colors.blue.300),theme(colors.slate.400),transparent)]"
                : "bg-[conic-gradient(from_0deg,transparent,theme(colors.indigo.500),theme(colors.purple.500),transparent)]"
          }`}
        />
        <Rocket className={`w-12 h-12 opacity-20 absolute ${
          isMiddle ? "text-amber-400" : isLight ? "text-slate-800" : "text-indigo-400"
        }`} />
      </div>
    ),
    space: (
      <div className={`absolute inset-0 flex items-center justify-center ${
        isLight ? "bg-slate-100" : isMiddle ? "bg-slate-800" : "bg-[#020617]"
      }`}>
        <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="opacity-20"
        >
            <Sparkles className={`w-16 h-16 ${
              isMiddle ? "text-amber-400" : isLight ? "text-slate-900" : "text-blue-400"
            }`} />
        </motion.div>
      </div>
    ),
    aurora: (
      <div className={`absolute inset-0 overflow-hidden flex items-center justify-center ${
        isLight ? "bg-slate-200" : isMiddle ? "bg-slate-800" : "bg-slate-950"
      }`}>
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className={`w-full h-full bg-gradient-to-r from-transparent to-transparent skew-x-12 ${
            isMiddle 
              ? "via-amber-500/20" 
              : isLight 
                ? "via-slate-400/30" 
                : "via-emerald-500/20"
          }`}
        />
        <Zap className={`w-12 h-12 opacity-20 absolute ${
          isMiddle ? "text-amber-400" : isLight ? "text-slate-900" : "text-emerald-400"
        }`} />
      </div>
    ),
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
       {variants[variant] || variants.stars}
       <div className="absolute bottom-4 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
          {t('initializing')}
       </div>
    </div>
  );
};
