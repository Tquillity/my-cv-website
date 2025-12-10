"use client";

import { useState } from "react";
import { Project } from "@/types";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";
import { Tag } from "lucide-react"; // Import icon

interface PortfolioGridProps {
  projects: Project[];
}

// Legend Component
const TagLegend = () => (
  <div className="flex flex-wrap gap-4 md:gap-6 justify-center mb-8 text-xs font-medium text-muted-foreground bg-secondary/30 py-3 px-6 rounded-full border border-border/50 backdrop-blur-sm">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-primary border border-primary" />
      <span>Software Product</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-secondary border border-border" />
      <span>Tech Stack</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/20 border border-indigo-500/50" />
      <span>Unique Feature / Skill</span>
    </div>
  </div>
);

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ projects }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p._id === selectedId) || null;

  return (
    <>
      <TagLegend />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onClick={() => setSelectedId(project._id)}
          />
        ))}
      </div>
      <ProjectModal
        selectedProject={selectedProject}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
};

