import React from 'react';
import './Awards.css';
import type { Award } from '../../types/types';

// Rendered at build time from DatoCMS data; ships no JS. Entrance
// animations are CSS (fadeInUp / scaleIn with a per-card --delay) rather
// than framer-motion, so the page needs no hydration.
const Awards: React.FC<{ awards: Award[] }> = ({ awards }) => {
    return (
        <div className="awards-container">
            <div className="awards-header">
                <h1>Awards & Recognition</h1>
                <p>Celebrating achievements and milestones throughout my journey</p>
            </div>

            <div className="awards-grid">
                {awards.map((award, index) => (
                    <div
                        key={index}
                        className="award-card"
                        style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
                    >
                        <div className="award-icon">{award.icon}</div>
                        <div className="award-content">
                            <h3>{award.title}</h3>
                            <p className="award-issuer">{award.issuer}</p>
                            <p className="award-date">{award.date}</p>
                            <p className="award-description">{award.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Awards;
