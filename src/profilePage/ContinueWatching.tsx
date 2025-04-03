import React from 'react';
import { Link } from 'react-router-dom';
import './ContinueWatching.css';
import Skills from 'images/sections/Skills.jpeg';
import Experience from 'images/sections/Experience.jpeg';
import Certifications from 'images/sections/Certifications.jpeg';
import Recommendations from 'images/sections/Recommendations.jpeg';
import ContactMe from 'images/sections/Contact Me.jpeg';
import WorkPermit from 'images/sections/Work Permit.jpeg';
import Projects from 'images/sections/Projects.jpeg';
import Music from 'images/sections/Music.jpeg';
import Reading from 'images/sections/Reading.jpeg';
import Quotes from 'images/sections/Quotes.jpeg';
import Awards from 'images/sections/Awards.jpeg';


type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'adventurer';
interface ContinueWatchingProps {
  profile: ProfileType;
}

const imageMap: { [key: string]: string } = {
  "Skills": Skills,
  "Experience": Experience,
  "Certifications": Certifications,
  "Recommendations": Recommendations,
  "Contact Me": ContactMe,
  "Work Permit": WorkPermit,
  "Projects": Projects,
  "Music": Music,
  "Reading": Reading,
  "Quotes": Quotes,
  "Awards": Awards
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
