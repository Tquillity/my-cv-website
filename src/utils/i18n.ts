// src/utils/i18n.ts
import React, { createContext, useContext } from 'react';

type Language = 'en' | 'sv';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void; // ! What did I miss and where? "Warning on this line: 'setLanguage' is declared but its value is never read."
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = LanguageContext.Provider;

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

type TranslationKey = keyof typeof translations['en'];

const translations = {
  en: {
    cv_resume: 'CV & Resume',
    portfolio: 'Portfolio',
    about: 'About',
    dark_mode: 'Dark Mode',
    light_mode: 'Light Mode',
    recency_filter: 'Recency Filter',
    years: 'Years',
    filter_by_area: 'Filter by Area',
    filters: 'Filters',
    area: 'Area',
    info_level: 'Info Level',
    full_info: 'Full Info',
    medium_info: 'Medium Info',
    small_info: 'Small Info',
    work_experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    all_rights_reserved: 'All rights reserved',
    about_placeholder: 'This is a placeholder for the about page.', // remove when replaced
    linkedin_feed_placeholder: 'This is a placeholder for the LinkedIn feed.', // remove when replaced
    portfolio_placeholder: 'This is a placeholder for the portfolio page.' // remove when replaced
  },
  sv: {
    cv_resume: 'CV & Meritförteckning',
    portfolio: 'Portfölj',
    about: 'Om mig',
    dark_mode: 'Mörkt läge',
    light_mode: 'Ljust läge',
    recency_filter: 'Närtidsfilter',
    years: 'År',
    filter_by_area: 'Filtrera efter område',
    filters: 'Filter',
    area: 'Område',
    info_level: 'Datamängd',
    full_info: 'Fullständig information',
    medium_info: 'Mellaninformation',
    small_info: 'Minst information',
    work_experience: 'Arbetslivserfarenhet',
    education: 'Utbildning',
    skills: 'Färdigheter',
    languages: 'Språk',
    all_rights_reserved: 'Alla rättigheter förbehållna',
    about_placeholder: 'Detta är en platsmarkering för om-sidan.', // remove when replaced
    linkedin_feed_placeholder: 'Detta är en platsmarkering för LinkedIn-flödet.', // remove when replaced
    portfolio_placeholder: 'Detta är en platsmarkering för portföljsidan.' // remove when replaced
  },
};

export const useTranslation = () => {
  const { language } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  return { t };
};