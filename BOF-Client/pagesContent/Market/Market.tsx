import { MARKETS } from '@/common/LocationPath';
import { Crumbs } from '@/components/Crums/Crumbs';
import { CoinMarketPrice, CoinMarketMetadata } from '@/interfaces/Markets.interface';
import React from 'react';
import style from './Market.module.css';
import { MarketChart } from './MarketChart/MarketChart';
import { MarketDescription } from './MarketDescription/MarketDescription';
import { MarketLinks } from './MarketLinks/MarketLinks';
import { MarketNews } from './MarketNews/MarketNews';
import { MarketPrice } from './MarketPrice/MarketPrice';
import { MarketRank } from './MarketRank/MarketRank';

interface MarketProps {
  price: CoinMarketPrice;
  metadata: CoinMarketMetadata;
}

const Market: React.FC<MarketProps> = ({ price, metadata }) => {
  const crumbs = [
    {
      title: 'Markets',
      link: `${MARKETS}`,
    },
    {
      title: metadata?.symbol,
      link: ``,
    },
  ];

  return (
    <div>
      <div>
        <Crumbs crumbs={crumbs} />
      </div>
      <div className={style.container}>
        <div className={style.price}>
          <MarketPrice price={price} metadata={metadata} />
        </div>
        <div className={style.chart}>
          <MarketChart metadata={metadata} />
        </div>
        <div className={style.description}>
          <MarketDescription metadata={metadata} />
        </div>
        <div className={style.links}>
          <MarketLinks metadata={metadata} />
        </div>
        <div className={style.rank}>
          <MarketRank price={price} />
        </div>
        <div className={style.news}>
          <MarketNews metadata={metadata} />
        </div>
      </div>
    </div>
  );
};

export default Market;
