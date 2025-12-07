"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/types";
import { urlFor } from "@/lib/sanity";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const t = useTranslations("PortfolioPage");
  
  const builder = project.mainImage ? urlFor(project.mainImage) : undefined;
  const imageUrl = builder ? builder.width(600).height(400).url() : 
    (typeof project.mainImage === "string" && project.mainImage 
      ? project.mainImage 
      : "/images/commingsoon.png");

  const isDownloadable = !!project.downloads;

  return (
    <motion.div
      layoutId={project._id}
      onClick={onClick}
      className="group cursor-pointer rounded-xl bg-card text-card-foreground shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isDownloadable && (
          <div className="absolute top-2 right-2 z-10">
             <div className="bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg" title={t('software_tag')}>
                <Download className="w-4 h-4" />
             </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
        <div className="flex flex-wrap gap-2">
          {project.tags?.length > 0 ? (
            project.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                  tag === "Software" 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "text-foreground bg-secondary"
                }`}
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">{t('no_tags')}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
