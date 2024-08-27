// src/pages/CVResume.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../utils/i18n';
import { useLanguage } from '../utils/i18n';
import Modal from '../components/Modal';
import enData from '../data/cv-data-en.json';
import svData from '../data/cv-data-sv.json';

interface Experience {
  id: number;
  title: string;
  company: string;
  date: string;
  description: string;
  area: string;
  startYear: number;
  endYear: number;
}

interface Education {
  degree: string;
  institution: string;
  date: string;
  description: string;
  startYear: number;
  endYear: number;
}

interface CVData {
  personalInfo: {
    name: string;
    objective: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages: {
    language: string;
    proficiency: string;
  }[];
}

interface ModalContent {
  type: 'experience' | 'education' | 'skill' | 'language';
  content: Experience | Education | string;
}

const CVResume: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [infoLevel, setInfoLevel] = useState<'full' | 'medium' | 'small'>('full');
  const [cvData, setCvData] = useState<CVData>(language === 'en' ? enData : svData);
  const [yearsToShow, setYearsToShow] = useState<number>(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const currentYear = new Date().getFullYear();
  const earliestYear = Math.min(
    ...cvData.experiences.map(exp => exp.startYear),
    ...cvData.education.map(edu => edu.startYear)
  );
  const maxYears = currentYear - earliestYear;

  useEffect(() => {
    setCvData(language === 'en' ? enData : svData);
  }, [language]);

  const filteredExperiences = cvData.experiences.filter(exp => 
    (selectedAreas.length === 0 || selectedAreas.includes(exp.area)) &&
    (exp.endYear >= currentYear - yearsToShow || exp.startYear >= currentYear - yearsToShow)
  );

  const filteredEducation = cvData.education.filter(edu =>
    edu.endYear >= currentYear - yearsToShow || edu.startYear >= currentYear - yearsToShow
  );

  const openModal = (type: 'experience' | 'education' | 'skill' | 'language', content: Experience | Education | string) => {
    setModalContent({ type, content });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  const renderExperience = (exp: Experience) => {
    switch (infoLevel) {
      case 'small':
        return <p>{exp.title} at {exp.company}</p>;
      case 'medium':
        return (
          <>
            <h3>{exp.title}</h3>
            <p>{exp.company} | {exp.date}</p>
          </>
        );
      case 'full':
      default:
        return (
          <>
            <h3>{exp.title}</h3>
            <p>{exp.company} | {exp.date}</p>
            <p>{exp.description}</p>
          </>
        );
    }
  };

  const renderModalContent = () => {
    if (!modalContent) return null;

    switch (modalContent.type) {
      case 'experience':
        const exp = modalContent.content as Experience;
        return (
          <>
            <h2>{exp.title}</h2>
            <p>{exp.company} | {exp.date}</p>
            <p>{exp.description}</p>
            <img src="/placeholder-image.jpg" alt="Related content" />
          </>
        );
      case 'education':
        const edu = modalContent.content as Education;
        return (
          <>
            <h2>{edu.degree}</h2>
            <p>{edu.institution} | {edu.date}</p>
            <p>{edu.description}</p>
            <img src="/placeholder-image.jpg" alt="Related content" />
          </>
        );
      case 'skill':
      case 'language':
        const content = modalContent.content as string;
        return (
          <>
            <h2>{content}</h2>
            <ul>
              <li><a href="#">Portfolio Example 1</a></li> // ! not yet implemented
              <li><a href="#">Portfolio Example 2</a></li> // ! not yet implemented
              <li><a href="#">Portfolio Example 3</a></li> // ! not yet implemented
            </ul>
          </>
        );
    }
  };

  return (
    <div className="cv-resume">
      <h1>{t('cv_resume')}</h1>
      
      <div className="cv-resume-filters">
        <h2>{t('filters')}</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <h3>{t('filter_by_area')}</h3>
            {Array.from(new Set(cvData.experiences.map(exp => exp.area))).map(area => (
              <label key={area}>
                <input
                  type="checkbox"
                  checked={selectedAreas.includes(area)}
                  onChange={() => {
                    setSelectedAreas(prev => 
                      prev.includes(area)
                        ? prev.filter(a => a !== area)
                        : [...prev, area]
                    );
                  }}
                />
                {area}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>{t('info_level')}</h3>
            <select
              value={infoLevel}
              onChange={(e) => setInfoLevel(e.target.value as 'full' | 'medium' | 'small')}
            >
              <option value="full">{t('full_info')}</option>
              <option value="medium">{t('medium_info')}</option>
              <option value="small">{t('small_info')}</option>
            </select>
          </div>
          <div className="filter-group">
            <h3>{t('recency_filter')}</h3>
            <input
              type="range"
              min="1"
              max={maxYears}
              value={yearsToShow}
              onChange={(e) => setYearsToShow(Number(e.target.value))}
            />
            <span>{yearsToShow} {t('years')}</span>
          </div>
        </div>
      </div>
      
      <div className="cv-resume-data">
        <div className="cv-resume-section">
          <h2>{t('work_experience')}</h2>
          {filteredExperiences.map(exp => (
            <div 
              key={exp.id} 
              className="experience clickable"
              onClick={() => openModal('experience', exp)}
            >
              {renderExperience(exp)}
            </div>
          ))}
        </div>
        
        <div className="cv-resume-section">
          <h2>{t('education')}</h2>
          {filteredEducation.map((edu, index) => (
            <div 
              key={index} 
              className="education-item clickable"
              onClick={() => openModal('education', edu)}
            >
              <h3>{edu.degree}</h3>
              <p>{edu.institution} | {edu.date}</p>
              {infoLevel === 'full' && <p>{edu.description}</p>}
            </div>
          ))}
        </div>
        
        <div className="cv-resume-section">
          <h2>{t('skills')}</h2>
          <ul className="skills-list">
            {cvData.skills.map((skill, index) => (
              <li 
                key={index}
                className="clickable"
                onClick={() => openModal('skill', skill)}
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="cv-resume-section">
          <h2>{t('languages')}</h2>
          <ul className="languages-list">
            {cvData.languages.map((lang, index) => (
              <li 
                key={index}
                className="clickable"
                onClick={() => openModal('language', `${lang.language}: ${lang.proficiency}`)}
              >
                {lang.language}: {lang.proficiency}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default CVResume;