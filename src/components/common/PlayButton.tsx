import React from 'react';
import '../../styles/PlayButton.css';

// A link styled as a Netflix button: it always opens an external URL, so a
// real anchor works without JS. `track` becomes a data-track value for the
// delegated analytics listener.
interface PlayButtonProps {
  href: string;
  label?: string;
  track?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ href, track, label = "Play" }) => {
  return (
    <a className="play-button" href={href} target="_blank" rel="noopener noreferrer" data-track={track}>
      <div className="icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="black"
          role="img"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
        >
          <path
            d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
            fill="black"
          />
        </svg>
      </div>
      <div className="spacer"></div>
      <span className="label">{label}</span>
    </a>
  );
};

export default PlayButton;
