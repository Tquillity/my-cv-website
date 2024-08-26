// src/pages/Portfolio.tsx
import React from 'react';
import { useTranslation } from '../utils/i18n';

const Portfolio: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="portfolio">
      <h1>{t('portfolio')}</h1>
      <p>{t('portfolio_placeholder')}</p>
    </div>
  );
};

export default Portfolio;