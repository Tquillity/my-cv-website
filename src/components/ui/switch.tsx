"use client";

import { motion } from "framer-motion";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

export const Switch = ({ checked, onCheckedChange, label }: SwitchProps) => {
  return (
    <div 
      className="flex items-center gap-3 cursor-pointer group" 
      onClick={() => onCheckedChange(!checked)}
    >
      {label && (
        <span className={`text-sm font-medium transition-colors ${checked ? 'text-primary' : 'text-slate-400 group-hover:text-slate-300'}`}>
          {label}
        </span>
      )}
      <div className={`relative w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out ${checked ? 'bg-primary' : 'bg-slate-700 group-hover:bg-slate-600'}`}>
        <motion.div
          layout
          className="bg-white w-5 h-5 rounded-full shadow-md"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
};
