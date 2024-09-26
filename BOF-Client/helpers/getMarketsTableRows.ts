import { MARKETS } from '@/common/LocationPath';
import { CoinMarketPrice, MarketRow } from '@/interfaces/Markets.interface';
import { getMarketLogoURI } from 'constants/markets';

export const getMarketsTableRows = (markets: CoinMarketPrice[]): MarketRow[] => {
  return markets.map(market => ({
    id: market.id,
    percent_change_24h: market.quote.USD.percent_change_24h,
    percent_change_7d: market.quote.USD.percent_change_7d,
    market_cap: market.quote.USD.market_cap,
    price: market.quote.USD.price,
    chains: null,
    token: {
      symbol: market.symbol,
      logoURI: getMarketLogoURI(market.id),
      link: `${MARKETS}/${market.id}`,
    },
  }));
};
