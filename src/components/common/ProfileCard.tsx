import React from 'react';
import '../../styles/ProfileCard.css';

interface ProfileCardProps {
  name: string;
  image: string;
  href: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, image, href }) => {
  return (
    <a className="profile-card" href={href}>
      <div className="image-container">
        <img src={image} alt={`${name} profile`} className="profile-image" />
      </div>
      <h3 className="profile-name">{name}</h3>
    </a>
  );
};

export default ProfileCard;
