import cacheRequest, { CacheTimeout } from '@/common/cacheRequest';
import { CoinMarketResponse } from '@/interfaces/Markets.interface';
import { COIN_MARKET_URL } from 'constants/urls';

export default async function proxyCoinMarket<T>(
  endpoint: string,
  query: Record<string, string>,
  cacheTimeout = CacheTimeout.FIVE_MIN
): Promise<CoinMarketResponse<T>> {
  const url = new URL(`${COIN_MARKET_URL}${endpoint}`);
  url.search = new URLSearchParams(query).toString();

  const requestData = { headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKET_API_KEY } };
  return cacheRequest(url.toString(), requestData, cacheTimeout);
}
