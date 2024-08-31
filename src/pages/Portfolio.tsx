import React, { useState } from 'react';
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

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  const { t } = useTranslation();
  let image;
  try {
    image = require(`../assets/images/${project.image}`);
  } catch (error) {
    console.warn(`Failed to load image for project ${project.name}:`, error);
    image = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; // ! consider not linking to address I do not have control over
  }

  return (
    <div className="portfolio-card clickable" onClick={onClick}>
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
  const [sortBy, setSortBy] = useState<'startDate' | 'lastUpdated'>('startDate');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const toggleSortBy = () => {
    const newSortBy = sortBy === 'startDate' ? 'lastUpdated' : 'startDate';
    setSortBy(newSortBy);
    const sortedProjects = [...projects].sort((a, b) => {
      const dateA = new Date(a[newSortBy]);
      const dateB = new Date(b[newSortBy]);
      return dateB.getTime() - dateA.getTime();
    });
    setProjects(sortedProjects);
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className="portfolio">
      <h1>{t('portfolio')}</h1>
      
      <button onClick={toggleSortBy} className="sort-toggle">
        {sortBy === 'startDate' ? t('sort_by_start_date') : t('sort_by_last_updated')}
      </button>

      <div className="portfolio-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => openModal(project)} />
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