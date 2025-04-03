import React from 'react';
import { Link } from 'react-router-dom';
import './ContinueWatching.css';


type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'adventurer';
interface ContinueWatchingProps {
  profile: ProfileType;
}

const imageMap: { [key: string]: string } = {
  "Skills": "/images/sections/Skills.jpeg",
  "Experience": "/images/sections/Experience.jpeg",
  "Certifications": "/images/sections/Certifications.jpeg",
  "Recommendations": "/images/sections/Recommendations.jpeg",
  "Contact Me": "/images/sections/Contact Me.jpeg",
  "Work Permit": "/images/sections/Work Permit.jpeg",
  "Projects": "/images/sections/Projects.jpeg",
  "Music": "/images/sections/Music.jpeg",
  "Reading": "/images/sections/Reading.jpeg",
  "Quotes": "/images/sections/Quotes.jpeg",
  "Awards": "/images/sections/Awards.jpeg",
};

const continueWatchingConfig = {
  recruiter: [
    { title: "Quotes", link: "/quotes" },
    { title: "Music", link: "/music" },
  ],
  developer: [
    { title: "Quotes", link: "/quotes" },
    { title: "Music", link: "/music" },
  ],
  stalker: [
    { title: "Quotes", link: "/quotes" },
    { title: "Music", link: "/music" },
  ],
  adventurer: [
    { title: "Quotes", link: "/quotes" },
    { title: "Music", link: "/music" },
  ]
};

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ profile }) => {
  const continueWatching = continueWatchingConfig[profile];

  return (
    <div className="continue-watching-row">
      <h2 className="row-title">Continue watching for {profile.charAt(0).toUpperCase() + profile.slice(1)}</h2>
      <div className="card-row">
        {continueWatching.map((pick, index) => (
          <Link to={pick.link} key={index} className="pick-card">
            <img src={imageMap[pick.title]} alt={pick.title} className="pick-image" />
            <div className="overlay">
              <div className="pick-label">{pick.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
