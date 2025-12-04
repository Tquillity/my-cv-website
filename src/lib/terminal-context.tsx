"use client";

import React, { createContext, useContext, useState } from "react";

type TerminalContextType = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export const TerminalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TerminalContext.Provider value={{ isOpen, toggle: () => setIsOpen(prev => !prev), close: () => setIsOpen(false) }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) throw new Error("useTerminal must be used within TerminalProvider");
  return context;
};