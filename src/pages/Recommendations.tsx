import React, { useEffect, useState } from 'react';
import './Recommendations.css';
import { getRecommendations } from '../queries/getRecommendations';
import { Recommendation } from '../types/types';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const data = await getRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (recommendations.length === 0) return <div>No recommendations found</div>;

  return (
    <div className='timeline-container'>
      {recommendations.map((recommendation) => (
        <div key={`${recommendation.name}-${recommendation.date}`} className="recommendation-card" onClick={() => window.open(recommendation.link, '_blank')}>
          <div className="recommendation-header centered-header">
            <img src={recommendation.profilePicture.url} alt={recommendation.name} className="profile-pic" />
            <div className="header-text">
              <h3>{recommendation.name}</h3>
              <p>{recommendation.title}</p>
            </div>
          </div>
          <div className="recommendation-body">
            <p>{recommendation.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
