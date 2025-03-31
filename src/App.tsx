import React from 'react';
import { Routes, Route } from 'react-router-dom';

import usePageTracking from "./usePageTracking";
import ConsentBanner from './components/ConsentBanner';
import ChatBot from './components/ChatBot/ChatBot';

// Route configuration
import { routes } from './routes';

const App: React.FC = () => {
  usePageTracking();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
      <ConsentBanner />
      <div id="chatbot-root" style={{ position: 'relative', zIndex: 9999 }}>
        <ChatBot />
      </div>
    </div>
  );
};

export default App;
