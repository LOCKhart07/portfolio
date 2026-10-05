import React from 'react';
import './ProfileBanner.css';
import PlayButton from '../components/common/PlayButton';
import MoreInfoButton from '../components/common/MoreInfoButton';
import type { ProfileBanner as ProfileBannerType } from '../types/types';

// Rendered at build time from DatoCMS data; ships no JS.
const ProfileBanner: React.FC<{ bannerData: ProfileBannerType }> = ({ bannerData }) => {
  return (
    <div className="profile-banner">
      <div className="banner-content">
        <h1 className="banner-headline" id='headline'>{bannerData.headline}</h1>
        <p className="banner-description">
          {bannerData.profileSummary}
        </p>

        <div className="banner-buttons">
          <PlayButton href={bannerData.resumeLink.url} label="Resume" track="Profile|Click Resume" />
          <MoreInfoButton href={bannerData.linkedinLink} label="Linkedin" track="Profile|Click LinkedIn" />
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
