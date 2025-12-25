"use client";

import { useCallback } from "react";

let sharedAudioContext: AudioContext | null = null;
let sharedGain: GainNode | null = null;

function getAudioGraph(): { ctx: AudioContext; gain: GainNode } | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContextClass();
    sharedGain = sharedAudioContext.createGain();
    sharedGain.connect(sharedAudioContext.destination);
  }

  if (!sharedGain) return null;
  return { ctx: sharedAudioContext, gain: sharedGain };
}

export const useTerminalSound = () => {
  const playKeystroke = useCallback(() => {
    const graph = getAudioGraph();
    if (!graph) return;

    try {
      const { ctx, gain } = graph;

      // Resume if browser started suspended (common until user interaction).
      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const osc = ctx.createOscillator();
      osc.connect(gain);

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
