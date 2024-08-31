export const languageColors: { [key: string]: string } = {
  HTML: '#e34c26',
  CSS: '#264de4',
  SCSS: '#c6538c',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  React: '#61dafb',
  NodeJS: '#339933',
  Solidity: '#363636',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
};

export const getLanguageColor = (language: string): string => {
  return languageColors[language] || '#808080'; // Default to gray if language not found
};