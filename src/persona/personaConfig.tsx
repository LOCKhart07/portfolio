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
import Reading from 'images/sections/Reading.webp';
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
  Reading,
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

// Previously four identical [Quotes, Music] copies. Now genuinely per-persona
// and used to surface the previously-orphaned Reading route (its `/reading`
// page had no entry point from any persona).
export const continueWatchingConfig: Record<ProfileType, ContinueItem[]> = {
  recruiter: [
    { title: 'Reading', link: '/reading' },
    { title: 'Music', link: '/music' },
  ],
  developer: [
    { title: 'Reading', link: '/reading' },
    { title: 'Quotes', link: '/quotes' },
  ],
  stalker: [
    { title: 'Music', link: '/music' },
    { title: 'Reading', link: '/reading' },
  ],
  adventurer: [
    { title: 'Reading', link: '/reading' },
    { title: 'Recommendations', link: '/recommendations' },
  ],
};

export interface SectionMeta {
  // One-line persona-voiced intro rendered by <PersonaIntro> at the top of the
  // section's page.
  intro?: string;
  // Case-insensitive substrings; list items whose text matches any tag are
  // stably bubbled to the top (used by Projects + Skills).
  priorityTags?: string[];
}

export interface PersonaContent {
  label: string;
  sections: Record<string, SectionMeta>;
}

// Section keys are the unprefixed route paths (same as TopPick.route).
export const personaContent: Record<ProfileType, PersonaContent> = {
  recruiter: {
    label: 'Recruiter',
    sections: {
      '/work-experience': { intro: 'Career at a glance — scope, ownership, and the impact at each stop.' },
      '/skills': {
        intro: 'The stack I hire-ready in, grouped by where I add the most value.',
        priorityTags: ['Cloud', 'DevOps', 'Backend', 'Leadership'],
      },
      '/projects': {
        intro: 'Shipped work with measurable outcomes — production systems, not toy demos.',
        priorityTags: ['AWS', 'Kubernetes', 'CI/CD', 'GraphQL', 'Docker'],
      },
      '/recommendations': { intro: 'What managers and peers say about working with me.' },
      '/certifications': { intro: 'Validated credentials backing the experience above.' },
      '/awards': { intro: 'Recognition earned for delivery and impact.' },
      '/contact-me': { intro: "Open to the right role — here's the fastest way to reach me." },
      '/reading': { intro: 'A bit of the person behind the resume.' },
      '/music': { intro: 'Off the clock.' },
    },
  },
  developer: {
    label: 'Developer',
    sections: {
      '/projects': {
        intro: 'Builds I actually wrote — architecture, trade-offs, and the hard parts.',
        priorityTags: ['Python', 'React', 'LangChain', 'Solidity', 'Kubernetes', 'Node'],
      },
      '/skills': {
        intro: 'Languages and tools I reach for, and what I use each for.',
        priorityTags: ['Languages', 'Backend', 'Frontend', 'DevOps'],
      },
      '/work-experience': { intro: 'The systems I worked on and the role I played in shipping them.' },
      '/certifications': { intro: 'Credentials worth the exam — the rest is in the code.' },
      '/awards': { intro: 'Wins along the way.' },
      '/recommendations': { intro: 'Vouches from people I shipped with.' },
      '/contact-me': { intro: "Want to talk shop or collaborate? Ping me." },
      '/reading': { intro: 'What I read when I step away from the editor.' },
      '/quotes': { intro: 'Lines that stuck.' },
    },
  },
  stalker: {
    label: 'Stalker',
    sections: {
      '/projects': { intro: "You found the deep cut — everything I've built, no filter." },
      '/work-experience': { intro: 'The full timeline, every twist included.' },
      '/skills': { intro: 'Everything I tinker with, marketable or not.' },
      '/music': { intro: "What's actually on repeat — judge away." },
      '/reading': { intro: 'The books rewiring how I think right now.' },
      '/quotes': { intro: 'Words living rent-free in my head.' },
      '/certifications': { intro: 'Paper trail, if you must.' },
      '/awards': { intro: 'The trophy shelf.' },
      '/recommendations': { intro: 'People who know me, on the record.' },
      '/contact-me': { intro: "You've come this far — say hi." },
    },
  },
  adventurer: {
    label: 'Adventurer',
    sections: {
      '/projects': { intro: 'Side quests and experiments — built for the fun of it.' },
      '/quotes': { intro: 'Fuel for the next leap.' },
      '/music': { intro: 'The soundtrack to the journey.' },
      '/reading': { intro: 'Maps for where I am headed next.' },
      '/work-experience': { intro: 'The path so far — and it keeps moving.' },
      '/skills': { intro: 'Tools picked up exploring.' },
      '/awards': { intro: 'Souvenirs from the road.' },
      '/recommendations': { intro: 'Fellow travelers, on the record.' },
      '/contact-me': { intro: "Let's go somewhere — reach out." },
    },
  },
};

// Stable: items matching any priority tag keep their relative order and move
// ahead of non-matching items (which also keep theirs). Empty/absent tags =>
// original order untouched.
export function orderByPriority<T>(
  items: T[],
  getText: (item: T) => string,
  priorityTags?: string[],
): T[] {
  if (!priorityTags || priorityTags.length === 0) return items;
  const tags = priorityTags.map((t) => t.toLowerCase());
  const matches = (item: T) => {
    const text = getText(item).toLowerCase();
    return tags.some((t) => text.includes(t));
  };
  return items
    .map((item, index) => ({ item, index, hit: matches(item) }))
    .sort((a, b) => (a.hit === b.hit ? a.index - b.index : a.hit ? -1 : 1))
    .map((x) => x.item);
}
