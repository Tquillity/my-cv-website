"use client";

import { useCallback } from "react";

let sharedAudioContext: AudioContext | null = null;
let sharedGain: GainNode | null = null;
let resumePromise: Promise<void> | null = null;

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

      if (ctx.state === "suspended") {
        if (!resumePromise) {
          resumePromise = ctx
            .resume()
            .then(() => undefined)
            .catch(() => undefined)
            .finally(() => {
              resumePromise = null;
            });
        }
        void resumePromise.then(() => {
          if (ctx.state !== "suspended") {
            const osc = ctx.createOscillator();
            osc.connect(gain);

            osc.type = "square";
            osc.frequency.setValueAtTime(600, ctx.currentTime);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

            osc.start();
            osc.stop(ctx.currentTime + 0.05);
          }
        });
        return;
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
