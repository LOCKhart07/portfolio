import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import usePageTracking from "./hooks/usePageTracking";
import ConsentBanner from './components/common/ConsentBanner';
import ChatBot from './components/features/ChatBot/ChatBot';
import RouteFallback from './components/common/RouteFallback';

// Route configuration
import { routes } from './routes';

const App: React.FC = () => {
  usePageTracking();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </Suspense>
      <ConsentBanner />
      <div id="chatbot-root" style={{ position: 'relative', zIndex: 9999 }}>
        <ChatBot />
      </div>
    </div>
  );
};

export default App;
