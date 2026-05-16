import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBriefcase, FaTools, FaProjectDiagram, FaEnvelope } from 'react-icons/fa'; // Import icons
import 'styles/Navbar.css';
import netflixLogo from 'images/logos/jenslee-netflix-logo.webp';
import { usePersona } from '../../persona/PersonaContext';
import { avatarMap } from '../../persona/personaConfig';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { persona } = usePersona();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Derived from the persona URL segment, so it stays correct on refresh /
  // deep-link (previously read from router state, which is lost on reload).
  const profileImage = avatarMap[persona];
  const base = `/profile/${persona}`;

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 80);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src={netflixLogo} alt="Netflix" />
          </Link>
          <ul className="navbar-links">
            <li><Link to="/browse">Home</Link></li>
            <li><Link to={`${base}/work-experience`}>Professional</Link></li>
            <li><Link to={`${base}/skills`}>Skills</Link></li>
            <li><Link to={`${base}/projects`}>Projects</Link></li>
            <li><Link to={`${base}/contact-me`}>Hire Me</Link></li>
          </ul>
        </div>
        <div className="navbar-right">
          {/* Hamburger menu for mobile */}
          <div className="hamburger" onClick={toggleSidebar}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <img src={profileImage} alt="Profile" className="profile-icon" onClick={() => { navigate('/browse') }} />
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

      {/* Sidebar (only visible on mobile) */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src={netflixLogo} alt="Netflix Logo" />
        </div>
        <ul>
          <li><Link to="/browse" onClick={closeSidebar}><FaHome /> Home</Link></li>
          <li><Link to={`${base}/work-experience`} onClick={closeSidebar}><FaBriefcase /> Professional</Link></li>
          <li><Link to={`${base}/skills`} onClick={closeSidebar}><FaTools /> Skills</Link></li>
          <li><Link to={`${base}/projects`} onClick={closeSidebar}><FaProjectDiagram /> Projects</Link></li>
          <li><Link to={`${base}/contact-me`} onClick={closeSidebar}><FaEnvelope /> Hire Me</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
