// A stable, shareable resume link — https://portfolio.lockhart.in/resume —
// that always points at whatever PDF is currently set in DatoCMS, instead
// of a raw datocms-assets.com URL that changes if the asset is replaced.
//
// Runs before the SPA rewrite (like markdown.ts), so it intercepts /resume
// directly with a 302 rather than booting React first.

import type { Context } from 'https://edge.netlify.com';

const DATO_CMS_ENDPOINT = 'https://graphql.datocms.com/';

const GET_RESUME_LINK = `
{
  profilebanner {
    resumeLink {
      url
    }
  }
}
`;

export default async (request: Request, context: Context): Promise<Response> => {
  const token = Deno.env.get('REACT_APP_DATOCMSTOKEN_DEFAULT') ?? '';

  try {
    const response = await fetch(DATO_CMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: GET_RESUME_LINK }),
    });

    if (!response.ok) {
      throw new Error(`DatoCMS responded ${response.status}`);
    }

    const { data, errors } = await response.json();
    const resumeUrl: string | undefined = data?.profilebanner?.resumeLink?.url;

    if (errors || !resumeUrl) {
      throw new Error('resumeLink missing from DatoCMS response');
    }

    return new Response(null, {
      status: 302,
      headers: {
        location: resumeUrl,
        'cache-control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error(`resume edge function failed: ${error}`);
    // Fall through to the normal SPA so a DatoCMS hiccup doesn't 500 —
    // visitor lands on the 404 page instead of a broken redirect.
    return context.next();
  }
};
