"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { BlueprintScene } from "@/components/3d/blueprint-scene";
import { ARTIFACTS } from "@/components/3d/artifact-manager";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function SchematicsViewer() {
  const t = useTranslations("SchematicsPage");
  const [selectedId, setSelectedId] = useState<string>(ARTIFACTS[0].id);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] w-full relative">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-black/80 backdrop-blur-md border-r border-cyan-900/30 p-6 z-10 overflow-y-auto">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2 font-mono">
          {t('title')}
        </h1>
        <p className="text-cyan-600/70 text-sm mb-8 font-mono">
          {t('subtitle')}
        </p>

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-cyan-800 font-bold mb-4">
            {t('instruction')}
          </p>
          
          {ARTIFACTS.map((artifact) => (
            <button
              key={artifact.id}
              onClick={() => setSelectedId(artifact.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-300 group ${
                selectedId === artifact.id
                  ? "bg-cyan-900/30 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                  : "bg-black/40 border-cyan-900/30 text-cyan-700 hover:border-cyan-700 hover:text-cyan-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm tracking-wider">
                  {/* Translate or fallback to name */}
                  {t(artifact.id as any) || artifact.name}
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  selectedId === artifact.id ? "bg-cyan-400 animate-pulse" : "bg-cyan-900"
                }`} />
              </div>
            </button>
          ))}
        </div>

        {/* Technical Data placeholder */}
        <div className="mt-12 p-4 border border-cyan-900/30 rounded bg-black/40">
          <h3 className="text-cyan-700 text-xs uppercase mb-2">System Status</h3>
          <div className="space-y-2 font-mono text-xs text-cyan-600/60">
            <div className="flex justify-between">
              <span>RENDERER</span>
              <span className="text-cyan-500">WEBGL2</span>
            </div>
            <div className="flex justify-between">
              <span>SHADER</span>
              <span className="text-cyan-500">CUSTOM_VS</span>
            </div>
            <div className="flex justify-between">
              <span>MODE</span>
              <span className="text-cyan-500">INSPECTION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 relative bg-black">
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Suspense fallback={null}>
              <BlueprintScene 
                interactive={true} 
                mode="single-center" 
                selectedArtifactId={selectedId} 
              />
            </Suspense>
          </Canvas>
        </div>
        
        {/* Overlay Grid */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
    </div>
  );
}
