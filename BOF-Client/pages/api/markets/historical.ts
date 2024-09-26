import { CacheTimeout } from '@/common/cacheRequest';
import { CoinMarketHistorical } from '@/interfaces/Markets.interface';
import proxyCoinMarket from 'API/coinmarket/proxyCoinMarket';
import { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/v2/cryptocurrency/ohlcv/historical';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req as { query: Record<string, string> };
  const response = await proxyCoinMarket<CoinMarketHistorical>(endpoint, query, CacheTimeout.ONE_HOUR);
  return res.json(response);
};

export const getHistoricalMarket = async (query?: Record<string, string>): Promise<CoinMarketHistorical> => {
  const response = await proxyCoinMarket<CoinMarketHistorical>(endpoint, query, CacheTimeout.ONE_HOUR);
  return response?.data ?? null;
};

export default handler;
