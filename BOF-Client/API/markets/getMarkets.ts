import { CoinMarketResponse, CoinMarketPrice } from '@/interfaces/Markets.interface';

export default async function fetchMarkets(
  query: Record<string, string>
): Promise<CoinMarketResponse<CoinMarketPrice[]>> {
  const search = new URLSearchParams(query).toString();
  const response = await fetch(`/api/markets?${search}`);
  const json = await response.json();
  return json;
}
