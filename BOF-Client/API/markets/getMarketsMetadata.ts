import { CoinMarketResponse, CoinMarketMetadata } from '@/interfaces/Markets.interface';

export default async function fetchMarketsMetadata(
  query: Record<string, string>
): Promise<CoinMarketResponse<Record<string, CoinMarketMetadata>>> {
  const search = new URLSearchParams(query).toString();
  const response = await fetch(`/api/markets/metadata?${search}`);
  const json = await response.json();
  return json;
}
