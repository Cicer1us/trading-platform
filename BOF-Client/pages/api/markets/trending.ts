import { CacheTimeout } from '@/common/cacheRequest';
import { CoinMarketPrice, CoinMarketTrending, TrendingMarket } from '@/interfaces/Markets.interface';
import proxyCoinMarket from 'API/coinmarket/proxyCoinMarket';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req as { query: Record<string, string> };
  const response = await getTrendingMarkets(query);
  return res.json(response);
};

function getLosersRequest(query: Record<string, string>) {
  const endpoint = `/v1/cryptocurrency/trending/gainers-losers`;
  return proxyCoinMarket<CoinMarketPrice[]>(endpoint, { ...query, sort_dir: 'asc' }, CacheTimeout.FIVE_MIN);
}

function getGainersRequest(query: Record<string, string>) {
  const endpoint = `/v1/cryptocurrency/trending/gainers-losers`;
  return proxyCoinMarket<CoinMarketPrice[]>(endpoint, { ...query, sort_dir: 'desc' }, CacheTimeout.FIVE_MIN);
}

function getPopularRequest(query: Record<string, string>) {
  const endpoint = `/v1/cryptocurrency/trending/latest`;
  return proxyCoinMarket<CoinMarketPrice[]>(endpoint, query, CacheTimeout.FIVE_MIN);
}

export async function getTrendingMarkets(query: Record<string, string>): Promise<CoinMarketTrending> {
  const requests = [getLosersRequest(query), getGainersRequest(query), getPopularRequest(query)];
  const responses = await Promise.all(requests);

  return {
    [TrendingMarket.LOSER]: responses[0]?.data ?? [],
    [TrendingMarket.GAINER]: responses[1]?.data ?? [],
    [TrendingMarket.POPULAR]: responses[2]?.data ?? [],
  };
}

export default handler;
