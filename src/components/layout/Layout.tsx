import React from 'react';
import Navbar from '../common/NavBar';
import { PersonaProvider } from '../../persona/PersonaContext';

interface LayoutProps {
  children: React.ReactNode;
}

// PersonaProvider wraps both the navbar and the page so persona-aware links and
// per-page copy resolve from the same `:profileName` URL segment.
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <PersonaProvider>
      <div>
        <Navbar />
        <div className="content">{children}</div>
      </div>
    </PersonaProvider>
  );
};

export default Layout;
