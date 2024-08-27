// src/components/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from '../utils/i18n';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">Mikael Sundh</div>
      <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>{t('cv_resume')}</Link></li>
          <li><Link to="/portfolio" onClick={() => setIsMenuOpen(false)}>{t('portfolio')}</Link></li>
          <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>{t('about')}</Link></li>
        </ul>
      </nav>
      <div className="toggles">
        <ThemeToggle />
        <LanguageToggle />
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>
    </header>
  );
};

export default Header;