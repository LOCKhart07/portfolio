import React from 'react';
import './TopPicksRow.css';
import { topPicksConfig, CARD_IMAGE_SIZES, type CardImage, type ProfileType } from '../persona/personaConfig';

interface TopPicksRowProps {
  profile: ProfileType;
  images: Record<string, CardImage>;
}

const TopPicksRow: React.FC<TopPicksRowProps> = ({ profile, images }) => {
  const topPicks = topPicksConfig[profile];

  return (
    <div className="top-picks-row">
      <h2 className="row-title">Today's Top Picks for {profile.charAt(0).toUpperCase() + profile.slice(1)}</h2>
      <div className="card-row">
        {topPicks.map((pick, index) => (
          <a
            key={index}
            className="pick-card"
            href={`/profile/${profile}${pick.route}`}
            style={{ animationDelay: `${index * 0.2}s` }} // Adding delay based on index
          >
            <img
              src={images[pick.title].src}
              srcSet={images[pick.title].srcSet}
              sizes={CARD_IMAGE_SIZES}
              width={images[pick.title].width}
              height={images[pick.title].height}
              alt={pick.title}
              className="pick-image"
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

export default TopPicksRow;
