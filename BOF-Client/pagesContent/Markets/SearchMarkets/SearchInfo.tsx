import useMultilingual from '@/hooks/useMultilingual';
import { CoinMarketGlobal } from '@/interfaces/Markets.interface';
import React from 'react';
import NumberFormat from 'react-number-format';
import style from './SearchMarkets.module.css';

interface SearchInfoProps {
  global: CoinMarketGlobal;
}

const ONE_TRILLION = 1000000000000;
const ONE_BILLION = 1000000000;
const ONE_MILLION = 1000000;

const getGlobalMarketCapValue = (marketCap: number): [number, string] => {
  if (marketCap > ONE_TRILLION) {
    return [marketCap / ONE_TRILLION, 'T'];
  }

  if (marketCap > ONE_BILLION) {
    return [marketCap / ONE_BILLION, 'B'];
  }

  return [marketCap / ONE_MILLION, 'M'];
};

export const SearchInfo: React.FC<SearchInfoProps> = ({ global }) => {
  const { t } = useMultilingual('markets');
  const [value, suffix] = getGlobalMarketCapValue(global?.quote?.USD?.total_market_cap);
  const percentChange = global?.quote?.USD?.total_market_cap_yesterday_percentage_change;

  return (
    <div className={style.info}>
      <div className={style.title}>{t('infoTitle')}</div>
      <div className={style.subtitle}>
        {t('globalCapTitle')}
        <span className={style.marketCap}>
          <NumberFormat
            value={value}
            displayType="text"
            thousandSeparator={true}
            prefix={'$'}
            suffix={suffix}
            decimalScale={1}
          />
        </span>
        ,
        <span className={` ${percentChange > 0 ? style.percentUp : style.percentDown}`}>
          <NumberFormat
            value={global?.quote?.USD?.total_market_cap_yesterday_percentage_change}
            displayType="text"
            suffix={'%'}
            decimalScale={2}
          />
        </span>
        {percentChange > 0 ? 'increase' : 'decrease'} {t('overLastDay')}
      </div>
    </div>
  );
};
