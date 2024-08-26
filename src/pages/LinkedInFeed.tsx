// src/pages/LinkedInFeed.tsx
import React from 'react';
import { useTranslation } from '../utils/i18n';

const LinkedInFeed: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="linkedin-feed">
      <h1>{t('linkedin_feed')}</h1>
      <p>{t('linkedin_feed_placeholder')}</p>
    </div>
  );
};

export default LinkedInFeed;