import ReactGA from 'react-ga4';

// Google Analytics 4, browser-only. There is no consent gate: GA starts on
// every visit, but `startAnalytics` defers it to an idle callback so gtag.js
// never competes with the first paint. When REACT_APP_GA_TRACKING_ID is
// unset (local dev, previews without the var) everything here no-ops —
// react-ga4 throws "Require GA_MEASUREMENT_ID" on an empty id.
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_TRACKING_ID || '';
export const analyticsEnabled = Boolean(GA_MEASUREMENT_ID);

let ready: Promise<void> | null = null;

/** Initialize GA once the browser is idle. Safe to call repeatedly. */
export const startAnalytics = (): Promise<void> => {
  if (!analyticsEnabled) return Promise.resolve();
  ready ??= new Promise((resolve) => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    idle(() => {
      // send_page_view: false — pageviews are sent explicitly by
      // trackPageview so there is a single source and no double counting.
      ReactGA.initialize(GA_MEASUREMENT_ID, { gtagOptions: { send_page_view: false } });
      resolve();
    });
  });
  return ready;
};

export const trackPageview = (page: string): void => {
  if (!analyticsEnabled) return;
  void startAnalytics().then(() => ReactGA.send({ hitType: 'pageview', page }));
};

export const trackEvent = (category: string, action: string, label?: string): void => {
  if (!analyticsEnabled) return;
  void startAnalytics().then(() => ReactGA.event({ category, action, label }));
};

/**
 * Static pages carry no click handlers; trackable elements declare
 * `data-track="Category|Action|Label"` (label optional) instead, and one
 * delegated listener reports them. Returns null for a malformed value.
 */
export const parseTrackAttribute = (
  value: string | null | undefined,
): { category: string; action: string; label?: string } | null => {
  if (!value) return null;
  const [category, action, ...rest] = value.split('|');
  if (!category || !action) return null;
  const label = rest.join('|');
  return label ? { category, action, label } : { category, action };
};

/** Delegated click handler: reports the nearest `[data-track]` ancestor. */
export const handleTrackClick = (event: Event): void => {
  const target = event.target as Element | null;
  const el = target?.closest?.('[data-track]');
  const parsed = parseTrackAttribute(el?.getAttribute('data-track'));
  if (parsed) trackEvent(parsed.category, parsed.action, parsed.label);
};
