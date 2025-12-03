// src/components/ThemeToggle.tsx
import React from 'react';
import { useTheme } from '../utils/theme';
import { useTranslation } from '../utils/i18n';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return ( 
    <button onClick={toggleTheme}>
      {theme === 'dark' ? t('light_mode') : t('dark_mode')}
    </button>
  );
};

export default ThemeToggle;