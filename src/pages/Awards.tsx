import React, { useEffect, useState } from 'react';
import './Awards.css';
import { motion } from 'framer-motion';
import { Award } from '../types';
import { getAwards } from '../queries/getAwards';

const Awards: React.FC = () => {
    const [awards, setAwards] = useState<Award[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAwards = async () => {
            try {
                const data = await getAwards();
                setAwards(data);
            } catch (err) {
                setError('Failed to fetch awards');
                console.error('Error fetching awards:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAwards();
    }, []);

    if (loading) {
        return (
            <div className="awards-container">
                <div className="awards-header">
                    <h1>Loading Awards...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="awards-container">
                <div className="awards-header">
                    <h1>Error</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="awards-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="awards-header"
            >
                <h1>Awards & Recognition</h1>
                <p>Celebrating achievements and milestones throughout my journey</p>
            </motion.div>

            <div className="awards-grid">
                {awards.map((award, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="award-card"
                    >
                        <div className="award-icon">{award.icon}</div>
                        <div className="award-content">
                            <h3>{award.title}</h3>
                            <p className="award-issuer">{award.issuer}</p>
                            <p className="award-date">{award.date}</p>
                            <p className="award-description">{award.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Awards; 