// src/components/Footer.tsx
import React from "react";
import { useTranslation } from "../utils/i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright">&copy; {currentYear} Mikael Sundh. {t('all_rights_reserved')}</p>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/mikael-sundh/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="https://github.com/Tquillity" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;