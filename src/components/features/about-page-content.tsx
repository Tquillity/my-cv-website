"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Education, Experience, SkillSet } from "@/types";
import { TimelineItem } from "@/components/features/timeline-item";
import { GraduationCap, Code, Languages, Terminal, User, Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";
import { BentoGrid, BentoCard } from "@/components/features/bento-grid";
import { Switch } from "@/components/ui/switch";

interface AboutPageProps {
  education: Education[];
  experience: Experience[];
  profile: SkillSet | null;
}

const EducationCard = ({ edu, t }: { edu: Education; t: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        scale: isHovered ? 1.05 : 1,
        zIndex: isHovered ? 50 : 1,
      }}
      exit={{ opacity: 0, x: -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-4 rounded-xl border border-white/10 transition-colors duration-300 cursor-default relative overflow-hidden ${
        isHovered 
          ? "bg-[#0B1120] border-primary/30 shadow-2xl ring-1 ring-primary/20 z-10" 
          : "bg-white/5 hover:border-white/20 z-0"
      }`}
    >
      <motion.div layout="position" className="flex justify-between items-start">
        <div>
          <h3 className={`font-bold transition-colors ${isHovered ? "text-primary" : "text-slate-200"}`}>
            {edu.institution}
          </h3>
          <p className="text-xs text-blue-300 font-mono mt-0.5">{edu.degree}</p>
        </div>
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap bg-black/20 px-2 py-1 rounded">
          {edu.startDate?.split("-")[0]} — {edu.endDate ? edu.endDate.split("-")[0] : t('present')}
        </span>
      </motion.div>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isHovered ? "auto" : 0,
          opacity: isHovered ? 1 : 0,
          marginTop: isHovered ? 12 : 0
        }}
        transition={{ duration: 0.3, ease: "circOut" }}
        className="overflow-hidden"
      >
        <p className="text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
          {edu.description}
        </p>
      </motion.div>
    </motion.div>
  );
};

export const AboutPageContent: React.FC<AboutPageProps> = ({ education, experience, profile }) => {
  const t = useTranslations("AboutPage");
  const [showLegacy, setShowLegacy] = useState(false);

  const visibleExperience = experience.filter(
    (item) => showLegacy || item.isProminent !== false
  );

  const visibleEducation = education.filter(
    (item) => showLegacy || item.isProminent !== false
  );

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl space-y-12">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {t('title') || "About Me"}
            </h1>
            <p className="text-slate-400 mt-2">
              {t('subtitle') || "My journey, skills, and experience."}
            </p>
          </div>
        </div>

        {/* Bento Grid Dashboard */}
        <BentoGrid>
          
          {/* 1. Bio (Technical Objective) */}
          <BentoCard className="lg:col-span-7 flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Technical Objective</h2>
            </div>
            <p className="text-lg leading-relaxed text-slate-300 font-light">
              {profile?.bio || "Loading bio..."}
            </p>
          </BentoCard>

          {/* 2. Languages & Profile Stats */}
          <BentoCard className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <Languages className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">{t('languages')}</h2>
            </div>
            <div className="space-y-5">
              {profile?.languages?.map((lang, index) => (
                <div key={lang.language} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-200">{lang.language}</span>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">{lang.proficiency}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ 
                        width: 
                          lang.proficiency === "Native" || lang.proficiency === "Modersmål" ? "100%" : 
                          lang.proficiency === "Poor" || lang.proficiency === "Dålig" ? "15%" : 
                          "90%" 
                      }}
                      transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* 3. Skills Cloud */}
          <BentoCard className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-semibold">{t('tech_stack')}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </BentoCard>

          {/* 4. Education Grid */}
          <BentoCard className="lg:col-span-6 flex flex-col relative overflow-visible">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold">{t('education')}</h2>
            </div>
            <div className="grid gap-4 relative">
              {visibleEducation.map((edu) => (
                <div key={edu._id} className="relative isolate">
                   <EducationCard edu={edu} t={t} />
                </div>
              ))}
            </div>
          </BentoCard>

        </BentoGrid>

        {/* Experience Section */}
        <section className="pt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3">
              <Code className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-3xl font-bold">{t('work_experience')}</h2>
                <p className="text-slate-400 text-sm mt-1">
                  {showLegacy ? t('show_full_history') : t('show_recent')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-full border border-white/10">
               <Switch 
                 checked={showLegacy} 
                 onCheckedChange={setShowLegacy} 
               />
               <span className="text-sm font-medium text-slate-300">
                 {showLegacy ? t('toggle_full') : t('toggle_relevant')}
               </span>
            </div>
          </div>

          <div className="relative">
            <div className="space-y-0">
              <AnimatePresence mode="popLayout">
                {visibleExperience.map((exp, index) => (
                  <motion.div
                    key={exp._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TimelineItem experience={exp} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {!showLegacy && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <button 
                  onClick={() => setShowLegacy(true)}
                  className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <Briefcase className="w-4 h-4" />
                  {t('show_previous_btn')}
                </button>
              </motion.div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
};