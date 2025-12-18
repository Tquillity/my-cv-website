"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/types";
import { urlFor } from "@/sanity/lib/image";
import { useTranslations } from "next-intl";
import { Download, Globe } from "lucide-react";
import { SimpleTooltip } from "@/components/ui/simple-tooltip"; // Import
import { ThemeImage } from "@/components/ui/theme-image";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onDownloadClick?: () => void; // Added Prop
}

const COMMON_STACK = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Python",
  "Vite", "MongoDB", "Redis", "Docker", "Sanity", "Express", "Stripe",
  "PostgreSQL", "Zustand", "Tkinter"
];

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onDownloadClick }) => {
  const t = useTranslations("PortfolioPage");
  
  const builder = project.mainImage ? urlFor(project.mainImage) : undefined;
  const imageUrl = builder
    ? builder.width(600).height(400).url()
    : (typeof project.mainImage === "string" && project.mainImage
      ? project.mainImage
      : "/images/comingsoon.png");

  const isDownloadable = !!project.downloads;
  const liveHref = project.liveUrl || (project as any).liveVersion;
  const isCV = project.title === "My CV Website";

  const getTagStyles = (tag: string) => {
    if (tag === "Software") {
      return "bg-primary text-primary-foreground border-primary font-bold";
    }
    if (COMMON_STACK.some(tech => tag.includes(tech))) {
      return "text-foreground bg-secondary border-transparent";
    }
    // Unicity (Unique Tech) - Indigo styling
    return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
  };

  return (
    <motion.div
      layoutId={project._id}
      onClick={onClick}
      className="group cursor-pointer rounded-xl bg-card text-card-foreground shadow-sm border border-border/60 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full hover:-translate-y-1 duration-300"
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted/30 flex items-center justify-center">
        {isCV ? (
          <div className="w-full h-full p-10 flex items-center justify-center">
            <ThemeImage
              srcLight="/logos/logo-black.png"
              srcDark="/logos/logo-white.png"
              srcMiddle="/logos/logo-gold.png"
              alt="Mikael Sundh Logo"
              width={400}
              height={400}
              className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
              priority={false}
            />
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        {isDownloadable && (
          <div
            className="absolute top-2 right-2 z-10"
            onClick={(e) => {
              // Stop card click event
              e.stopPropagation();
              if (onDownloadClick) onDownloadClick();
            }}
          >
             <div
               className="bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg hover:bg-primary/80 transition-colors hover:scale-110 cursor-pointer"
               title={t('software_tag')}
             >
                <Download className="w-4 h-4" />
             </div>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-xl leading-tight">{project.title}</h3>
          {liveHref && (
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-primary transition-colors p-1 -mt-1 -mr-1 rounded-md bg-primary/10 hover:bg-primary/20"
              title={t('live_demo')}
              aria-label={t('live_demo')}
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags?.length > 0 ? (
            project.tags.map((tagObj) => (
              <SimpleTooltip key={tagObj.name} content={tagObj.description}>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors cursor-default ${getTagStyles(tagObj.name)}`}
                >
                  {tagObj.name}
                </span>
              </SimpleTooltip>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">{t('no_tags')}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
