import React from 'react';
import 'styles/MoreInfoButton.css';

// A link styled as a Netflix button: it always opens an external URL, so a
// real anchor works without JS. `track` becomes a data-track value for the
// delegated analytics listener.
interface MoreInfoButtonProps {
  href: string;
  label?: string;
  track?: string;
}

const MoreInfoButton: React.FC<MoreInfoButtonProps> = ({ href, track, label = "More Info" }) => {
  return (
    <a className="more-info-button" href={href} target="_blank" rel="noopener noreferrer" data-track={track}>
      <div className="icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          role="img"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
            fill="white"
          />
        </svg>
      </div>
      <div className="spacer"></div>
      <span className="label">{label}</span>
    </a>
  );
};

export default MoreInfoButton;
