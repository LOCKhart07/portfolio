import React, { lazy } from 'react';
import NetflixTitle from './components/common/NetflixTitle';
import Layout from './components/layout/Layout';

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
const Reading = lazy(() => import('./pages/Reading'));
const Blogs = lazy(() => import('./pages/Blogs'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Quotes = lazy(() => import('./pages/Quotes'));
const Awards = lazy(() => import('./pages/Awards'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
    {
        path: '/work-experience',
        element: <Layout><WorkExperience /></Layout>
    },
    {
        path: '/recommendations',
        element: <Layout><Recommendations /></Layout>
    },
    {
        path: '/skills',
        element: <Layout><Skills /></Layout>
    },
    {
        path: '/projects',
        element: <Layout><Projects /></Layout>
    },
    {
        path: '/contact-me',
        element: <Layout><ContactMe /></Layout>
    },
    {
        path: '/music',
        element: <Layout><Music /></Layout>
    },
    {
        path: '/reading',
        element: <Layout><Reading /></Layout>
    },
    {
        path: '/blogs',
        element: <Layout><Blogs /></Layout>
    },
    {
        path: '/certifications',
        element: <Layout><Certifications /></Layout>
    },
    {
        path: '/quotes',
        element: <Layout><Quotes /></Layout>
    },
    {
        path: '/awards',
        element: <Layout><Awards /></Layout>
    },
    {
        path: '*',
        element: <Layout><NotFound /></Layout>
    }
];
