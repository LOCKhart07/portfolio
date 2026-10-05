// Single source of truth for the public profile shown to search engines and
// agents. Read by BaseLayout (HTML <head> + JSON-LD) and by the markdown edge
// function (netlify/edge-functions/markdown.ts), which used to keep a
// hand-copied duplicate that drifted (it still said LTIMindtree after the move
// to Valory). Keep this file dependency-free and alias-free: Netlify's Deno
// bundler imports it directly.

export const SITE_URL = 'https://portfolio.lockhart.in';

export const PROFILE = {
  name: 'Jenslee Dsouza',
  siteTitle: 'Jenslee Dsouza | Backend, AI & Web3 Developer',
  jobTitle: 'Software Developer focused on Backend, AI & Web3',
  description:
    'Software developer focused on Backend, AI & Web3 — building autonomous on-chain agents at Valory with Python, Java & Spring Boot, LLM/RAG and Web3 integration.',
  keywords: [
    'Software Developer', 'Backend Developer', 'AI Developer', 'Web3 Developer',
    'Blockchain Developer', 'Autonomous Agents', 'On-chain Agents', 'Olas', 'Valory',
    'Prediction Markets', 'Artificial Intelligence', 'LLM', 'RAG', 'Generative AI',
    'Python', 'FastAPI', 'Django', 'Flask', 'Java', 'Spring Boot', 'Docker', 'Kubernetes',
    'Jenslee', 'Jenslee Dsouza', 'Jenslee Developer', 'Jenslee Backend Developer',
    'Jenslee AI Developer', 'Jenslee Web3 Developer', 'Jenslee India', 'Software Engineer',
  ],
  sameAs: ['https://github.com/LOCKhart07', 'https://www.linkedin.com/in/jensleedsouza/'],
  knowsAbout: [
    'Backend Development', 'Artificial Intelligence', 'Web3', 'Blockchain',
    'Autonomous Agents', 'Prediction Markets', 'Python', 'Flask', 'FastAPI',
    'Django', 'Java', 'Spring Boot', 'LLM', 'RAG', 'Generative AI', 'Docker',
    'Kubernetes',
  ],
  worksFor: { name: 'Valory', url: 'https://www.valory.xyz/' },
};

/** schema.org Person JSON-LD, identical in the HTML and the markdown view. */
export const personJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: PROFILE.name,
  url: `${SITE_URL}/`,
  jobTitle: PROFILE.jobTitle,
  sameAs: PROFILE.sameAs,
  knowsAbout: PROFILE.knowsAbout,
  worksFor: { '@type': 'Organization', ...PROFILE.worksFor },
});
