"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Project } from "@/types";
import { urlFor } from "@/lib/sanity";
import { X, Github, ExternalLink, Code2, Network, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { OmniCommentArchitecture } from "./architecture-diagram";

interface ProjectModalProps {
  selectedProject: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ selectedProject, onClose }) => {
  const t = useTranslations("PortfolioPage");
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "code">("overview");

  // Reset tab to overview when opening a new project
  useEffect(() => {
    if (selectedProject) {
      setActiveTab("overview");
    }
  }, [selectedProject]);

  if (!selectedProject) return null;

  const builder = selectedProject?.mainImage ? urlFor(selectedProject.mainImage) : undefined;
  const imageUrl = builder
    ? builder.width(800).height(600).url()
    : (typeof selectedProject?.mainImage === "string" ? selectedProject.mainImage : "/placeholder.webp");

  const hasCaseStudy = !!selectedProject.caseStudy;

  return (
    <AnimatePresence>
      {selectedProject && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              layoutId={selectedProject._id}
              className="w-full max-w-4xl bg-background rounded-2xl overflow-hidden shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col border border-border"
            >
              {/* Header Image Area */}
              <div className="relative h-48 sm:h-64 w-full shrink-0">
                <Image
                  src={imageUrl}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-3xl font-bold text-foreground">{selectedProject.title}</h2>
                </div>
              </div>

              {/* Tabs (Only show if Case Study exists) */}
              {hasCaseStudy && (
                <div className="flex border-b border-border bg-muted/30 px-6 pt-2">
                  <TabButton
                    active={activeTab === "overview"}
                    onClick={() => setActiveTab("overview")}
                    icon={<BookOpen className="w-4 h-4" />}
                    label={t('tab_overview')}
                  />
                  <TabButton
                    active={activeTab === "architecture"}
                    onClick={() => setActiveTab("architecture")}
                    icon={<Network className="w-4 h-4" />}
                    label={t('tab_architecture')}
                  />
                  <TabButton
                    active={activeTab === "code"}
                    onClick={() => setActiveTab("code")}
                    icon={<Code2 className="w-4 h-4" />}
                    label={t('tab_code')}
                  />
                </div>
              )}

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {selectedProject.description}
                    </p>

                    {/* Problem / Solution (from Case Study) */}
                    {hasCaseStudy && (
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div className="bg-secondary/20 p-4 rounded-lg border border-border/50">
                          <h4 className="font-semibold text-primary mb-2">{t('problem')}</h4>
                          <p className="text-sm text-muted-foreground">{selectedProject.caseStudy!.problem}</p>
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-lg border border-border/50">
                          <h4 className="font-semibold text-primary mb-2">{t('solution')}</h4>
                          <p className="text-sm text-muted-foreground">{selectedProject.caseStudy!.solution}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground bg-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                      {selectedProject.githubUrl && (
                        <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                          <Github className="w-4 h-4" />
                          {t('github')}
                        </a>
                      )}
                      {selectedProject.liveUrl && (
                        <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium">
                          <ExternalLink className="w-4 h-4" />
                          {t('live_demo')}
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ARCHITECTURE TAB */}
                {activeTab === "architecture" && selectedProject.caseStudy && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{t('architecture_title')}</h3>
                      <p className="text-muted-foreground">{selectedProject.caseStudy.architecture?.description}</p>
                    </div>

                    {/* Render specific diagram component based on type */}
                    {selectedProject.caseStudy.architecture?.diagramType === "omnicomment-flow" && (
                      <OmniCommentArchitecture />
                    )}

                    <div className="space-y-4 mt-6">
                      <h4 className="font-semibold text-lg">{t('challenges_title')}</h4>
                      <div className="grid gap-4">
                        {selectedProject.caseStudy.technicalChallenges.map((challenge, idx) => (
                          <div key={idx} className="border border-border/50 rounded-lg p-4 bg-card/50">
                            <h5 className="font-bold text-primary mb-1">{challenge.title}</h5>
                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* CODE SNIPPETS TAB */}
                {activeTab === "code" && selectedProject.caseStudy && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg mb-6">
                      <p className="text-sm text-amber-500 font-medium">
                        {t('source_code_warning')}
                      </p>
                    </div>

                    {selectedProject.caseStudy.codeSnippets.map((snippet, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-primary" />
                          {snippet.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">{snippet.description}</p>

                        <div className="relative rounded-lg overflow-hidden border border-border bg-[#0d1117]">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-border">
                            <span className="text-xs font-mono text-muted-foreground">{snippet.language}</span>
                          </div>
                          <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
                            <code>{snippet.code}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
      active
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
    }`}
  >
    {icon}
    {label}
  </button>
);
