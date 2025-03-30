import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopPicksRow.css';
import { FaCode, FaBriefcase, FaCertificate, FaHandsHelping, FaProjectDiagram, FaEnvelope, FaMusic, FaBook } from 'react-icons/fa';

type ProfileType = 'recruiter' | 'developer' | 'stalker' | 'adventurer';

interface TopPicksRowProps {
  profile: ProfileType;
}



const imageMap: { [key: string]: string } = {
  "Skills": "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Experience": "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Certifications": "https://plus.unsplash.com/premium_photo-1682075199505-e96c80e84e5a?q=80&w=1957&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Recommendations": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Contact Me": "https://images.unsplash.com/photo-1628891439478-c613e85af7d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Work Permit": "https://plus.unsplash.com/premium_photo-1663089819902-b4a7321f38e0?q=80&w=2110&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Projects": "https://plus.unsplash.com/premium_photo-1663050756824-165ee7eafdac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Music": "https://images.unsplash.com/photo-1462965326201-d02e4f455804?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Reading": "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};


const topPicksConfig = {
  recruiter: [
    // { title: "Work Permit", icon: <FaPassport />, route: "/work-permit" },
    { title: "Skills", icon: <FaCode />, route: "/skills" },
    { title: "Experience", icon: <FaBriefcase />, route: "/work-experience" },
    { title: "Certifications", icon: <FaCertificate />, route: "/certifications" },
    { title: "Recommendations", icon: <FaProjectDiagram />, route: "/projects" },
    { title: "Contact Me", icon: <FaEnvelope />, route: "/contact-me" }
  ],
  developer: [
    { title: "Skills", route: "/skills", icon: <FaCode /> },
    { title: "Projects", route: "/projects", icon: <FaProjectDiagram /> },
    { title: "Certifications", route: "/certifications", icon: <FaCertificate /> },
    { title: "Experience", route: "/work-experience", icon: <FaBriefcase /> },
    { title: "Recommendations", route: "/recommendations", icon: <FaHandsHelping /> },
    { title: "Contact Me", route: "/contact-me", icon: <FaEnvelope /> }
  ],
  stalker: [
    { title: "Recommendations", route: "/recommendations", icon: <FaHandsHelping /> },
    { title: "Contact Me", route: "/contact-me", icon: <FaEnvelope /> },
    { title: "Projects", route: "/projects", icon: <FaProjectDiagram /> },
    { title: "Experience", route: "/work-experience", icon: <FaBriefcase /> },
    { title: "Certifications", route: "/certifications", icon: <FaCertificate /> },
  ],
  adventurer: [
    { title: "Music", route: "/music", icon: <FaMusic /> },
    { title: "Projects", route: "/projects", icon: <FaProjectDiagram /> },
    { title: "Reading", route: "/reading", icon: <FaBook /> },
    { title: "Contact Me", route: "/contact-me", icon: <FaEnvelope /> },
    { title: "Certifications", route: "/certifications", icon: <FaCertificate /> }
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
