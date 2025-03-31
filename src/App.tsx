import React from 'react';
import { Routes, Route } from 'react-router-dom';

import usePageTracking from "./usePageTracking";
import ConsentBanner from './components/ConsentBanner';

// Route configuration
import { routes } from './routes';

const App: React.FC = () => {
  usePageTracking();

  return (
    <>
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
    </>
  );
};

export default App;
