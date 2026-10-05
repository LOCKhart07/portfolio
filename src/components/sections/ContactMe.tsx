import React from 'react';
import './ContactMe.css';
import profilePic from '../../images/profile-pictures/jenslee.jpeg';
import { FaEnvelope, FaPhoneAlt, FaLinkedin } from 'react-icons/fa';
import type { ContactMe as IContactMe } from '../../types/types';

// Rendered at build time from DatoCMS data; ships no JS. Clicks are
// reported by the delegated data-track listener.
const ContactMe: React.FC<{ userData: IContactMe }> = ({ userData }) => {

  return (
    <div className="contact-container">
      <div className="linkedin-badge-custom">
        <img src={profilePic.src} alt="Jenslee Dsouza" className="badge-avatar" />
        <div className="badge-content">
          <h3 className="badge-name">{userData.name}</h3>
          <p className="badge-title">{userData.title}</p>
          <p className="badge-description">
            {userData.summary}
          </p>
          <p className="badge-company">{userData.companyUniversity}</p>
          <div className="contact-block">
            <div className="contact-details">
            <a
              href={`mailto:${userData.email}`}
              className="contact-item"
              data-track="Contact|Click Email"
            >
              <FaEnvelope className="contact-icon" />
              <span className="contact-link">{userData.email}</span>
            </a>
            <a
              href={`tel:${userData.phoneNumber}`}
              className="contact-item"
              data-track="Contact|Click Phone"
            >
              <FaPhoneAlt className="contact-icon" />
              <span className="contact-link">{userData.phoneNumber}</span>
            </a>
            </div>
            <a
              href={userData.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="badge-link"
              data-track="Contact|Click LinkedIn"
            >
              <FaLinkedin className="linkedin-icon" /> View Profile
            </a>
          </div>
        </div>
      </div>
      <div className="contact-header">
        <p>I'm always up for a chat! Feel free to reach out.</p>
      </div>
    </div>
  );
};

export default ContactMe;
