import React, { useEffect, useState } from 'react';
import './ContactMe.css';
import profilePic from '../images/jenslee.jpeg';
import { FaEnvelope, FaPhoneAlt, FaLinkedin } from 'react-icons/fa';
import { ContactMe as IContactMe } from '../types';
import { getContactMe } from '../queries/getContactMe';
import { trackEvent } from '../usePageTracking';

const ContactMe: React.FC = () => {

  const [userData, setUserData] = useState<IContactMe>()

  useEffect(() => {
    async function fetchUserData() {
      const data = await getContactMe();
      setUserData(data);
    }

    fetchUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  const handleContactClick = (type: string) => {
    trackEvent('Contact', `Click ${type}`);
  };

  return (
    <div className="contact-container">
      <div className="linkedin-badge-custom">
        <img src={profilePic} alt="Jenslee Dsouza" className="badge-avatar" />
        <div className="badge-content">
          <h3 className="badge-name">{userData?.name}</h3>
          <p className="badge-title">{userData.title}</p>
          <p className="badge-description">
            {userData.summary}
          </p>
          <p className="badge-company">{userData.companyUniversity}</p>
          <a
            href={userData.linkedinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="badge-link"
            onClick={() => handleContactClick('LinkedIn')}
          >
            <FaLinkedin className="linkedin-icon" /> View Profile
          </a>
        </div>
      </div>
      <div className="contact-header">
        <p>I'm always up for a chat! Feel free to reach out.</p>
      </div>
      <div className="contact-details">
        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <a
            href={`mailto:${userData.email}`}
            className="contact-link"
            onClick={() => handleContactClick('Email')}
          >
            {userData.email}
          </a>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="contact-icon" />
          <a
            href={`tel:${userData.phoneNumber}`}
            className="contact-link"
            onClick={() => handleContactClick('Phone')}
          >
            {userData.phoneNumber}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactMe;
