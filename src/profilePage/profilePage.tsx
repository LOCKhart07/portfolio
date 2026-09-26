import React from 'react';
import { useParams } from 'react-router-dom';
import './ProfilePage.css';

import ProfileBanner from './ProfileBanner';
import TopPicksRow from './TopPicksRow';
import ContinueWatching from './ContinueWatching';
import { backgroundGif, coercePersona } from '../persona/personaConfig';
import { useDocumentHead } from '../hooks/useDocumentHead';

const ProfilePage: React.FC = () => {
  const { profileName } = useParams<{ profileName: string }>();
  // PersonaProvider (in Layout) already redirects invalid personas; coerce
  // here too so the page is safe on its own.
  const profile = coercePersona(profileName);

  useDocumentHead({
    title: 'Jenslee Dsouza | Software Developer focused on Backend, AI & Web3',
    description: 'Software developer focused on backend, AI, and Web3. I build scalable backend services, AI-powered applications, and decentralized Web3 systems, primarily with Python, Java, and Spring Boot.',
  });

  return (
    <>
      <div
        className="profile-page"
        style={{ backgroundImage: `url(${backgroundGif[profile]})` }}
      >
        <ProfileBanner />
      </div>
      <TopPicksRow profile={profile} />
      <ContinueWatching profile={profile} />
    </>
  );
};

export default ProfilePage;
