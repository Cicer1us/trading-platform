import { CoinMarketResponse, CoinMarketCategory } from '@/interfaces/Markets.interface';

export default async function fetchCategoryMarkets(
  categoryId: string,
  query: Record<string, string>
): Promise<CoinMarketResponse<CoinMarketCategory>> {
  const search = new URLSearchParams(query).toString();
  const response = await fetch(`/api/markets/${categoryId}?${search}`);
  const json = await response.json();
  return json;
}
