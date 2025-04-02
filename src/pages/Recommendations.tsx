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
      <div className="recommendation-card">
        <div className="recommendation-header">
          <img src={recommendation?.profilePicture.url} alt={recommendation?.name} className="profile-pic" />
          <div>
            <h3>{recommendation?.name}</h3>
            <p>{recommendation?.title}</p>
            <p className="date">October 24, 2024</p>
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
