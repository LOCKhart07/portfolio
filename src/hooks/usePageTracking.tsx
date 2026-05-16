import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// react-ga4 throws "Require GA_MEASUREMENT_ID" if initialized with an empty
// id, so only initialize when the env var is actually configured. Without it
// analytics simply no-ops instead of crashing the app.
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_TRACKING_ID || "";
const analyticsEnabled = Boolean(GA_MEASUREMENT_ID);

const hasConsent = () => localStorage.getItem("analyticsConsent") === "true";

// GA is not initialized until the visitor actively grants consent. Until then
// no gtag.js script is loaded and nothing is sent to Google — the consent
// banner is a real gate, not a formality. (The previous code passed
// consent/ad_storage/analytics_storage as gtag *config* params, which is not
// how Consent Mode works: the "denied" default was never applied and
// ReactGA.initialize fired a page_view on load, before the banner was even
// answered. Deferring init removes that leak entirely.)
let initialized = false;
const initGA = () => {
    if (initialized || !analyticsEnabled) return;
    // send_page_view: false — we emit pageviews explicitly via ReactGA.send so
    // there is a single source of truth and no double counting.
    ReactGA.initialize(GA_MEASUREMENT_ID, {
        gtagOptions: { send_page_view: false },
    });
    initialized = true;
};

// Returning visitor who consented in a previous session: bring GA up on load
// so usePageTracking's first effect can record their pageview.
if (analyticsEnabled && hasConsent()) {
    initGA();
}

// The choice is always persisted so the banner stays dismissed even when
// analytics isn't configured or the visitor declined; GA is only started on an
// affirmative grant.
export const updateAnalyticsConsent = (consentGranted: boolean) => {
    localStorage.setItem("analyticsConsent", consentGranted ? "true" : "false");
    if (!analyticsEnabled || !consentGranted) return;
    // First-time grant: start GA now and count the page they're on. The
    // route-keyed effect below won't re-fire without a navigation, so the
    // landing page of every first-time visit would otherwise never be counted.
    initGA();
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

// Only track if GA is up (which implies consent was granted).
export const trackEvent = (category: string, action: string, label?: string) => {
    if (!analyticsEnabled || !hasConsent()) return;
    ReactGA.event({ category, action, label });
};

const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        if (!analyticsEnabled || !hasConsent()) return;
        ReactGA.send({ hitType: "pageview", page: location.pathname });
    }, [location]);
};

export default usePageTracking;
