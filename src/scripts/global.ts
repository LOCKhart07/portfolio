// Bundled once per visit by BaseLayout. Under the ClientRouter module
// scripts don't re-run on navigation, so per-page work hangs off
// `astro:page-load`, which fires on the first load and after every swap.
import { handleTrackClick, startAnalytics, trackPageview } from '../lib/analytics';
import { registerWebMcpTools } from '../webmcp';

void startAnalytics();
document.addEventListener('astro:page-load', () => trackPageview(location.pathname));
document.addEventListener('click', handleTrackClick);

// Expose the site's WebMCP tools to in-browser agents. No-op in browsers
// without navigator.modelContext.
registerWebMcpTools();
