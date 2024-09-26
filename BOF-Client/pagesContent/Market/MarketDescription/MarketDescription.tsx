import useMultilingual from '@/hooks/useMultilingual';
import { CoinMarketMetadata } from '@/interfaces/Markets.interface';
import React from 'react';
import style from './MarketDescription.module.css';

interface MarketDescriptionProps {
  metadata: CoinMarketMetadata;
}

export const MarketDescription: React.FC<MarketDescriptionProps> = ({ metadata }) => {
  const { tc } = useMultilingual('markets');
  return (
    <div className={style.container}>
      <div className={style.title}>{tc('aboutMarket')([metadata.symbol])}</div>
      <div className={style.description}>{metadata.description}</div>
    </div>
  );
};
