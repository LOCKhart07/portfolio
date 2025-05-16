import React, { useEffect, useState } from 'react';
import './Recommendations.css';
import { getRecommendation } from '../queries/getRecommendation';
import { Recommendation } from '../types/types';

const Recommendations: React.FC = () => {


  const [recommendation, setRecommendation] = useState<Recommendation>();

  useEffect(() => {
    async function fetchRecommendation() {
      const data = await getRecommendation();
      setRecommendation(data);
    }

    fetchRecommendation();
  }, []);

  if (recommendation === null) return <div>Loading...</div>;
  return (
    <div className='timeline-container'>
      <div className="recommendation-card" onClick={() => window.open(recommendation?.link, '_blank')}>
        <div className="recommendation-header centered-header">
          <img src={recommendation?.profilePicture.url} alt={recommendation?.name} className="profile-pic" />
          <div className="header-text">
            <h3>{recommendation?.name}</h3>
            <p>{recommendation?.title}</p>
          </div>
        </div>
        <div className="recommendation-body">
          <p>{recommendation?.body}</p>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
