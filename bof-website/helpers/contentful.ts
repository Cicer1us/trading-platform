import { createClient } from 'contentful';

const { API_ACCESS_SPACE_CONTENTFUL, API_ACCESS_TOKEN_CONTENTFUL } = process.env;

export const client = createClient({
  space: API_ACCESS_SPACE_CONTENTFUL || 'string',
  accessToken: API_ACCESS_TOKEN_CONTENTFUL || 'string',
});

export default client;
