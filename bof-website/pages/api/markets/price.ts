import { CacheTimeout } from '@/common/cacheRequest';
import { CoinMarketGlobal, CoinMarketPrice, CoinMarketQuote } from '@/interfaces/Markets.interface';
import proxyCoinMarket from 'API/coinmarket/proxyCoinMarket';
import { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/v1/cryptocurrency/quotes/latest';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req as { query: Record<string, string> };
  const response = await proxyCoinMarket<CoinMarketGlobal>(endpoint, query, CacheTimeout.ONE_HOUR);
  return res.json(response);
};

export const getMarketPrice = async (query?: Record<string, string>): Promise<CoinMarketPrice> => {
  const response = await proxyCoinMarket<CoinMarketQuote>(endpoint, query, CacheTimeout.ONE_HOUR);
  return response?.data?.[query.id] ?? null;
};

export default handler;
