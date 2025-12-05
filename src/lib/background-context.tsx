"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type BackgroundType = "stars" | "deep_space" | "network" | "nebula";

type BackgroundContextType = {
  variant: BackgroundType;
  setVariant: (v: BackgroundType) => void;
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider = ({ children }: { children: React.ReactNode }) => {
  const [variant, setVariant] = useState<BackgroundType>("deep_space");

  // Simple persistence using localStorage
  useEffect(() => {
    const saved = localStorage.getItem("background-variant") as BackgroundType;
    if (saved) setVariant(saved);
  }, []);

  const updateVariant = (v: BackgroundType) => {
    setVariant(v);
    localStorage.setItem("background-variant", v);
  };

  return (
    <BackgroundContext.Provider value={{ variant, setVariant: updateVariant }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) throw new Error("useBackground must be used within BackgroundProvider");
  return context;
};
