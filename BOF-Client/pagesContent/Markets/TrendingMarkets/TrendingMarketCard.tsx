import { CoinMarketPrice, CoinMarketTrending } from '@/interfaces/Markets.interface';
import { getMarketLogoURI } from 'constants/markets';
import React from 'react';
import NumberFormat from 'react-number-format';
import style from './TrendingMarkets.module.css';
import Image from 'next/image';
import Card from '@/ui-kit/Card/Card';
import useMultilingual from '@/hooks/useMultilingual';
import { MARKETS } from '@/common/LocationPath';

interface TrendingMarketCardProps {
  trending: CoinMarketTrending;
  trendType: string;
}

export const TrendingMarketCard: React.FC<TrendingMarketCardProps> = ({ trending, trendType }) => {
  const { t } = useMultilingual('markets');
  return (
    <Card className={style.card}>
      <div className={style.cardTitle}>
        <div className={style.title}>{t(trendType)}</div>
        <div className={style.secondaryText}>{t('dayHours')}</div>
      </div>
      <div className={style.list}>
        {trending[trendType].map((token: CoinMarketPrice, index) => (
          <a
            key={token.id}
            className={style.token}
            target="_blank"
            rel="noopener noreferrer"
            href={`${MARKETS}/${token.id}`}
          >
            {index + 1}.
            <Image src={getMarketLogoURI(token.id)} alt={token.symbol} width={20} height={20} className={style.icon} />
            <div className={style.symbol}>{token.symbol}</div>
            <div
              className={`${style.priceChange} ${
                token.quote?.USD?.percent_change_24h > 0 ? style.priceUp : style.priceDown
              }`}
            >
              <NumberFormat
                decimalScale={2}
                thousandSeparator
                displayType="text"
                value={token.quote.USD.percent_change_24h}
                suffix=" %"
              />
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
};
