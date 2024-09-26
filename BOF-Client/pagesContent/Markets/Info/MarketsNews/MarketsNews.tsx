import { InputDebounceSearch } from '@/components/InputSearch/InputSearch';
import { CryptoPanicPost } from '@/interfaces/Cryptopanic.interface';
import { CoinMarketToken } from '@/interfaces/Markets.interface';
import Card from '@/ui-kit/Card/Card';
import { MarketsNewsCard } from '@/components/MarketNewsCard/MarketNewsCard';
import React, { useState } from 'react';
import { DotLoader } from 'react-spinners';
import style from './MarketsNews.module.css';
import fetchMarketNews from 'API/markets/getNews';
import useMultilingual from '@/hooks/useMultilingual';

interface MarketsNewsProps {
  news: CryptoPanicPost[];
  tokens: CoinMarketToken[];
}

export const MarketsNews: React.FC<MarketsNewsProps> = ({ news, tokens }: MarketsNewsProps) => {
  const { t } = useMultilingual('markets');
  const [marketNews, setMarketsNews] = useState<CryptoPanicPost[]>(news);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateNews = async (query: string) => {
    // cryptopanic api supports only 50 tokens
    const availableTokens = tokens.filter(token => token.symbol.includes(query.toUpperCase())).slice(0, 50);
    if (availableTokens.length === 0) {
      setMarketsNews([]);
      setIsLoading(false);
    } else {
      const newNews = await fetchMarketNews({ currencies: availableTokens.map(t => t.symbol).join(',') });
      setMarketsNews(newNews.results);
      setIsLoading(false);
    }
  };

  const onHandle = (value: string) => {
    if (value && value.length > 2) {
      updateNews(value);
    } else {
      setMarketsNews(news);
      setIsLoading(false);
    }
  };

  return (
    <Card className={style.card}>
      <div className={style.search}>
        <InputDebounceSearch
          debounceInterval={500}
          setLoading={setIsLoading}
          onChange={onHandle}
          placeholder={t('searchPlaceholder')}
        />
      </div>
      {isLoading ? (
        <div className={style.loader}>
          <DotLoader size={80} color={'var(--green)'} loading={true} />
        </div>
      ) : (
        <div className={`scroll`}>
          {!!marketNews.length ? (
            <>
              {marketNews.map(n => (
                <MarketsNewsCard title={n.title} source={n.source.domain} date={n.created_at} url={n.url} key={n.id} />
              ))}
            </>
          ) : (
            <div className={style.placeholder}>
              <div>{t('nothingToShow')}</div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
