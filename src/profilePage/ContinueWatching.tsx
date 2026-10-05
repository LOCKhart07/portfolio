import React from 'react';
import './ContinueWatching.css';
import { imageMap, continueWatchingConfig, type ProfileType } from '../persona/personaConfig';

interface ContinueWatchingProps {
  profile: ProfileType;
}

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ profile }) => {
  const continueWatching = continueWatchingConfig[profile];

  return (
    <div className="continue-watching-row">
      <h2 className="row-title">Continue watching for {profile.charAt(0).toUpperCase() + profile.slice(1)}</h2>
      <div className="card-row">
        {continueWatching.map((pick, index) => (
          <a href={`/profile/${profile}${pick.link}`} key={index} className="pick-card">
            <img src={imageMap[pick.title]} alt={pick.title} className="pick-image" />
            <div className="overlay">
              <div className="pick-label">{pick.title}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
