import React, { useEffect, useState } from 'react';
import './NetflixTitle.css';
import netflixSound from './netflix-sound.mp3';
import { useNavigate } from 'react-router-dom';
import logoImage from './images/logos/logo-2.png';

const NetflixTitle = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Play sound and start animation automatically
    const audio = new Audio(netflixSound);
    audio.play().catch(error => console.error("Audio play error:", error));
    setIsAnimating(true);
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        navigate('/browse');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, navigate]);

  return (
    <div className="netflix-container">
      <img
        src={logoImage}
        alt="Custom Logo"
        className={`netflix-logo ${isAnimating ? 'animate' : ''}`}
      />
    </div>
  );
};

export default NetflixTitle;
