import React from 'react';
import './ContinueWatching.css';
import { continueWatchingConfig, type CardImage, type ProfileType } from '../persona/personaConfig';

interface ContinueWatchingProps {
  profile: ProfileType;
  images: Record<string, CardImage>;
}

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ profile, images }) => {
  const continueWatching = continueWatchingConfig[profile];

  return (
    <div className="continue-watching-row">
      <h2 className="row-title">Continue watching for {profile.charAt(0).toUpperCase() + profile.slice(1)}</h2>
      <div className="card-row">
        {continueWatching.map((pick, index) => (
          <a href={`/profile/${profile}${pick.link}`} key={index} className="pick-card">
            {/* Second row sits below the fold: don't compete with the hero. */}
            <img
              src={images[pick.title].src}
              width={images[pick.title].width}
              height={images[pick.title].height}
              alt={pick.title}
              className="pick-image"
              loading="lazy"
              decoding="async"
            />
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
