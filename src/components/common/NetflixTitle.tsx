import React, { useEffect, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import { prefetch } from 'astro:prefetch';
import 'styles/NetflixTitle.css';
import netflixSound from 'sounds/netflix-sound.mp3';
import logoImage from 'images/logos/jenslee-netflix-logo.webp';

const SPLASH_MS = 4000;

// First-visit intro (returning visitors are redirected past it by an inline
// script in pages/index.astro before this ever renders). Plays the sound and
// zoom animation, then moves on to the profile picker after SPLASH_MS — or
// immediately on any click / key press.
const NetflixTitle = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const leaving = useRef(false);

  useEffect(() => {
    const audio = new Audio(netflixSound);
    audio.play().catch(error => console.error("Audio play error:", error));
    setIsAnimating(true);
    // Warm /browse while the splash plays so the hand-off is instant.
    prefetch('/browse', { ignoreSlowConnection: true });

    const goToBrowse = () => {
      if (leaving.current) return;
      leaving.current = true;
      audio.pause();
      void navigate('/browse', { history: 'replace' });
    };

    const timer = window.setTimeout(goToBrowse, SPLASH_MS);
    window.addEventListener('pointerdown', goToBrowse);
    window.addEventListener('keydown', goToBrowse);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', goToBrowse);
      window.removeEventListener('keydown', goToBrowse);
    };
  }, []);

  return (
    <div className="netflix-container">
      <img
        src={logoImage.src}
        alt="Custom Logo"
        className={`netflix-logo ${isAnimating ? 'animate' : ''}`}
      />
    </div>
  );
};

export default NetflixTitle;
