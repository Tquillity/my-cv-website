"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SimpleTooltipProps {
  children: ReactNode;
  content?: string;
  className?: string;
}

export const SimpleTooltip = ({ children, content, className }: SimpleTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  if (!content) return <>{children}</>;

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        // Center X: The exact middle of the tag
        left: rect.left + rect.width / 2,
        // Top Y: The top edge of the tag
        top: rect.top,
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Close on scroll to prevent the tooltip from detaching from the element
  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => setIsVisible(false);
      window.addEventListener("scroll", handleScroll, { capture: true });
      return () => window.removeEventListener("scroll", handleScroll, { capture: true });
    }
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex ${className || ""}`}
      >
        {children}
      </div>

      {typeof document !== "undefined" && coords &&
        createPortal(
          <AnimatePresence>
            {isVisible && (
              <motion.div
                // ANIMATION:
                // Start slightly lower (y: -4) and move up to (y: -10)
                // This creates a "lift" effect from the tag
                initial={{ opacity: 0, scale: 0.96, y: -4 }} 
                animate={{ opacity: 1, scale: 1, y: -10 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
                transition={{
                  type: "spring",
                  stiffness: 500, // High stiffness = snappy
                  damping: 30,    // No wobbling
                  mass: 0.5       // Lightweight feel
                }}
                style={{
                  position: "fixed",
                  left: coords.left,
                  top: coords.top,
                  // Center the tooltip horizontally (-50%) and move it above the tag (-100%)
                  transform: "translate(-50%, -100%)",
                  zIndex: 9999,
                }}
                // STYLING (Best Practice 2025):
                // 1. bg-popover/95: High opacity for readability.
                // 2. backdrop-blur-sm: Subtle modern blur.
                // 3. shadow-lg: Soft elevation.
                // 4. border: Subtle definition.
                // 5. will-change: GPU optimization.
                className="pointer-events-none will-change-[transform,opacity] bg-popover/95 backdrop-blur-sm border border-border/60 text-popover-foreground text-xs font-medium px-3 py-1.5 rounded-md shadow-lg max-w-[200px] text-center leading-snug whitespace-normal"
              >
                {content}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
