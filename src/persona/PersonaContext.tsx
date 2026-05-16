import React, { createContext, useContext, useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import {
  ProfileType,
  coercePersona,
  isPersona,
  personaContent,
  PersonaContent,
} from './personaConfig';

interface PersonaValue {
  persona: ProfileType;
  content: PersonaContent;
}

const PersonaContext = createContext<PersonaValue | null>(null);

export const LAST_PERSONA_KEY = 'lastPersona';

/**
 * Reads the persona from the `:profileName` route param (URL is the source of
 * truth). An invalid persona segment redirects to the recruiter equivalent so
 * the URL never lies, instead of silently rendering a fallback. The active
 * persona is cached to localStorage purely so legacy flat paths can redirect
 * back to the visitor's last persona.
 *
 * Rendered inside Layout, so the navbar and every content page can call
 * usePersona().
 */
export const PersonaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profileName } = useParams<{ profileName?: string }>();
  const location = useLocation();
  const persona = coercePersona(profileName);

  useEffect(() => {
    try {
      localStorage.setItem(LAST_PERSONA_KEY, persona);
    } catch {
      /* private mode / storage disabled — non-fatal */
    }
  }, [persona]);

  // Param present but not a real persona (e.g. /profile/foobar/projects).
  if (profileName !== undefined && !isPersona(profileName)) {
    const fixed =
      location.pathname.replace(`/profile/${profileName}`, '/profile/recruiter') +
      location.search;
    return <Navigate to={fixed} replace />;
  }

  return (
    <PersonaContext.Provider value={{ persona, content: personaContent[persona] }}>
      {children}
    </PersonaContext.Provider>
  );
};

/**
 * Active persona + its content config. Falls back to recruiter when called
 * outside a provider (e.g. the global ChatBot) so it never throws.
 */
export const usePersona = (): PersonaValue =>
  useContext(PersonaContext) ?? {
    persona: 'recruiter',
    content: personaContent.recruiter,
  };
