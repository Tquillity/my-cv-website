import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../utils/i18n';
import portfolioData from '../data/portfolioData.json';
import Modal from '../components/Modal';
import { getLanguageColor } from '../utils/languageColors';

interface Project {
  id: number;
  name: string;
  languages: string[];
  stackType: string;
  description: string;
  image: string;
  projectType: string;
  status: string;
  githubRepo: string;
  liveVersion: string | null;
  startDate: string;
  lastUpdated: string;
}

const ProjectCard: React.FC<{ 
  project: Project; 
  onClick: () => void; 
  isFocused: boolean;
}> = ({ project, onClick, isFocused }) => {
  const { t } = useTranslation();
  let image;
  try {
    image = require(`../assets/images/${project.image}`);
  } catch (error) {
    console.warn(`Failed to load image for project ${project.name}:`, error);
    image = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; // ! consider not linking to address I do not have control over
  }

  return (
    <div 
      className={`portfolio-card ${isFocused ? 'focused' : ''}`} 
      onClick={onClick}
    > 
      <img src={image} alt={project.name} className="portfolio-image" />
      <div className="portfolio-content">
        <h2>{project.name}</h2>
        <p className="stack-type">{project.stackType}</p>
        <p className="project-type">{project.projectType}</p>
        <p className="status">{project.status}</p>
        <div className="languages">
          {project.languages.map((lang, index) => (
            <span 
              key={index} 
              className="language-tag" 
              style={{ backgroundColor: getLanguageColor(lang) }}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Portfolio: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>(portfolioData.projects);
  const [sortBy, setSortBy] = useState<'startDate' | 'lastUpdated'>('lastUpdated');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sortedProjects = [...projects].sort((a, b) => {
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      return dateB.getTime() - dateA.getTime();
    });
    setProjects(sortedProjects);
    setFocusedIndex(0);
  }, [sortBy]);

  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const containerRect = timelineRef.current.getBoundingClientRect();
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        const containerTop = containerRect.top + window.scrollY;
        const relativePosition = scrollPosition - containerTop;
        const cardHeight = containerRect.height / projects.length;
        const newFocusedIndex = Math.floor(relativePosition / cardHeight);
        setFocusedIndex(Math.max(0, Math.min(newFocusedIndex, projects.length - 1)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [projects.length]);

  const toggleSortBy = () => {
    setSortBy(prevSortBy => prevSortBy === 'startDate' ? 'lastUpdated' : 'startDate');
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const focusedTimelineStyle = {
    top: `${(focusedIndex / projects.length) * 100}%`,
    height: `${(1 / projects.length) * 100}%`,
  };

  return (
    <div className="portfolio">
      <h1>{t('portfolio')}</h1>
      
      <button onClick={toggleSortBy} className="sort-toggle">
        {sortBy === 'startDate' ? t('sort_by_start_date') : t('sort_by_last_updated')}
      </button>

      <div className="timeline-container" ref={timelineRef}>
        <div className="timeline-bar"></div>
        <div className="timeline-focus" style={focusedTimelineStyle}></div>
        {projects.map((project, index) => (
          <div 
            className={`timeline-item ${index === focusedIndex ? 'focused' : ''}`} 
            key={project.id}
          >
            <div className="timeline-date">{project[sortBy]}</div>
            <div className="timeline-spot"></div>
            <ProjectCard 
              project={project} 
              onClick={() => openModal(project)}
              isFocused={index === focusedIndex}
            />
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedProject} onClose={closeModal}>
        {selectedProject && (
          <div className="project-modal">
            {(() => {
              let modalImage;
              try {
                modalImage = require(`../assets/images/${selectedProject.image}`);
              } catch (error) {
                console.warn(`Failed to load modal image for project ${selectedProject.name}:`, error);
                modalImage = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
              }
              return <img src={modalImage} alt={selectedProject.name} className="modal-image" />;
            })()}
            <h2>{selectedProject.name}</h2>
            <p className="description">{selectedProject.description}</p>
            <p><strong>{t('project_type')}:</strong> {selectedProject.projectType}</p>
            <p><strong>{t('status')}:</strong> {selectedProject.status}</p>
            <p><strong>{t('start_date')}:</strong> {selectedProject.startDate}</p>
            <p><strong>{t('last_updated')}:</strong> {selectedProject.lastUpdated}</p>
            <div className="languages">
              {selectedProject.languages.map((lang, index) => (
                <span 
                  key={index} 
                  className="language-tag" 
                  style={{ backgroundColor: getLanguageColor(lang) }}
                >
                  {lang}
                </span>
              ))}
            </div>
            <div className="links">
              <a href={selectedProject.githubRepo} target="_blank" rel="noopener noreferrer" className="github-link">
                {t('view_on_github')}
              </a>
              {selectedProject.liveVersion && (
                <a href={selectedProject.liveVersion} target="_blank" rel="noopener noreferrer" className="live-link">
                  {t('view_live_version')}
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Portfolio;