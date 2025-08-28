import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { initializeModernAnimations } from './utils/modernAnimations';

// Initialize modern animations
document.addEventListener('DOMContentLoaded', () => {
  initializeModernAnimations();
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
    <App />
    </HelmetProvider>
  </StrictMode>
);
