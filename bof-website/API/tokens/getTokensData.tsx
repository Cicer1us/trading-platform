import { CoinMarketPrice } from '@/interfaces/Markets.interface';

export default async function getTokensFullPrices(coinMarketIds: string[]): Promise<CoinMarketPrice[]> {
  try {
    const request = await fetch(`/api/markets/price?id=${coinMarketIds.join(',')}`);
    const json = await request.json();
    return json?.data ? Object.values(json.data) : [];
  } catch (error) {
    console.error(error.message);
    return [];
  }
}
