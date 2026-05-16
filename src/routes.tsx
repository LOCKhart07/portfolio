import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import NetflixTitle from './components/common/NetflixTitle';
import Layout from './components/layout/Layout';
import { LAST_PERSONA_KEY } from './persona/PersonaContext';
import { coercePersona } from './persona/personaConfig';

// The `/` splash (NetflixTitle) and the shared Layout stay eagerly imported so
// the first paint is instant. Every other route is code-split — the landing
// screen no longer ships every page's bundle (framer-motion, the timeline
// component, etc.). Vite emits one chunk per import() below.
const Browse = lazy(() => import('./browse/browse'));
const ProfilePage = lazy(() => import('./profilePage/profilePage'));
const WorkExperience = lazy(() => import('./pages/WorkExperience'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const Skills = lazy(() => import('./pages/Skills'));
const Projects = lazy(() => import('./pages/Projects'));
const ContactMe = lazy(() => import('./pages/ContactMe'));
const Music = lazy(() => import('./pages/Music'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Quotes = lazy(() => import('./pages/Quotes'));
const Awards = lazy(() => import('./pages/Awards'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Persona is now part of the URL: every content page lives under
// /profile/:profileName/<section> so it is shareable, bookmarkable and
// deep-link safe. `:profileName` is validated by PersonaProvider (invalid
// values redirect to the recruiter equivalent).
const sections: { path: string; element: React.ReactNode }[] = [
  { path: 'work-experience', element: <WorkExperience /> },
  { path: 'recommendations', element: <Recommendations /> },
  { path: 'skills', element: <Skills /> },
  { path: 'projects', element: <Projects /> },
  { path: 'contact-me', element: <ContactMe /> },
  { path: 'music', element: <Music /> },
  { path: 'certifications', element: <Certifications /> },
  { path: 'quotes', element: <Quotes /> },
  { path: 'awards', element: <Awards /> },
];

// Old flat paths (/projects, /skills, …) still work: redirect to the
// visitor's last-used persona, falling back to recruiter. Exported for unit
// tests (the localStorage/coerce/path-build branching is the logic).
export const LegacyRedirect: React.FC<{ section: string }> = ({ section }) => {
  let persona = 'recruiter';
  try {
    persona = coercePersona(localStorage.getItem(LAST_PERSONA_KEY) ?? undefined);
  } catch {
    /* storage disabled — recruiter fallback */
  }
  return <Navigate to={`/profile/${persona}/${section}`} replace />;
};

export const routes = [
  {
    path: '/',
    element: <NetflixTitle />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/profile/:profileName',
    element: <Layout><ProfilePage /></Layout>
  },
  ...sections.map((s) => ({
    path: `/profile/:profileName/${s.path}`,
    element: <Layout>{s.element}</Layout>
  })),
  // Legacy flat-path redirects (must be kept in sync with `sections`).
  ...sections.map((s) => ({
    path: `/${s.path}`,
    element: <LegacyRedirect section={s.path} />
  })),
  {
    path: '*',
    element: <Layout><NotFound /></Layout>
  }
];
