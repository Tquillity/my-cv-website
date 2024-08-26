// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '../utils/i18n';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">CV</Link></li>
          <li><Link to="/portfolio">{t('portfolio')}</Link></li>
          <li><Link to="/linkedin">{t('linkedin_feed')}</Link></li>
          <li><Link to="/about">{t('about')}</Link></li>
        </ul>
      </nav>
      <div className="toggles">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  );
};

export default Header;