"use client";

import { ReactNode } from "react";

interface SimpleTooltipProps {
  children: ReactNode;
  content?: string;
  className?: string;
}

export const SimpleTooltip = ({ children, content, className }: SimpleTooltipProps) => {
  if (!content) return <>{children}</>;

  return (
    <div className={`group relative inline-flex ${className || ""}`}>
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-max max-w-[200px]">
        <div className="bg-popover text-popover-foreground text-xs rounded px-2 py-1 shadow-md border border-border text-center">
          {content}
        </div>
        {/* Arrow */}
        <div className="w-2 h-2 bg-popover border-r border-b border-border rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
};