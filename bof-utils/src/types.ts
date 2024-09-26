export interface Token {
  address: string;
  decimals: number;
  name?: string;
  symbol?: string;
  chainId?: string | number;
}

export interface Allowance {
  clientAddress: string;
  token: string;
}

export interface TradeInfo {
  clientAddress: string;
  tokenAddress: string;
  chainId: number;
  amount?: string;
  decimals: number;
}

export enum Chain {
  MAINNET = 1,
  POLYGON = 137,
  FANTOM = 250,
  BSC = 56,
  AVALANCHE = 43114,
  ARBITRUM = 42161,
  OPTIMISM = 10,
}

export enum ExchangeAddress {
  PARASWAP = '0x216B4B4Ba9F3e719726886d34a177484278Bfcae',
  PARASWAP_NFT_ETHEREUM = '0xe92b586627cca7a83dc919cc7127196d70f55a06',
  PARASWAP_NFT_POLYGON = '0xf3cd476c3c4d3ac5ca2724767f269070ca09a043',
}
// 0xf3cd476c3c4d3ac5ca2724767f269070ca09a043 polygon
export type CoinGeckoTokenPrices = Record<string, CoinGeckoTokenPrice>;
type CoinGeckoTokenPrice = Record<'usd', number>;

export interface CoinGeckoPriceResponse {
  prices: CoinGeckoPrice[];
}

export type CoinGeckoPrice = [timestamp: number, price: number];
