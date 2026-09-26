import { useEffect } from 'react';

interface DocumentHeadOptions {
  title: string;
  description: string;
}

const setMetaByName = (name: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setMetaByProperty = (property: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

// index.html ships site-wide defaults (homepage title/description/canonical/
// OG tags). Every routed page calls this on mount to override them, so each
// URL gets its own title/description/canonical instead of Google seeing the
// same three signals on every section — which reads as duplicate content and
// suppresses all but the homepage from the index.
export function useDocumentHead({ title, description }: DocumentHeadOptions) {
  useEffect(() => {
    document.title = title;
    setMetaByName('description', description);
    setMetaByProperty('og:title', title);
    setMetaByProperty('og:description', description);
    setMetaByProperty('twitter:title', title);
    setMetaByProperty('twitter:description', description);
    // Build-time prerendering (scripts/prerender.mjs) captures this snapshot
    // from a local preview server, not the production origin — using
    // `window.location.origin` there would bake `localhost` into the
    // canonical tag that ships to production. `PUBLIC_URL` is the site's
    // real absolute origin in every environment (see `homepage` in
    // package.json / `basePlugin` in vite.config.ts), including for real
    // visitors, so it's the correct source here regardless of where this
    // runs.
    setCanonical(`${process.env.PUBLIC_URL}${window.location.pathname}`);
  }, [title, description]);
}
