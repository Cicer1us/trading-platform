import { MarketsNewsCard } from '@/components/MarketNewsCard/MarketNewsCard';
import useMultilingual from '@/hooks/useMultilingual';
import { CryptoPanicPost } from '@/interfaces/Cryptopanic.interface';
import { CoinMarketMetadata } from '@/interfaces/Markets.interface';
import Card from '@/ui-kit/Card/Card';
import fetchMarketNews from 'API/markets/getNews';
import React, { useEffect, useState } from 'react';
import style from './MarketNews.module.css';

interface MarketNewsProps {
  metadata: CoinMarketMetadata;
}

export const MarketNews: React.FC<MarketNewsProps> = ({ metadata }) => {
  const [marketNews, setMarketsNews] = useState<CryptoPanicPost[]>([]);
  const { t } = useMultilingual('markets');

  const updateNews = async () => {
    const newNews = await fetchMarketNews({ currencies: metadata.symbol });
    setMarketsNews(newNews?.results ?? []);
  };

  useEffect(() => {
    updateNews();
  }, []);

  return (
    <Card className={style.card}>
      <div className={`${style.news} scroll`}>
        <div className={style.title}>{t('newsFeed')}</div>
        {marketNews.map(n => (
          <MarketsNewsCard title={n.title} source={n.source.domain} date={n.created_at} url={n.url} key={n.id} />
        ))}
      </div>
    </Card>
  );
};
