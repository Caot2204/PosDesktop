import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AboutScreen from './ui/about/components/AboutScreen';
import './i18n'

createRoot(document.body).render(
  <StrictMode>
    <AboutScreen {...window.posSystemApi!.aboutInfo} />
  </StrictMode>
);
