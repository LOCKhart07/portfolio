import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// Initialize with analytics disabled by default
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID || "", {
    testMode: true,
    gtagOptions: {
        'consent': 'default',
        'ad_storage': 'denied',
        'analytics_storage': 'denied'
    }
});

// Function to update consent
export const updateAnalyticsConsent = (hasConsent: boolean) => {
    ReactGA.gtag('consent', 'update', {
        'analytics_storage': hasConsent ? 'granted' : 'denied'
    });
    localStorage.setItem('analyticsConsent', hasConsent ? 'true' : 'false');
};

// Only track if consent is given
export const trackEvent = (category: string, action: string, label?: string) => {
    const hasConsent = localStorage.getItem('analyticsConsent') === 'true';
    if (hasConsent) {
        ReactGA.event({
            category,
            action,
            label
        });
    }
};

const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        const hasConsent = localStorage.getItem('analyticsConsent') === 'true';
        if (hasConsent) {
            ReactGA.send({ hitType: "pageview", page: location.pathname });
        }
    }, [location]);
};

export default usePageTracking;
