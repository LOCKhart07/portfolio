import React from 'react';
import { useParams } from 'react-router-dom';
import './ProfilePage.css';

import ProfileBanner from './ProfileBanner';
import TopPicksRow from './TopPicksRow';
import ContinueWatching from './ContinueWatching';
import { backgroundGif, coercePersona } from '../persona/personaConfig';

const ProfilePage: React.FC = () => {
  const { profileName } = useParams<{ profileName: string }>();
  // PersonaProvider (in Layout) already redirects invalid personas; coerce
  // here too so the page is safe on its own.
  const profile = coercePersona(profileName);

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
