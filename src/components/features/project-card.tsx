"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/types";
import { urlFor } from "@/lib/sanity";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const imageUrl =
    typeof project.mainImage === "string"
      ? project.mainImage
      : urlFor(project.mainImage).width(600).height(400).url();

  return (
    <motion.div
      layoutId={project._id}
      onClick={onClick}
      className="group cursor-pointer rounded-xl bg-card text-card-foreground shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

