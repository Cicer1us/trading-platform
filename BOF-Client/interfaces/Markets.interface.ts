import { TokenColumn } from './TransactionTable.interface';

export type CoinMarketPricesResponse = CoinMarketResponse<CoinMarketPrice[]>;
export type CoinMarketQuoteResponse = CoinMarketResponse<CoinMarketQuote>;
export type CoinMarketCategoryResponse = CoinMarketResponse<CoinMarketCategory>;
export type CoinMarketMetadataResponse = CoinMarketResponse<Record<string, CoinMarketMetadata[]>>;

export enum TrendingMarket {
  POPULAR = 'POPULAR',
  GAINER = 'GAINER',
  LOSER = 'LOSER',
}
export type CoinMarketTrending = { [key in keyof typeof TrendingMarket]: CoinMarketPrice[] };
export type CoinMarketQuote = { [id: string]: CoinMarketPrice };

export interface CoinMarketToken {
  id: number;
  symbol: string;
  name: string;
}

export interface CoinMarketGlobal {
  active_cryptocurrencies: number;
  total_cryptocurrencies: number;
  active_market_pairs: number;
  active_exchanges: number;
  total_exchanges: number;
  eth_dominance: number;
  btc_dominance: number;
  eth_dominance_yesterday: number;
  btc_dominance_yesterday: number;
  eth_dominance_24h_percentage_change: number;
  btc_dominance_24h_percentage_change: number;
  defi_volume_24h: number;
  defi_volume_24h_reported: number;
  defi_market_cap: number;
  defi_24h_percentage_change: number;
  stablecoin_volume_24h: number;
  stablecoin_volume_24h_reported: number;
  stablecoin_market_cap: number;
  stablecoin_24h_percentage_change: number;
  derivatives_volume_24h: number;
  derivatives_volume_24h_reported: number;
  derivatives_24h_percentage_change: number;
  last_updated: string;
  quote: {
    USD: {
      total_market_cap: number;
      total_volume_24h: number;
      total_volume_24h_reported: number;
      altcoin_volume_24h: number;
      altcoin_volume_24h_reported: number;
      altcoin_market_cap: number;
      defi_volume_24h: number;
      defi_volume_24h_reported: number;
      defi_24h_percentage_change: number;
      defi_market_cap: number;
      stablecoin_volume_24h: number;
      stablecoin_volume_24h_reported: number;
      stablecoin_24h_percentage_change: number;
      stablecoin_market_cap: number;
      derivatives_volume_24h: number;
      derivatives_volume_24h_reported: number;
      derivatives_24h_percentage_change: number;
      last_updated: string;
      total_market_cap_yesterday: number;
      total_volume_24h_yesterday: number;
      total_market_cap_yesterday_percentage_change: number;
      total_volume_24h_yesterday_percentage_change: number;
    };
  };
}

export interface CoinMarketPrice {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: null;
  circulating_supply: number;
  total_supply: number;
  is_active: number;
  cmc_rank: number;
  is_fiat: number;
  self_reported_circulating_supply: null;
  self_reported_market_cap: null;
  last_updated: string;
  quote: Record<string, CoinMarketTokenQuote>;
  platform: CoinMarketPlatform;
}

export interface CoinMarketHistorical {
  id: number;
  name: string;
  symbol: string;
  quotes: CoinMarketHistoricalQuote[];
}

export interface CoinMarketHistoricalQuote {
  time_open: string;
  time_close: string;
  time_high: string;
  time_low: string;
  quote: {
    USD: {
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
      market_cap: number;
      timestamp: string;
    };
  };
}

export interface CoinMarketMetadata {
  id: number;
  name: string;
  symbol: string;
  category: string;
  description: string;
  slug: string;
  logo: string;
  subreddit: string;
  notice: string;
  tags: string[];
  'tag-names': string[];
  'tag-groups': string[];
  urls: Record<string, Record<string, string>>;
  platform: CoinMarketPlatform;
  date_added: string;
  twitter_username: string;
  is_hidden: number;
  date_launched: string;
  contract_address: CoinMarketContract[];
  self_reported_circulating_supply: number;
  self_reported_tags: number;
  self_reported_market_cap: number;
}

export interface Market {
  name: string;
  symbol: string;
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  last_updated: string;
}

export interface TokenCategory {
  id: string;
  name: string;
  coinMarketId?: string;
}

interface CoinMarketPlatform {
  id: string;
  name: string;
  symbol: string;
  slug: string;
  token_address: string;
}

export interface CoinMarketResponse<T> {
  status: {
    timestamp: string;
    error_code: number;
    error_message: null | string;
    elapsed: number;
    credit_count: number;
    notice: null;
    total_count?: number;
  };
  data: T;
}

export interface CoinMarketContract {
  contract_address: string;
  platform: {
    name: string;
    coin: Omit<CoinMarketPlatform, 'token_address'>;
  };
}

export interface CoinMarketTokenQuote {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  last_updated: string;
}

export interface CoinMarketCategory {
  id: string;
  name: string;
  title: string;
  description: string;
  num_tokens: number;
  last_updated: string;
  avg_price_change: number;
  market_cap: number;
  market_cap_change: number;
  volume: number;
  volume_change: number;
  coins: CoinMarketPrice[];
}

export interface MarketRow {
  id: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  price: number;
  chains: number[];
  token: TokenColumn;
}
