import { CacheTimeout } from '@/common/cacheRequest';
import { CoinMarketPrice } from '@/interfaces/Markets.interface';
import proxyCoinMarket from 'API/coinmarket/proxyCoinMarket';
import { NextApiRequest, NextApiResponse } from 'next';
import { MarketsTableData } from 'pagesContent/Markets/MarketsTable/MarketsTable';

const endpoint = '/v1/cryptocurrency/listings/latest';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req as { query: Record<string, string> };
  const response = await proxyCoinMarket<CoinMarketPrice[]>(endpoint, query, CacheTimeout.FIVE_MIN);
  return res.json(response);
};

export const getMarkets = async (query: Record<string, string>): Promise<MarketsTableData> => {
  const response = await proxyCoinMarket<CoinMarketPrice[]>(endpoint, query, CacheTimeout.FIVE_MIN);
  return { data: response.data, totalCount: response.status.total_count };
};

export default handler;
