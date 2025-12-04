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
  const colSpanClass = {
    1: "lg:col-span-4", // Default 1/3 width on 12-col grid (Wait, 12 cols. 1/3 is 4. 1/2 is 6. 2/3 is 8. Full is 12.)
    2: "lg:col-span-6", // Half width
    3: "lg:col-span-8", // 2/3 width (approx) - actually I should make this flexible
  };
  
  // Let's simplify. The grid is 12 columns.
  // We can pass raw col classes in className.
  
  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300", className)}>
      {children}
    </div>
  );
};
