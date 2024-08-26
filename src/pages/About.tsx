// src/pages/About.tsx
import React from 'react';
import { useTranslation } from '../utils/i18n';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="about-me">
      <h1>{t('about')}</h1>
      <p>{t('about_placeholder')}</p>
    </div>
  );
};

export default About;