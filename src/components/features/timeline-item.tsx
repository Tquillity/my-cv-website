"use client";

import { motion } from "framer-motion";
import { Experience } from "@/types";

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ experience, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 border-l-2 border-border pb-12 last:pb-0"
    >
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
      
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
        <h3 className="text-xl font-bold">{experience.title}</h3>
        <span className="text-sm text-muted-foreground font-mono">
          {experience.startDate} — {experience.isCurrent ? "Present" : experience.endDate}
        </span>
      </div>
      
      <div className="text-lg font-medium text-muted-foreground mb-4">
        {experience.company}
      </div>
      
      <p className="mb-4 leading-relaxed text-muted-foreground">
        {experience.description}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {experience.skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

