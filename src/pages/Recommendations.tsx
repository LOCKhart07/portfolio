import React, { useEffect, useState } from 'react';
import './Recommendations.css';
import { FaQuoteLeft, FaLinkedin } from 'react-icons/fa';
import { getRecommendations } from '../queries/getRecommendations';
import { Recommendation } from '../types/types';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const data = await getRecommendations();
        setRecommendations(data);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  const openRecommendation = (link: string) => {
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h1>Recommendations</h1>
        <p>What colleagues and managers have said about working with me</p>
      </div>

      {loading && <p className="recommendations-status">Loading recommendations...</p>}
      {!loading && error && <p className="recommendations-status">{error}</p>}
      {!loading && !error && recommendations.length === 0 && (
        <p className="recommendations-status">No recommendations found</p>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <div className="recommendations-grid">
          {recommendations.map((recommendation, index) => (
            <div
              key={`${recommendation.name}-${recommendation.date}`}
              className="recommendation-card"
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              role={recommendation.link ? 'button' : undefined}
              tabIndex={recommendation.link ? 0 : undefined}
              onClick={() => openRecommendation(recommendation.link)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openRecommendation(recommendation.link);
                }
              }}
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
                  {recommendation.date && <span className="recommendation-date">{recommendation.date}</span>}
                  <span className="recommendation-link-hint">
                    <FaLinkedin /> View on LinkedIn
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
