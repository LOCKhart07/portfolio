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

export type ProfileType = 'recruiter' | 'engineer' | 'collaborator' | 'explorer';

export const PERSONAS: ProfileType[] = ['recruiter', 'engineer', 'collaborator', 'explorer'];

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
  engineer: greyImage,
  collaborator: redImage,
  explorer: yellowImage,
};

// Navbar contact CTA label. The link always routes to /contact-me; only the
// wording changes so each persona gets a call-to-action in its own register.
export const contactCtaLabel: Record<ProfileType, string> = {
  recruiter: 'Hire Me',
  engineer: "Let's Build",
  collaborator: 'Work With Me',
  explorer: 'Say Hi',
};

// Profile-page background. Was previously passed via router state from
// browse.tsx and broke on refresh / shared links; now deep-link safe.
// Giphy serves an animated WebP for every GIF at the same media path — just
// swap the `giphy.gif` filename for `giphy.webp`. WebP animates as a CSS
// background-image with no autoplay policy (unlike <video>), at ~75-80% the
// weight: recruiter 10.8MB→2.4MB, explorer 3.4MB→0.6MB, collaborator
// 1.3MB→0.34MB. Each .webp below was verified to contain ANIM/ANMF chunks.
export const backgroundGif: Record<ProfileType, string> = {
  // Dwight (The Office) holding up his three résumés.
  recruiter:
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTZ5eWwwbjRpdWM1amxyd3VueHhteTVzajVjeGZtZGJ1dDc4MXMyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/16u7Ifl2T4zYfQ932F/giphy.webp',
  // Pixel-art hooded ape coding at a desk in headphones. Kept as .gif: this
  // clip is already only ~33KB (480x270, 6 frames) and Giphy returns a 0-byte
  // body for its .webp rendition — do NOT "optimize" this to .webp.
  engineer:
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnNsdDE2YXYxZnU5MzJ3bjIxYzRiOW5rbHYydWVzMzN1cXl2NTU5MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8fQ1oiRxx9stbdECAo/giphy.gif',
  // Captain Planet — "by your powers combined".
  collaborator:
    'https://media.giphy.com/media/0Av9l0VIc01y1isrDw/giphy.webp',
  // Snowboarder carving down a mountain (National Geographic).
  explorer:
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmxib24ycWo2cjlmazh0NGV5NTZ2Mzd2YWY0M2tvam9oYXBwYW1ocCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ERKMnDK6tkzJe8YVa3/giphy.webp',
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

// Persona keys that shipped in shared links / bookmarks before the
// recruiter|engineer|collaborator|explorer rename. PersonaProvider redirects
// these to the new key (preserving the rest of the path) so old external
// links don't 404 into the recruiter fallback.
export const LEGACY_PERSONA_ALIASES: Record<string, ProfileType> = {
  developer: 'engineer',
  stalker: 'collaborator',
  adventurer: 'explorer',
};
