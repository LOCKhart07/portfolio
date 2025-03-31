import React from 'react';
import NetflixTitle from './NetflixTitle';
import ProfilePage from './profilePage/profilePage';
import Browse from './browse/browse';
import WorkPermit from './pages/WorkPermit';
import WorkExperience from './pages/WorkExperience';
import Recommendations from './pages/Recommendations';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import ContactMe from './pages/ContactMe';
import Layout from './Layout';
import Music from './pages/Music';
import Reading from './pages/Reading';
import Blogs from './pages/Blogs';
import Certifications from './pages/Certifications';
import Quotes from './pages/Quotes';
import Awards from './pages/Awards';
import NotFound from './pages/NotFound';

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
        path: '/work-permit',
        element: <Layout><WorkPermit /></Layout>
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