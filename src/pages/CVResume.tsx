// src/pages/CVResume.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../utils/i18n';
import { useLanguage } from '../utils/i18n';
import enData from '../data/cv-data-en.json';
import svData from '../data/cv-data-en.json';

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

const CVResume: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [infoLevel, setInfoLevel] = useState<'full' | 'medium' | 'small'>('full');
  const [cvData, setCvData] = useState<CVData>(language === 'en' ? enData : svData);
  const [yearsToShow, setYearsToShow] = useState<number>(20);

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

  return (
    <div className="cv-resume">
      <h1>{t('cv_resume')}</h1>
      <div className="personal-info">
        <h2>{cvData.personalInfo.name}</h2>
        <p>{cvData.personalInfo.objective}</p>
      </div>
      <div className="filters">
        <div>
          <h2>{t('filter_by_area')}</h2>
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
        <div>
          <h2>{t('info_level')}</h2>
          <select
            value={infoLevel}
            onChange={(e) => setInfoLevel(e.target.value as 'full' | 'medium' | 'small')}
          >
            <option value="full">{t('full_info')}</option>
            <option value="medium">{t('medium_info')}</option>
            <option value="small">{t('small_info')}</option>
          </select>
        </div>
        <div>
          <h2>{t('recency_filter')}</h2>
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
      <div className="experiences">
        <h2>{t('work_experience')}</h2>
        {filteredExperiences.map(exp => (
          <div key={exp.id} className="experience">
            {renderExperience(exp)}
          </div>
        ))}
      </div>
      <div className="education">
        <h2>{t('education')}</h2>
        {filteredEducation.map((edu, index) => (
          <div key={index} className="education-item">
            <h3>{edu.degree}</h3>
            <p>{edu.institution} | {edu.date}</p>
            {infoLevel === 'full' && <p>{edu.description}</p>}
          </div>
        ))}
      </div>
      <div className="skills">
        <h2>{t('skills')}</h2>
        <ul>
          {cvData.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <div className="languages">
        <h2>{t('languages')}</h2>
        <ul>
          {cvData.languages.map((lang, index) => (
            <li key={index}>{lang.language}: {lang.proficiency}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CVResume;