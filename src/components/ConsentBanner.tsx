import React, { useEffect, useState } from 'react';
import { updateAnalyticsConsent } from '../usePageTracking';
import './ConsentBanner.css';

const ConsentBanner: React.FC = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('analyticsConsent');
        if (consent === null) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        updateAnalyticsConsent(true);
        setShowBanner(false);
    };

    const handleDecline = () => {
        updateAnalyticsConsent(false);
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="consent-banner">
            <div className="consent-content">
                <p>
                    This website uses analytics cookies to help us understand how you use our site.
                    Your data will be anonymized and used only for improving user experience.
                </p>
                <div className="consent-buttons">
                    <button onClick={handleAccept} className="accept-button">
                        Accept
                    </button>
                    <button onClick={handleDecline} className="decline-button">
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsentBanner; 