// src/App.tsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CVResume from './pages/CVResume';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import { ThemeProvider } from './utils/theme';
import { LanguageProvider } from './utils/i18n';
import './index.css';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguage] = useState<'en' | 'sv'>('en');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeProvider value={{ theme, setTheme }}>
      <LanguageProvider value={{ language, setLanguage }}>
        <Router>
          <div className={`app ${theme}`}>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<CVResume />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;