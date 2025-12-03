"use client";

import { useState } from "react";
import { Project } from "@/types";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";

interface PortfolioGridProps {
  projects: Project[];
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ projects }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p._id === selectedId) || null;

  return (
    <>
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

