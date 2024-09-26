import { CoinMarketTrending } from '@/interfaces/Markets.interface';
import React from 'react';
import { MobileTrendingMarkets } from './MobileTrendingMarkets';
import { TrendingMarketCard } from './TrendingMarketCard';
import style from './TrendingMarkets.module.css';

interface TrendingMarketsProps {
  trending: CoinMarketTrending;
}

const TrendingMarkets: React.FC<TrendingMarketsProps> = ({ trending }: TrendingMarketsProps) => {
  return (
    <div>
      <div className={style.desktop}>
        {Object.keys(trending).map(trendType => (
          <TrendingMarketCard trending={trending} trendType={trendType} key={trendType} />
        ))}
      </div>
      <div className={style.mobile}>
        <MobileTrendingMarkets trending={trending} />
      </div>
    </div>
  );
};

export default TrendingMarkets;
