import React from 'react';
import { usePersona } from './PersonaContext';
import './PersonaIntro.css';

interface PersonaIntroProps {
  /** Unprefixed section path, e.g. "/projects" — matches personaContent keys. */
  section: string;
}

/**
 * One-line, persona-voiced intro shown at the top of a content page. Renders
 * nothing when the current persona has no copy for the section, so pages can
 * drop it in unconditionally.
 */
const PersonaIntro: React.FC<PersonaIntroProps> = ({ section }) => {
  const { content } = usePersona();
  const intro = content.sections[section]?.intro;
  if (!intro) return null;
  return <p className="persona-intro">{intro}</p>;
};

export default PersonaIntro;
