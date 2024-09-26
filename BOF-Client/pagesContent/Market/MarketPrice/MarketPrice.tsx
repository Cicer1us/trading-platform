import { getMarketLogoURI } from 'constants/markets';
import React from 'react';
import style from './MarketPrice.module.css';
import Image from 'next/image';
import { CoinMarketMetadata, CoinMarketPrice } from '@/interfaces/Markets.interface';
import NumberFormat from 'react-number-format';
import getDecimalsScale from '@/helpers/getDecimalsScale';
import { ChainAddresses } from '@/components/ChainAddresses/ChainAddresses';
import { filterAvailableMarketChains } from '@/helpers/getAvailableMarketChains';

interface MarketPriceProps {
  price: CoinMarketPrice;
  metadata: CoinMarketMetadata;
}

export const MarketPrice: React.FC<MarketPriceProps> = ({ price, metadata }) => {
  const currentPrice = price?.quote?.USD?.price;
  const percentChange = price?.quote?.USD?.percent_change_24h;
  const addresses = filterAvailableMarketChains(metadata.contract_address);

  return (
    <div className={style.container}>
      <div className={style.flex}>
        <Image src={getMarketLogoURI(price?.id)} alt={price?.symbol} width={32} height={32} />
        <div className={style.symbol}>{`${price?.name} (${price?.symbol})`}</div>
      </div>
      <div className={style.flex}>
        <div className={style.currentPrice}>
          <NumberFormat
            decimalScale={getDecimalsScale(currentPrice)}
            thousandSeparator
            displayType="text"
            value={currentPrice}
            prefix="$"
          />
        </div>
        <div className={`${style.priceChange} ${percentChange > 0 ? style.priceUp : style.priceDown}`}>
          <NumberFormat
            decimalScale={2}
            thousandSeparator
            displayType="text"
            value={percentChange}
            suffix="%)"
            prefix="("
          />
        </div>
        {!!addresses?.length && <ChainAddresses title={'Address'} addresses={addresses} />}
      </div>
    </div>
  );
};
