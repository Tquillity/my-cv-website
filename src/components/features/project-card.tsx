"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/types";
import { urlFor } from "@/lib/sanity";
import { ImageOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const t = useTranslations("PortfolioPage");
  let imageUrl = null;
  
  if (typeof project.mainImage === "string") {
    imageUrl = project.mainImage;
  } else if (project.mainImage?.asset) {
    imageUrl = urlFor(project.mainImage).width(600).height(400).url();
  }

  return (
    <motion.div
      layoutId={project._id}
      onClick={onClick}
      className="group cursor-pointer rounded-xl bg-card text-card-foreground shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs">{t('no_image')}</span>
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
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors text-foreground"
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