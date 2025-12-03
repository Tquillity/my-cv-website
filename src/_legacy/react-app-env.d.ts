/// <reference types="react-scripts" />

interface Window {
  gtag: (...args: any[]) => void;
  dataLayer: any[];
}