import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopPicksRow.css';
import { FaCode, FaBriefcase, FaCertificate, FaHandsHelping, FaProjectDiagram, FaEnvelope, FaMusic, FaQuoteLeft, FaTrophy } from 'react-icons/fa';
import Skills from 'images/sections/Skills.webp';
import Experience from 'images/sections/Experience.webp';
import Certifications from 'images/sections/Certifications.webp';
import Recommendations from 'images/sections/Recommendations.webp';
import ContactMe from 'images/sections/Contact Me.webp';
import WorkPermit from 'images/sections/Work Permit.webp';
import Projects from 'images/sections/Projects.webp';
import Music from 'images/sections/Music.webp';
import Reading from 'images/sections/Reading.webp';
import Quotes from 'images/sections/Quotes.webp';
import Awards from 'images/sections/Awards.webp';


type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'adventurer';

interface TopPicksRowProps {
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

const topPicksConfig = {
  recruiter: [
    { title: "Experience", icon: <FaBriefcase />, route: "/work-experience" },
    { title: "Skills", icon: <FaCode />, route: "/skills" },
    { title: "Projects", icon: <FaProjectDiagram />, route: "/projects" },
    { title: "Recommendations", icon: <FaHandsHelping />, route: "/recommendations" },
    { title: "Certifications", icon: <FaCertificate />, route: "/certifications" },
    { title: "Awards", icon: <FaTrophy />, route: "/awards" },
    { title: "Contact Me", icon: <FaEnvelope />, route: "/contact-me" }
  ],
  developer: [
    { title: "Projects", route: "/projects", icon: <FaProjectDiagram /> },
    { title: "Skills", route: "/skills", icon: <FaCode /> },
    { title: "Experience", route: "/work-experience", icon: <FaBriefcase /> },
    { title: "Certifications", route: "/certifications", icon: <FaCertificate /> },
    { title: "Awards", route: "/awards", icon: <FaTrophy /> },
    { title: "Recommendations", route: "/recommendations", icon: <FaHandsHelping /> },
    { title: "Contact Me", route: "/contact-me", icon: <FaEnvelope /> }
  ],
  stalker: [
    { title: "Projects", route: "/projects", icon: <FaProjectDiagram /> },
    { title: "Experience", route: "/work-experience", icon: <FaBriefcase /> },
    { title: "Skills", route: "/skills", icon: <FaCode /> },
    { title: "Certifications", route: "/certifications", icon: <FaCertificate /> },
    { title: "Awards", route: "/awards", icon: <FaTrophy /> },
    { title: "Recommendations", route: "/recommendations", icon: <FaHandsHelping /> },
    { title: "Contact Me", route: "/contact-me", icon: <FaEnvelope /> }
  ],
  adventurer: [
    { title: "Projects", route: "/projects", icon: <FaProjectDiagram /> },
    { title: "Experience", route: "/work-experience", icon: <FaBriefcase /> },
    { title: "Skills", route: "/skills", icon: <FaCode /> },
    { title: "Awards", route: "/awards", icon: <FaTrophy /> },
    { title: "Quotes", route: "/quotes", icon: <FaQuoteLeft /> },
    { title: "Music", route: "/music", icon: <FaMusic /> },
    { title: "Contact Me", route: "/contact-me", icon: <FaEnvelope /> }
  ]
};

const TopPicksRow: React.FC<TopPicksRowProps> = ({ profile }) => {
  const navigate = useNavigate();
  const topPicks = topPicksConfig[profile];

  return (
    <div className="top-picks-row">
      <h2 className="row-title">Today's Top Picks for {profile.charAt(0).toUpperCase() + profile.slice(1)}</h2>
      <div className="card-row">
        {topPicks.map((pick, index) => (
          <div
            key={index}
            className="pick-card"
            onClick={() => navigate(pick.route)}
            style={{ animationDelay: `${index * 0.2}s` }} // Adding delay based on index
          >
            <img src={imageMap[pick.title]} alt={pick.title} className="pick-image" />
            <div className="overlay">
              <div className="pick-label">{pick.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPicksRow;
