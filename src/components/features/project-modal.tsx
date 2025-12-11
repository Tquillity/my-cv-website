"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Project, SanityImage } from "@/types";
import { urlFor } from "@/sanity/lib/image";
import { X, Github, Code2, Network, BookOpen, ChevronLeft, ChevronRight, Download, HardDrive, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { OmniCommentArchitecture } from "./architecture-diagram";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";

interface ProjectModalProps {
  selectedProject: Project | null;
  initialTab?: "overview" | "architecture" | "code" | "downloads";
  onClose: () => void;
}

const COMMON_STACK = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Python",
  "Vite", "MongoDB", "Redis", "Docker", "Sanity", "Express", "Stripe",
  "PostgreSQL", "Zustand", "Tkinter"
];

export const ProjectModal: React.FC<ProjectModalProps> = ({ selectedProject, initialTab, onClose }) => {
  const t = useTranslations("PortfolioPage");
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "code" | "downloads">("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Set tab when project or initialTab changes
  useEffect(() => {
    if (selectedProject) {
      setActiveTab(initialTab || "overview"); // Use passed initialTab or fallback to overview
      setCurrentImageIndex(0);
      setIsLightboxOpen(false);
    }
  }, [selectedProject, initialTab]);

  // Handle ESC key to close Lightbox or Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else if (selectedProject) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, selectedProject, onClose]);

  if (!selectedProject) return null;

  // Build array of all images (mainImage + additionalImages)
  const getAllImages = (): (SanityImage | string)[] => {
    const images: (SanityImage | string)[] = [];
    if (selectedProject.mainImage) {
      images.push(selectedProject.mainImage);
    }
    if (selectedProject.additionalImages) {
      images.push(...selectedProject.additionalImages);
    }
    return images.length > 0 ? images : ["/images/comingsoon.png"];
  };

  const allImages = getAllImages();
  const currentImage = allImages[currentImageIndex];

  const builder = currentImage && typeof currentImage !== "string" ? urlFor(currentImage) : undefined;
  const imageUrl = builder
    ? builder.width(800).height(600).url()
    : (typeof currentImage === "string" ? currentImage : "/images/comingsoon.png");
  
  // High-quality image for lightbox (no cropping)
  const lightboxImageUrl = builder
    ? builder.width(1920).quality(100).url()
    : (typeof currentImage === "string" ? currentImage : "/images/comingsoon.png");

  const hasCaseStudy = !!selectedProject.caseStudy;
  const hasMultipleImages = allImages.length > 1;
  const hasDownloads = !!selectedProject.downloads;
  const isPrivateRepo = !selectedProject.githubUrl;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const getTagStyles = (tag: string) => {
    if (tag === "Software") {
      return "bg-primary text-primary-foreground border-primary font-bold";
    }
    if (COMMON_STACK.some(tech => tag.includes(tech))) {
      return "text-foreground bg-secondary border-transparent";
    }
    return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
  };

  const isWindowsReady = selectedProject.downloads?.windows && selectedProject.downloads.windows !== "soon";

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
              className="w-full max-w-5xl bg-background rounded-2xl overflow-hidden shadow-2xl pointer-events-auto h-[85vh] flex flex-col border border-border custom-scrollbar"
            >
              {/* Header Image Area with Carousel */}
              <div className="relative h-48 sm:h-64 w-full shrink-0 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full cursor-zoom-in hover:opacity-90 transition-opacity"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                      className="object-cover object-top"
                    />
                    {/* Click indicator overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                      <div className="px-3 py-1.5 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
                        {t('click_to_expand')}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                
                {/* Navigation Arrows (only show if multiple images) */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors z-20 opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors z-20 opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Image Indicator Dots */}
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(idx);
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? "bg-white w-6"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors z-10"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 pointer-events-none">
                  <h2 className="text-3xl font-bold text-foreground">{selectedProject.title}</h2>
                </div>
              </div>

              {/* Tabs - Sticky Top to prevent scrolling off */}
              {(hasCaseStudy || hasDownloads) && (
                <div className="flex border-b border-border bg-muted/90 backdrop-blur-sm px-6 pt-2 overflow-x-auto shrink-0 sticky top-0 z-20">
                  <TabButton
                    active={activeTab === "overview"}
                    onClick={() => setActiveTab("overview")}
                    icon={<BookOpen className="w-4 h-4" />}
                    label={t('tab_overview')}
                  />
                  {hasCaseStudy && (
                    <>
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
                    </>
                  )}
                  {hasDownloads && (
                    <TabButton
                      active={activeTab === "downloads"}
                      onClick={() => setActiveTab("downloads")}
                      icon={<Download className="w-4 h-4" />}
                      label={t('tab_downloads')}
                    />
                  )}
                </div>
              )}

              {/* Scrollable Content Area - Using flex-1 to fill the fixed height */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar w-full">

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

                    {/* Dynamic Tag Legend - Only show categories present in this project */}
                    {(() => {
                      const hasSoftware = selectedProject.tags.some(tag => tag.name === "Software");
                      const hasTechStack = selectedProject.tags.some(tag => COMMON_STACK.some(tech => tag.name.includes(tech)));
                      const hasUnique = selectedProject.tags.some(tag =>
                        tag.name !== "Software" && !COMMON_STACK.some(tech => tag.name.includes(tech))
                      );

                      return (hasSoftware || hasTechStack || hasUnique) && (
                        <div className="flex flex-wrap gap-3 justify-center text-xs text-muted-foreground mb-3">
                          {hasSoftware && (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-primary border border-primary" />
                              <span>{t('legend_software')}</span>
                            </div>
                          )}
                          {hasTechStack && (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-secondary border border-border" />
                              <span>{t('legend_stack')}</span>
                            </div>
                          )}
                          {hasUnique && (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-500/20 border border-indigo-500/50" />
                              <span>{t('legend_unique')}</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tagObj) => (
                        <SimpleTooltip key={tagObj.name} content={tagObj.description}>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${getTagStyles(tagObj.name)}`}>
                            {tagObj.name}
                          </span>
                        </SimpleTooltip>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                      {selectedProject.githubUrl && (
                        <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
                          <Github className="w-4 h-4" />
                          {t('github')}
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

                    {/* UPDATE: Conditional Warning Logic */}
                    {isPrivateRepo ? (
                      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg mb-6">
                        <p className="text-sm text-amber-500 font-medium">
                          {t('source_code_warning')}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg border border-border/50 mb-6">
                        <p className="text-sm text-muted-foreground">
                          {t('open_source_message')}
                        </p>
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1 text-primary hover:underline"
                        >
                          {t('view_full_source')} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

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

                {/* DOWNLOADS TAB */}
                {activeTab === "downloads" && selectedProject.downloads && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Linux Download */}
                      {selectedProject.downloads.linux && (
                         <div className="p-6 rounded-xl border border-border bg-card/50 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/50 transition-colors">
                           <div className="p-3 bg-primary/10 rounded-full text-primary">
                             <HardDrive className="w-8 h-8" />
                           </div>
                           <div>
                             <h4 className="font-bold text-lg">Linux (RPM)</h4>
                             <p className="text-sm text-muted-foreground">{t('download_linux_desc')}</p>
                           </div>
                           <a 
                             href={selectedProject.downloads.linux} 
                             download 
                             className="mt-2 flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium w-full justify-center"
                           >
                             <Download className="w-4 h-4" />
                             {t('download_linux')}
                           </a>
                         </div>
                      )}

                      {/* Windows Download */}
                      {selectedProject.downloads.windows && (
                         <div className="p-6 rounded-xl border border-border/50 bg-secondary/20 flex flex-col items-center justify-center text-center gap-4 opacity-75">
                           <div className="p-3 bg-secondary rounded-full text-muted-foreground">
                             <HardDrive className="w-8 h-8" />
                           </div>
                           <div>
                             <h4 className="font-bold text-lg">Windows</h4>
                             <p className="text-sm text-muted-foreground">{t('download_windows_desc')}</p>
                           </div>
                           {isWindowsReady ? (
                             <a 
                               href={selectedProject.downloads.windows}
                               download
                               className="mt-2 flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium w-full justify-center"
                             >
                               <Download className="w-4 h-4" />
                               {t('download_windows')}
                             </a>
                           ) : (
                             <button 
                               disabled 
                               className="mt-2 flex items-center gap-2 px-6 py-2 rounded-md bg-secondary text-muted-foreground cursor-not-allowed font-medium w-full justify-center"
                             >
                               <span className="text-xs font-bold px-1.5 py-0.5 bg-background/50 rounded">{t('coming_soon')}</span>
                               {t('download_windows')}
                             </button>
                           )}
                         </div>
                      )}
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>

          {/* LIGHTBOX OVERLAY */}
          <AnimatePresence>
            {isLightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // Close on clicking backdrop
                onClick={() => setIsLightboxOpen(false)}
                className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
              >
                {/* Close Button - High Z-Index, Independent of Image */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(false);
                  }}
                  className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[70] cursor-pointer"
                  aria-label="Close lightbox"
                >
                  <X className="w-8 h-8" />
                </button>

                {/* Main Lightbox Image Container */}
                <div
                  className="relative w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()} // Clicking image doesn't close
                >
                  <Image
                    src={lightboxImageUrl}
                    alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                    fill
                    sizes="95vw"
                    className="object-contain"
                    quality={100}
                    priority
                  />
                </div>

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-70"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-10 h-10" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-70"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-10 h-10" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white font-mono text-sm border border-white/10 z-70">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
      active
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
    }`}
  >
    {icon}
    {label}
  </button>
);
