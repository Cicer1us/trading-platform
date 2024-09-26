import { CoinMarketToken } from '@/interfaces/Markets.interface';

export default async function fetchMarketTokens(): Promise<CoinMarketToken[]> {
  const response = await fetch(`/api/markets/tokens`);
  const json = await response.json();
  return json;
}
