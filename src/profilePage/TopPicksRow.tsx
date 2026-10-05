import React from 'react';
import './TopPicksRow.css';
import { imageMap, topPicksConfig, type ProfileType } from '../persona/personaConfig';

interface TopPicksRowProps {
  profile: ProfileType;
}

const TopPicksRow: React.FC<TopPicksRowProps> = ({ profile }) => {
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

export default TopPicksRow;
