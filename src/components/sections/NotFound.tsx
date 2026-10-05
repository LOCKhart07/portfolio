import React from 'react';
import './NotFound.css';

const NotFound: React.FC = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Oops! Page Not Found</h2>
                <p>Looks like you've wandered into uncharted territory. Let's get you back to exploring my portfolio.</p>
                <div className="not-found-actions">
                    <a href="/" className="not-found-button">
                        Back to Portfolio
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 