import { createClient } from 'contentful';

const { NEXT_PUBLIC_CONTENTFUL_API_SPACE, NEXT_PUBLIC_CONTENTFUL_API_ACCESS_TOKEN } = process.env;

export const client = createClient({
  space: NEXT_PUBLIC_CONTENTFUL_API_SPACE || 'string',
  accessToken: NEXT_PUBLIC_CONTENTFUL_API_ACCESS_TOKEN || 'string',
});

export default client;
