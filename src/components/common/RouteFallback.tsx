import React from 'react';
import 'styles/RouteFallback.css';

// Shown while a lazily-loaded route chunk is fetched. Matches the app's
// dark background so code-split navigations don't flash a white screen.
const RouteFallback: React.FC = () => (
  <div className="route-fallback" role="status" aria-label="Loading">
    <div className="route-fallback-spinner" />
  </div>
);

export default RouteFallback;
