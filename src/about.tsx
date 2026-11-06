import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AboutScreen from './ui/about/components/AboutScreen';

createRoot(document.body).render(
  <StrictMode>
    <AboutScreen {...window.posSystemApi!.aboutInfo} />
  </StrictMode>
);
