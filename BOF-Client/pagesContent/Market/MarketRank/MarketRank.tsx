import useMultilingual from '@/hooks/useMultilingual';
import { CoinMarketPrice } from '@/interfaces/Markets.interface';
import React from 'react';
import NumberFormat from 'react-number-format';
import style from './MarketRank.module.css';

interface MarketRankProps {
  price: CoinMarketPrice;
}

export const MarketRank: React.FC<MarketRankProps> = ({ price }) => {
  const { t } = useMultilingual('markets');
  return (
    <div className={style.container}>
      <div className={style.column}>
        <div className={style.columnName}>{t('marketCapRank')}</div>
        <div className={style.value}>{price?.cmc_rank}</div>
      </div>
      <div className={style.column}>
        <div className={style.columnName}>{t('marketCap')}</div>
        <div className={style.value}>
          <NumberFormat
            decimalScale={0}
            thousandSeparator
            displayType="text"
            value={price?.quote?.USD?.market_cap}
            prefix="$"
          />
        </div>
      </div>
    </div>
  );
};
