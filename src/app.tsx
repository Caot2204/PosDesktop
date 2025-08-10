import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PosDesktopApp from './ui/PosDesktopApp';

const root = createRoot(document.body);
root.render(
    <StrictMode>
        <PosDesktopApp />
    </StrictMode>
);