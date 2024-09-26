import useMultilingual from '@/hooks/useMultilingual';
import { CoinMarketTrending, TrendingMarket } from '@/interfaces/Markets.interface';
import React, { useState } from 'react';
import { TrendingMarketCard } from './TrendingMarketCard';
import style from './TrendingMarkets.module.css';

interface TrendingMarketsProps {
  trending: CoinMarketTrending;
}

export const MobileTrendingMarkets: React.FC<TrendingMarketsProps> = ({ trending }: TrendingMarketsProps) => {
  const { t } = useMultilingual('markets');
  const [trendingType, setTrendingType] = useState<TrendingMarket>(TrendingMarket.POPULAR);

  return (
    <div className={style.trending}>
      <div className={style.trendingTypes}>
        {Object.values(TrendingMarket).map(type => (
          <div
            key={type}
            className={`${style.trendingType} ${type === trendingType ? style.active : ''}`}
            onClick={() => setTrendingType(type)}
          >
            <div className={style.trendingTypeTitle}>{t(type)}</div>
          </div>
        ))}
      </div>
      <div>
        <TrendingMarketCard trending={trending} trendType={trendingType} />
      </div>
    </div>
  );
};
