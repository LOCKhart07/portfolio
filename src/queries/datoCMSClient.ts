import { GraphQLClient } from 'graphql-request';
import { getDatoCmsToken } from './getDatoCmsToken';

// Build-time only: page frontmatter runs these queries while prerendering, so
// the token never reaches a browser bundle. Do not import from an island.
const DATO_CMS_ENDPOINT = 'https://graphql.datocms.com/';
const DATO_CMS_API_TOKEN = getDatoCmsToken();

const client = new GraphQLClient(DATO_CMS_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${DATO_CMS_API_TOKEN}`,
  },
});

// Every persona prerenders the same sections, so one build would repeat each
// query four times. Queries take no variables, so the query string is the
// whole cache key; the cache lives for one build process.
const cache = new Map<string, Promise<unknown>>();

const datoCMSClient = {
  request<T>(query: string): Promise<T> {
    if (!cache.has(query)) cache.set(query, client.request<T>(query));
    return cache.get(query) as Promise<T>;
  },
};

export default datoCMSClient;
