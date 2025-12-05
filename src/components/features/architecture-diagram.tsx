"use client";

import { motion } from "framer-motion";
import { Database, Server, Globe, Cpu, Layers } from "lucide-react";

export const OmniCommentArchitecture = () => {
  return (
    <div className="w-full p-4 bg-slate-950 rounded-xl border border-slate-800 my-6 overflow-x-auto">
      <div className="min-w-[600px] flex flex-col gap-8 relative">

        {/* Frontend Layer */}
        <div className="flex justify-between items-center relative z-10">
          <ArchitectureNode
            icon={<Globe className="text-blue-400" />}
            title="Chrome Extension"
            sub="Content Script / Iframe Injection"
          />
          <ConnectionLine label="WebSockets / HTTP" />
          <ArchitectureNode
            icon={<Server className="text-green-400" />}
            title="Node.js API"
            sub="Express / TypeScript"
          />
        </div>

        {/* Backend Services Layer */}
        <div className="flex justify-center gap-16 relative z-10 pl-40">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-0.5 bg-slate-700"></div>
            <ArchitectureNode
              icon={<Cpu className="text-orange-400" />}
              title="Redis"
              sub="Caching / Socket Adapter"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-0.5 bg-slate-700"></div>
            <ArchitectureNode
              icon={<Database className="text-purple-400" />}
              title="MongoDB"
              sub="Recursive Aggregation"
            />
          </div>
        </div>

        {/* Legend / Overlay */}
        <div className="absolute top-0 right-0 bg-slate-900/80 p-2 rounded border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="w-3 h-3" />
            <span>Monorepo Structure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArchitectureNode = ({ icon, title, sub }: { icon: any, title: string, sub: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    className="bg-slate-900 p-4 rounded-lg border border-slate-700 w-48 shadow-xl flex flex-col items-center text-center gap-2"
  >
    <div className="p-2 bg-slate-800 rounded-full">{icon}</div>
    <div>
      <div className="font-bold text-slate-200 text-sm">{title}</div>
      <div className="text-xs text-slate-500">{sub}</div>
    </div>
  </motion.div>
);

const ConnectionLine = ({ label }: { label: string }) => (
  <div className="flex-1 h-0.5 bg-slate-700 relative mx-4">
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 bg-slate-950 px-2">
      {label}
    </div>
  </div>
);