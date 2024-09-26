import { CoinMarketMetadata } from '@/interfaces/Markets.interface';
import { CacheTimeout } from '@/common/cacheRequest';
import proxyCoinMarket from 'API/coinmarket/proxyCoinMarket';
import { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/v2/cryptocurrency/info';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req as { query: Record<string, string> };
  const response = await proxyCoinMarket<Record<string, CoinMarketMetadata>>(endpoint, query, CacheTimeout.ONE_DAY);
  return res.json(response);
};

export const getMarketMetadata = async (query: Record<string, string>): Promise<CoinMarketMetadata> => {
  const response = await proxyCoinMarket<Record<string, CoinMarketMetadata>>(endpoint, query, CacheTimeout.ONE_DAY);
  return response?.data?.[query.id.toUpperCase()] ?? null;
};

export default handler;
