import React from 'react';
import './Recommendations.css';
import { FaQuoteLeft, FaLinkedin } from 'react-icons/fa';
import type { Recommendation } from '../../types/types';

// Dates render at build time; pin the time zone so the output doesn't depend
// on the build machine's.
const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

// Rendered at build time from DatoCMS data; ships no JS. A recommendation
// with a LinkedIn link is a real new-tab anchor (keyboard/a11y for free).
const Recommendations: React.FC<{ recommendations: Recommendation[] }> = ({ recommendations }) => {
  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h1>Recommendations</h1>
        <p>What colleagues and managers have said about working with me</p>
      </div>

      {recommendations.length === 0 ? (
        <p className="recommendations-status">No recommendations found</p>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((recommendation, index) => {
            const Card = recommendation.link ? 'a' : 'div';
            const linkProps = recommendation.link
              ? { href: recommendation.link, target: '_blank', rel: 'noopener noreferrer' }
              : {};
            return (
              <Card
                key={`${recommendation.name}-${recommendation.date}`}
                className="recommendation-card"
                style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
                {...linkProps}
              >
                <FaQuoteLeft className="quote-icon" aria-hidden="true" />
                <div className="recommendation-header">
                  <img src={recommendation.profilePicture.url} alt={recommendation.name} className="profile-pic" />
                  <div className="header-text">
                    <h3>{recommendation.name}</h3>
                    <p>{recommendation.title}</p>
                  </div>
                </div>
                <div className="recommendation-body">
                  <p>{recommendation.body}</p>
                </div>
                {recommendation.link && (
                  <div className="recommendation-footer">
                    {recommendation.date && (
                      <span className="recommendation-date">{formatDate(recommendation.date)}</span>
                    )}
                    <span className="recommendation-link-hint">
                      <FaLinkedin /> View on LinkedIn
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
