import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// react-ga4 throws "Require GA_MEASUREMENT_ID" if initialized with an empty
// id, so only initialize when the env var is actually configured. Without it
// analytics simply no-ops instead of crashing the app.
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_TRACKING_ID || "";
const analyticsEnabled = Boolean(GA_MEASUREMENT_ID);

if (analyticsEnabled) {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
        testMode: true,
        gtagOptions: {
            'consent': 'default',
            'ad_storage': 'denied',
            'analytics_storage': 'denied'
        }
    });
}

// Function to update consent. The choice is always persisted so the consent
// banner stays dismissed even when analytics isn't configured; only the GA
// call is skipped when disabled.
export const updateAnalyticsConsent = (hasConsent: boolean) => {
    localStorage.setItem('analyticsConsent', hasConsent ? 'true' : 'false');
    if (!analyticsEnabled) return;
    ReactGA.gtag('consent', 'update', {
        'analytics_storage': hasConsent ? 'granted' : 'denied'
    });
};

// Only track if consent is given
export const trackEvent = (category: string, action: string, label?: string) => {
    if (!analyticsEnabled) return;
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
