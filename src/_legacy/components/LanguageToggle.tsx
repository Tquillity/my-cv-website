// src/components/LanguageToggle.tsx
import React from 'react';
import { useLanguage } from '../utils/i18n';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  };

  return (
    <button onClick={toggleLanguage}>
      {language === 'en' ? 'Svenska' : 'English'}
    </button>
  );
};

export default LanguageToggle;