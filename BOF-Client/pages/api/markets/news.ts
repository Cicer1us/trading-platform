import { CacheTimeout } from '@/common/cacheRequest';
import { CryptoPanicPost } from '@/interfaces/Cryptopanic.interface';
import proxyCryptoPanic from 'API/proxy/proxyCryptoPanic';
import { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/api/v1/posts/';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req as { query: Record<string, string> };
  const response = await proxyCryptoPanic<CryptoPanicPost[]>(endpoint, query);
  return res.json(response);
};

export const getMarketNews = async (query?: Record<string, string>): Promise<CryptoPanicPost[]> => {
  const response = await proxyCryptoPanic<CryptoPanicPost[]>(endpoint, query, CacheTimeout.ONE_HOUR);
  return response?.results ?? [];
};

export default handler;
