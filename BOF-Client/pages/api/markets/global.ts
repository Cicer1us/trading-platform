import { CacheTimeout } from '@/common/cacheRequest';
import { CoinMarketGlobal } from '@/interfaces/Markets.interface';
import proxyCoinMarket from 'API/coinmarket/proxyCoinMarket';
import { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/v1/global-metrics/quotes/latest';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req as { query: Record<string, string> };
  const response = await proxyCoinMarket<CoinMarketGlobal>(endpoint, query, CacheTimeout.ONE_HOUR);
  return res.json(response);
};

export const getMarketGlobal = async (query?: Record<string, string>): Promise<CoinMarketGlobal> => {
  const response = await proxyCoinMarket<CoinMarketGlobal>(endpoint, query, CacheTimeout.ONE_HOUR);
  return response?.data ?? null;
};

export default handler;
