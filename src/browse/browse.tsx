import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/common/ProfileCard';
import blueImage from '../images/profiles/blue.webp';
import greyImage from '../images/profiles/grey.webp';
import redImage from '../images/profiles/red.webp';
import yellowImage from '../images/profiles/yellow.webp';
import './browse.css';

const Browse: React.FC = () => {
  const navigate = useNavigate();

  // Avatars are the profile-picker art only. The per-persona background GIF and
  // navbar avatar now live in personaConfig and are derived from the URL, so
  // nothing needs to be threaded through router state.
  const profiles = [
    { name: "recruiter", image: blueImage },
    { name: "developer", image: greyImage },
    { name: "stalker", image: redImage },
    { name: "adventurer", image: yellowImage },
  ];

  const handleProfileClick = (profile: { name: string; image: string }) => {
    navigate(`/profile/${profile.name}`);
  };

  return (
    <div className="browse-container">
      <p className='who-is-watching'>Who's Watching?</p>
      <div className="profiles">
        {profiles.map((profile, index) => (
          <ProfileCard
            key={index}
            name={profile.name}
            image={profile.image}
            onClick={() => handleProfileClick(profile)}
          />
        ))}
      </div>
    </div>
  );
};

export default Browse;
