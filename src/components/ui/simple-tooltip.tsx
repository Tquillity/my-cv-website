"use client";

import { useState, useRef, useEffect, ReactNode, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SimpleTooltipProps {
  children: ReactNode;
  content?: string;
  className?: string;
}

export const SimpleTooltip = ({ children, content, className }: SimpleTooltipProps) => {
  const tooltipId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  if (!content) return <>{children}</>;

  const updateCoordsAndShow = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left + rect.width / 2,
        top: rect.top,
      });
      setIsVisible(true);
    }
  };

  const hide = () => setIsVisible(false);

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
        onMouseEnter={updateCoordsAndShow}
        onMouseLeave={hide}
        onFocus={updateCoordsAndShow}
        onBlur={hide}
        tabIndex={0}
        aria-describedby={isVisible ? tooltipId : undefined}
        className={`inline-flex ${className || ""}`}
      >
        {children}
      </div>

      {typeof document !== "undefined" && coords &&
        createPortal(
          <AnimatePresence>
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -4 }} 
                animate={{ opacity: 1, scale: 1, y: -10 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5
                }}
                style={{
                  position: "fixed",
                  left: coords.left,
                  top: coords.top,
                  transform: "translate(-50%, -100%)",
                  zIndex: 9999,
                }}
                id={tooltipId}
                role="tooltip"
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
