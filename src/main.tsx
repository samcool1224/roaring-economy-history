import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MuseumProvider } from './state/MuseumContext';
import './styles/app.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <MuseumProvider>
        <App />
      </MuseumProvider>
    </StrictMode>,
  );
}
