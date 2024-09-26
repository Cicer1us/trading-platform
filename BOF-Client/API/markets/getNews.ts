import { CryptoPanicPost, CryptoPanicResponse } from '@/interfaces/Cryptopanic.interface';

export default async function fetchMarketNews(
  query: Record<string, string>
): Promise<CryptoPanicResponse<CryptoPanicPost[]>> {
  const search = new URLSearchParams(query).toString();
  const response = await fetch(`/api/markets/news?${search}`);
  const json = await response.json();
  return json;
}
