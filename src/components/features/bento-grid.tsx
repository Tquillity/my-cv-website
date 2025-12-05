import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
}

export const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-auto", className)}>
      {children}
    </div>
  );
};

export const BentoCard = ({ children, className, colSpan = 1 }: BentoCardProps) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl border border-white/10",
      "bg-black/40 backdrop-blur-md", // UPDATED: Darker for readability
      "p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      {children}
    </div>
  );
};
