export type CoinGeckoTokenPrices = Record<string, CoinGeckoTokenPrice>;
type CoinGeckoTokenPrice = Record<'usd', number>;
export interface CoinGeckoPriceResponse {
  prices: CoinGeckoPrice[];
}

export type CoinGeckoPrice = [timestamp: number, price: number];
