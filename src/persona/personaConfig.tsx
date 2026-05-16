// Single source of truth for the four Netflix-style personas.
//
// Before this module the ProfileType union, the section imageMap, and the
// per-persona card lists were duplicated (verbatim) across profilePage.tsx,
// TopPicksRow.tsx and ContinueWatching.tsx. Everything persona-related now
// lives here so the personas can actually differ instead of drifting.

import React, { ReactNode } from 'react';
import {
  FaCode, FaBriefcase, FaCertificate, FaHandsHelping,
  FaProjectDiagram, FaEnvelope, FaMusic, FaQuoteLeft, FaTrophy,
} from 'react-icons/fa';

import Skills from 'images/sections/Skills.webp';
import Experience from 'images/sections/Experience.webp';
import Certifications from 'images/sections/Certifications.webp';
import Recommendations from 'images/sections/Recommendations.webp';
import ContactMeImg from 'images/sections/Contact Me.webp';
import WorkPermit from 'images/sections/Work Permit.webp';
import Projects from 'images/sections/Projects.webp';
import Music from 'images/sections/Music.webp';
import Quotes from 'images/sections/Quotes.webp';
import Awards from 'images/sections/Awards.webp';

import blueImage from 'images/profiles/blue.webp';
import greyImage from 'images/profiles/grey.webp';
import redImage from 'images/profiles/red.webp';
import yellowImage from 'images/profiles/yellow.webp';

export type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'adventurer';

export const PERSONAS: ProfileType[] = ['recruiter', 'developer', 'stalker', 'adventurer'];

export const isPersona = (x?: string): x is ProfileType =>
  !!x && (PERSONAS as readonly string[]).includes(x);

export const coercePersona = (x?: string): ProfileType =>
  isPersona(x) ? x : 'recruiter';

// Keyed by card title. Every title used in topPicksConfig /
// continueWatchingConfig MUST have an entry here or the card renders a broken
// <img>.
export const imageMap: Record<string, string> = {
  Skills,
  Experience,
  Certifications,
  Recommendations,
  'Contact Me': ContactMeImg,
  'Work Permit': WorkPermit,
  Projects,
  Music,
  Quotes,
  Awards,
};

// Small avatar shown in the navbar. Previously passed via router state
// (location.state.profileImage), which is lost on refresh/deep-link; deriving
// it from the persona keeps it correct everywhere.
export const avatarMap: Record<ProfileType, string> = {
  recruiter: blueImage,
  developer: greyImage,
  stalker: redImage,
  adventurer: yellowImage,
};

// Navbar contact CTA label. The link always routes to /contact-me; only the
// wording changes so each persona gets a call-to-action in its own register.
export const contactCtaLabel: Record<ProfileType, string> = {
  recruiter: 'Hire Me',
  developer: "Let's Build",
  stalker: 'Get in Touch',
  adventurer: 'Say Hi',
};

// Profile-page background. Was previously passed via router state from
// browse.tsx and broke on refresh / shared links; now deep-link safe.
export const backgroundGif: Record<ProfileType, string> = {
  recruiter:
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTZ5eWwwbjRpdWM1amxyd3VueHhteTVzajVjeGZtZGJ1dDc4MXMyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/16u7Ifl2T4zYfQ932F/giphy.gif',
  developer:
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnNsdDE2YXYxZnU5MzJ3bjIxYzRiOW5rbHYydWVzMzN1cXl2NTU5MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8fQ1oiRxx9stbdECAo/giphy.gif',
  stalker:
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExc28yMjMyZmJ6eWtxbmNwdDV6cXk4dWZmcjFhZms2cXBjN2h5ZDJjeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QjZXUBUr89CkiWLPjL/giphy.gif',
  adventurer:
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmxib24ycWo2cjlmazh0NGV5NTZ2Mzd2YWY0M2tvam9oYXBwYW1ocCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ERKMnDK6tkzJe8YVa3/giphy-downsized-large.gif',
};

export interface TopPick {
  title: string;
  route: string;
  icon: ReactNode;
}

// `route` is the section path WITHOUT the persona prefix; callers prepend
// `/profile/<persona>`.
export const topPicksConfig: Record<ProfileType, TopPick[]> = {
  recruiter: [
    { title: 'Experience', icon: <FaBriefcase />, route: '/work-experience' },
    { title: 'Skills', icon: <FaCode />, route: '/skills' },
    { title: 'Projects', icon: <FaProjectDiagram />, route: '/projects' },
    { title: 'Recommendations', icon: <FaHandsHelping />, route: '/recommendations' },
    { title: 'Certifications', icon: <FaCertificate />, route: '/certifications' },
    { title: 'Awards', icon: <FaTrophy />, route: '/awards' },
    { title: 'Contact Me', icon: <FaEnvelope />, route: '/contact-me' },
  ],
  developer: [
    { title: 'Projects', route: '/projects', icon: <FaProjectDiagram /> },
    { title: 'Skills', route: '/skills', icon: <FaCode /> },
    { title: 'Experience', route: '/work-experience', icon: <FaBriefcase /> },
    { title: 'Certifications', route: '/certifications', icon: <FaCertificate /> },
    { title: 'Awards', route: '/awards', icon: <FaTrophy /> },
    { title: 'Recommendations', route: '/recommendations', icon: <FaHandsHelping /> },
    { title: 'Contact Me', route: '/contact-me', icon: <FaEnvelope /> },
  ],
  stalker: [
    { title: 'Projects', route: '/projects', icon: <FaProjectDiagram /> },
    { title: 'Experience', route: '/work-experience', icon: <FaBriefcase /> },
    { title: 'Skills', route: '/skills', icon: <FaCode /> },
    { title: 'Certifications', route: '/certifications', icon: <FaCertificate /> },
    { title: 'Awards', route: '/awards', icon: <FaTrophy /> },
    { title: 'Recommendations', route: '/recommendations', icon: <FaHandsHelping /> },
    { title: 'Contact Me', route: '/contact-me', icon: <FaEnvelope /> },
  ],
  adventurer: [
    { title: 'Projects', route: '/projects', icon: <FaProjectDiagram /> },
    { title: 'Experience', route: '/work-experience', icon: <FaBriefcase /> },
    { title: 'Skills', route: '/skills', icon: <FaCode /> },
    { title: 'Awards', route: '/awards', icon: <FaTrophy /> },
    { title: 'Quotes', route: '/quotes', icon: <FaQuoteLeft /> },
    { title: 'Music', route: '/music', icon: <FaMusic /> },
    { title: 'Contact Me', route: '/contact-me', icon: <FaEnvelope /> },
  ],
};

export interface ContinueItem {
  title: string;
  link: string;
}

// Secondary row, per-persona. Kept distinct from each persona's topPicks so
// the two rows complement rather than repeat.
export const continueWatchingConfig: Record<ProfileType, ContinueItem[]> = {
  recruiter: [
    { title: 'Quotes', link: '/quotes' },
    { title: 'Music', link: '/music' },
  ],
  developer: [
    { title: 'Quotes', link: '/quotes' },
    { title: 'Music', link: '/music' },
  ],
  stalker: [
    { title: 'Music', link: '/music' },
    { title: 'Quotes', link: '/quotes' },
  ],
  adventurer: [
    { title: 'Recommendations', link: '/recommendations' },
    { title: 'Certifications', link: '/certifications' },
  ],
};
