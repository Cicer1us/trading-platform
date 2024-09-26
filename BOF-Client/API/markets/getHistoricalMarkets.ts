import { CoinMarketResponse, CoinMarketHistorical } from '@/interfaces/Markets.interface';

export default async function fetchHistoricalMarkets(
  query: Record<string, string>
): Promise<CoinMarketResponse<CoinMarketHistorical>> {
  const search = new URLSearchParams(query).toString();
  const response = await fetch(`/api/markets/historical?${search}`);
  const json = await response.json();
  return json;
}
