"use client";

import { useCallback } from "react";

export const useTerminalSound = () => {
  const playKeystroke = useCallback(() => {
    // Safety check for SSR or restricted environments
    if (typeof window === "undefined" || !window.AudioContext) return;

    try {
      // Type assertion for older webkit browsers if needed, though standard AudioContext is widely supported now
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // 80's PC Speaker style
      osc.type = "square";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      
      // Short, clicky envelope
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Ignore audio errors (e.g. if user hasn't interacted yet)
    }
  }, []);

  return { playKeystroke };
};
