import './ui/theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PosDesktopApp from './ui/PosDesktopApp';
import { ThemeProvider } from './ui/context/ThemeContext';

const root = createRoot(document.body);
root.render(
  <StrictMode>
    <ThemeProvider>
      <PosDesktopApp />
    </ThemeProvider>
  </StrictMode>
);