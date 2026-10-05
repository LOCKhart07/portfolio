// Single source of truth for the four Netflix-style personas.
//
// Before this module the ProfileType union, the section imageMap, and the
// per-persona card lists were duplicated (verbatim) across profilePage.tsx,
// TopPicksRow.tsx and ContinueWatching.tsx. Everything persona-related now
// lives here so the personas can actually differ instead of drifting.

import React, { type ReactNode } from 'react';
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

import type { ImageMetadata } from 'astro';
import type { ProfileType } from './personas';

// The dependency-free primitives live in personas.ts (browser scripts and
// the _redirects generator import them without this module's image graph).
export * from './personas';

// Keyed by card title. Every title used in topPicksConfig /
// continueWatchingConfig MUST have an entry here or the card renders a broken
// <img>. These are the full-size sources; the profile page resizes them to
// card size at build time (getImage) before rendering.
/** A card image already resized for the rows (see profile/[persona]/index.astro). */
export interface CardImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

// Cards render ~45vw wide on phones and ~250-300px on desktop.
export const CARD_IMAGE_SIZES = '(max-width: 768px) 45vw, 300px';

export const imageMap: Record<string, ImageMetadata> = {
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
export const avatarImages: Record<ProfileType, ImageMetadata> = {
  recruiter: blueImage,
  engineer: greyImage,
  collaborator: redImage,
  explorer: yellowImage,
};

// Full-size avatar URLs (profile picker cards render them up to 200px).
export const avatarMap = Object.fromEntries(
  Object.entries(avatarImages).map(([persona, img]) => [persona, img.src]),
) as Record<ProfileType, string>;

// Navbar contact CTA label. The link always routes to /contact-me; only the
// wording changes so each persona gets a call-to-action in its own register.
export const contactCtaLabel: Record<ProfileType, string> = {
  recruiter: 'Hire Me',
  engineer: "Let's Build",
  collaborator: 'Work With Me',
  explorer: 'Say Hi',
};

export interface TopPick {
  title: string;
  route: string;
  icon: ReactNode;
}

// `route` is the section path WITHOUT the persona prefix; callers prepend
// `/profile/<persona>`.
// Order encodes persona intent (what that visitor wants to see first). No
// persona drops a section — anything not led with here lives in that
// persona's continueWatchingConfig, so every section stays reachable.
export const topPicksConfig: Record<ProfileType, TopPick[]> = {
  // recruiter — skim & screen: credibility-forward.
  recruiter: [
    { title: 'Experience', route: '/work-experience', icon: <FaBriefcase /> },
    { title: 'Skills', route: '/skills', icon: <FaCode /> },
    { title: 'Projects', route: '/projects', icon: <FaProjectDiagram /> },
    { title: 'Recommendations', route: '/recommendations', icon: <FaHandsHelping /> },
    { title: 'Certifications', route: '/certifications', icon: <FaCertificate /> },
    { title: 'Awards', route: '/awards', icon: <FaTrophy /> },
    { title: 'Contact Me', route: '/contact-me', icon: <FaEnvelope /> },
  ],
  // engineer — judging depth: lead with the work and the stack.
  engineer: [
    { title: 'Projects', route: '/projects', icon: <FaProjectDiagram /> },
    { title: 'Skills', route: '/skills', icon: <FaCode /> },
    { title: 'Experience', route: '/work-experience', icon: <FaBriefcase /> },
    { title: 'Awards', route: '/awards', icon: <FaTrophy /> },
    { title: 'Certifications', route: '/certifications', icon: <FaCertificate /> },
    { title: 'Contact Me', route: '/contact-me', icon: <FaEnvelope /> },
  ],
  // collaborator — sizing up working together: proof, trust, easy contact.
  collaborator: [
    { title: 'Projects', route: '/projects', icon: <FaProjectDiagram /> },
    { title: 'Experience', route: '/work-experience', icon: <FaBriefcase /> },
    { title: 'Recommendations', route: '/recommendations', icon: <FaHandsHelping /> },
    { title: 'Contact Me', route: '/contact-me', icon: <FaEnvelope /> },
    { title: 'Skills', route: '/skills', icon: <FaCode /> },
  ],
  // explorer — here for the person: the fun stuff up front, work still here.
  explorer: [
    { title: 'Projects', route: '/projects', icon: <FaProjectDiagram /> },
    { title: 'Quotes', route: '/quotes', icon: <FaQuoteLeft /> },
    { title: 'Music', route: '/music', icon: <FaMusic /> },
    { title: 'Awards', route: '/awards', icon: <FaTrophy /> },
    { title: 'Skills', route: '/skills', icon: <FaCode /> },
  ],
};

export interface ContinueItem {
  title: string;
  link: string;
}

// Secondary row, per-persona. Holds exactly what that persona's topPicks
// doesn't lead with, so topPicks ∪ continueWatching == every section for
// every persona. Personas differ by ordering/emphasis, never by hiding.
export const continueWatchingConfig: Record<ProfileType, ContinueItem[]> = {
  recruiter: [
    { title: 'Quotes', link: '/quotes' },
    { title: 'Music', link: '/music' },
  ],
  engineer: [
    { title: 'Recommendations', link: '/recommendations' },
    { title: 'Quotes', link: '/quotes' },
    { title: 'Music', link: '/music' },
  ],
  collaborator: [
    { title: 'Awards', link: '/awards' },
    { title: 'Certifications', link: '/certifications' },
    { title: 'Quotes', link: '/quotes' },
    { title: 'Music', link: '/music' },
  ],
  explorer: [
    { title: 'Experience', link: '/work-experience' },
    { title: 'Recommendations', link: '/recommendations' },
    { title: 'Certifications', link: '/certifications' },
    { title: 'Contact Me', link: '/contact-me' },
  ],
};

// Starter prompts shown in JenAI (the ChatBot) when a persona opens a fresh
// conversation. Phrased as the visitor would ask them, and angled at what
// that persona's topPicksConfig already says they came here for.
export const chatSuggestedQuestions: Record<ProfileType, string[]> = {
  recruiter: [
    "What's Jenslee's work experience?",
    'What are his strongest technical skills?',
    'What do his past colleagues say?',
  ],
  engineer: [
    "What's Jenslee been building lately?",
    'What tech stack is Jenslee familiar with?',
    'What certifications does Jenslee hold?',
  ],
  collaborator: [
    "What's it like working with Jenslee?",
    'What projects has Jenslee shipped?',
    'How do I get in touch?',
  ],
  explorer: [
    "What's Jenslee working on for fun?",
    'What music is Jenslee into?',
    'Any interesting awards or quotes?',
  ],
};
