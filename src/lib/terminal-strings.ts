// English-only terminal strings
// This module ensures the terminal always displays in English regardless of site locale

import enMessages from "../../messages/en.json";

export const getTerminalString = (key: string): string => {
  // Use optional chaining to prevent "cannot read Terminal of undefined"
  const terminalMessages = (enMessages as any)?.Terminal;
  return terminalMessages?.[key] || key;
};

export const getAboutPageString = (key: string): string => {
  // Use optional chaining to prevent "cannot read AboutPage of undefined"
  const aboutMessages = (enMessages as any)?.AboutPage;
  return aboutMessages?.[key] || key;
};

