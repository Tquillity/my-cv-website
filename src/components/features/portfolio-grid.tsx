"use client";

import { useState } from "react";
import { Project } from "@/types";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";
import { useTranslations } from "next-intl";

interface PortfolioGridProps {
  projects: Project[];
}

type ModalState = {
  id: string;
  tab: "overview" | "architecture" | "code" | "downloads";
} | null;

// Legend Component
const TagLegend = ({ t }: { t: any }) => (
  <div className="text-center mt-14 mb-14">
    <div className="bg-secondary/30 py-3 px-6 rounded-full border border-border/50 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-foreground mb-1.5">{t('legend_title')}</h3>
      <div className="flex flex-wrap gap-4 md:gap-6 justify-center text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary border border-primary" />
          <span>{t('legend_software')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary border border-border" />
          <span>{t('legend_stack')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/20 border border-indigo-500/50" />
          <span>{t('legend_unique')}</span>
        </div>
      </div>
    </div>
  </div>
);

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ projects }) => {
  const t = useTranslations("PortfolioPage");
  const [modalState, setModalState] = useState<ModalState>(null);

  const selectedProject = modalState

    ? projects.find((p) => p._id === modalState.id) || null

    : null;

  return (
    <>
      <TagLegend t={t} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onClick={() => setModalState({ id: project._id, tab: "overview" })}
            onDownloadClick={() => setModalState({ id: project._id, tab: "downloads" })}
          />
        ))}
      </div>
      <ProjectModal
        selectedProject={selectedProject}
        initialTab={modalState?.tab}
        onClose={() => setModalState(null)}
      />
    </>
  );
};

