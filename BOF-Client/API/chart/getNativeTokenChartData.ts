import { CoinGeckoPriceResponse } from '@/interfaces/Coingecko.interface';

export default async function getNativeTokenChartData(
  activeInterval: number[],
  nativeTokenId: string
): Promise<CoinGeckoPriceResponse> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    const response = await fetch(
      `https://pro-api.coingecko.com/api/v3/coins/${nativeTokenId}/market_chart/range?vs_currency=usd&from=${activeInterval[0]}&to=${activeInterval[1]}&x_cg_pro_api_key=${apiKey}`
    );

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    return null;
  }
}
