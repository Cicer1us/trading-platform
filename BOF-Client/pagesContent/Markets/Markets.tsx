import { CmsArticle } from '@/interfaces/CMS.interface';
import { CryptoPanicPost } from '@/interfaces/Cryptopanic.interface';
import { CoinMarketGlobal, CoinMarketToken, CoinMarketTrending } from '@/interfaces/Markets.interface';
import fetchMarketTokens from 'API/markets/getMarketTokens';
import { Entry } from 'contentful';
import React, { useEffect, useState } from 'react';
import { MarketsInfo } from './Info/MarketsInfo';
import { MarketsTableData, MarketsTable } from './MarketsTable/MarketsTable';
import { SearchMarkets } from './SearchMarkets/SearchMarkets';
import TrendingMarkets from './TrendingMarkets/TrendingMarkets';

interface MarketsProps {
  trending: CoinMarketTrending;
  markets: MarketsTableData;
  news: CryptoPanicPost[];
  articles: Entry<CmsArticle>[];
  global: CoinMarketGlobal;
}

const Markets: React.FC<MarketsProps> = ({ trending, markets, news, articles, global }) => {
  const [tokens, setTokens] = useState<CoinMarketToken[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(true);

  const fetchTokens = async () => {
    const marketTokens = await fetchMarketTokens();
    if (marketTokens.length && isMounted) {
      setTokens(marketTokens);
    }
  };

  useEffect(() => {
    fetchTokens();
    return () => setIsMounted(false);
  }, []);

  return (
    <div>
      <SearchMarkets tokens={tokens} global={global} />
      <TrendingMarkets trending={trending} />
      <MarketsTable markets={markets} />
      <MarketsInfo news={news} articles={articles} tokens={tokens} />
    </div>
  );
};

export default Markets;
