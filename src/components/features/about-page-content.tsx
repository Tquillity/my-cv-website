"use client";

import { motion } from "framer-motion";
import { Education, Experience, SkillSet } from "@/types";
import { TimelineItem } from "@/components/features/timeline-item";
import { GraduationCap, Code, Languages, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";

interface AboutPageProps {
  education: Education[];
  experience: Experience[];
  profile: SkillSet | null;
}

export const AboutPageContent: React.FC<AboutPageProps> = ({ education, experience, profile }) => {
  const t = useTranslations("AboutPage");

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      
      {/* 1. Hero / Bio Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Technical Objective
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-slate-300 font-light">
              {profile?.bio || "Loading bio..."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Tech Command Center (Skills & Languages) */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Skills Cloud */}
          <div className="lg:col-span-2 p-8 rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">{t('tech_stack')}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile?.skills?.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="p-8 rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Languages className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">{t('languages')}</h2>
            </div>
            <div className="space-y-6">
              {profile?.languages?.map((lang, index) => (
                <div key={lang.language} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-muted-foreground">{lang.proficiency}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ 
                        width: 
                          lang.proficiency === "Native" || lang.proficiency === "Modersmål" ? "100%" : 
                          lang.proficiency === "Poor" || lang.proficiency === "Dålig" ? "15%" : 
                          "90%" 
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Education Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold">{t('education')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-primary/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                      {edu.institution}
                    </h3>
                    <p className="text-sm text-blue-300 font-mono mt-1">{edu.degree}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-mono border border-white/10 whitespace-nowrap">
                    {edu.startDate?.split("-")[0]} — {edu.endDate?.split("-")[0]}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {edu.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Experience Timeline */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-12">
            <Code className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold">{t('work_experience')}</h2>
          </div>
          <div className="space-y-0">
            {experience.map((exp, index) => (
              <TimelineItem key={exp._id} experience={exp} index={index} />
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};
