import { TRADING_SWAP } from '@/common/LocationPath';
import React, { useEffect, useState } from 'react';
import style from './StatisticsCards.module.css';
import Link from 'next/link';
import Card from '@/components/Card/Card';
import { useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import { NumericFormat } from 'react-number-format';
import getTokensFullPrices from 'API/tokens/getTokensData';
import { CoinMarketPrice, CoinMarketTokenQuote } from '@/interfaces/Markets.interface';

interface Token {
  coinMarketId: string;
  symbol: string;
  icon: string;
  name: string;
}

const tokens: Token[] = [
  {
    name: 'BNB',
    coinMarketId: '1839',
    symbol: 'BNB',
    icon: '/images/Landing/tokens/BNB.png',
  },
  {
    name: 'Polygon',
    coinMarketId: '3890',
    symbol: 'MATIC',
    icon: '/images/Landing/tokens/MATIC.png',
  },
  {
    name: 'Ethereum',
    coinMarketId: '1027',
    symbol: 'ETH',
    icon: '/images/Landing/tokens/ETH.png',
  },
  {
    name: 'Uniswap',
    coinMarketId: '7083',
    symbol: 'UNI',
    icon: '/images/Landing/tokens/UNI.png',
  },
  {
    name: 'Bitcoin',
    coinMarketId: '3717',
    symbol: 'WBTC',
    icon: '/images/Landing/tokens/WBTC.png',
  },
  {
    name: 'Chainlink',
    coinMarketId: '1975',
    symbol: 'LINK',
    icon: '/images/Landing/tokens/LINK.png',
  },
  {
    name: 'ApeCoin',
    coinMarketId: '18876',
    symbol: 'APE',
    icon: '/images/Landing/tokens/APE.png',
  },
  {
    name: 'NEAR Protocol',
    coinMarketId: '6535',
    symbol: 'NEAR',
    icon: '/images/Landing/tokens/NEAR.png',
  },
  {
    name: 'ParaSwap',
    coinMarketId: '14534',
    symbol: 'PSP',
    icon: '/images/Landing/tokens/PSP.png',
  },
  {
    name: 'dYdX',
    coinMarketId: '11156',
    symbol: 'DYDX',
    icon: '/images/Landing/tokens/DYDX.png',
  },
];

const StatisticsCards: React.FC = () => {
  const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const [tokenPrices, setTokenPrices] = useState<Record<string, CoinMarketTokenQuote>>({});
  const { events } = useDraggable(ref);

  useEffect(() => {
    const getPrices = async () => {
      const prices = await getTokensFullPrices(tokens.map(token => token.coinMarketId));
      const tokenPrices = prices.reduce(
        (total, tokenPrice: CoinMarketPrice) => ({ ...total, [tokenPrice.id]: tokenPrice.quote.USD }),
        {}
      );
      setTokenPrices(tokenPrices);
    };

    getPrices();
  }, []);

  return (
    <>
      <div className={style.statisticsWrapper} {...events} ref={ref}>
        {tokens.map(({ name, symbol, coinMarketId, icon }) => (
          <Card className={style.card} key={coinMarketId}>
            <div className={style.statisticsCard}>
              <div
                className={`${style.tokenTickerContainer} ${
                  tokenPrices[coinMarketId]?.percent_change_24h > 0 ? style.priceUp : style.priceDown
                }`}
              >
                <img className={style.tokenImage} src={icon} alt={symbol} loading="lazy" />
                <div className={style.tokenName}>{name}</div>
                <div className={style.price}>
                  <NumericFormat
                    decimalScale={tokenPrices[coinMarketId]?.price > 0.1 ? 1 : 3}
                    thousandSeparator
                    displayType="text"
                    value={tokenPrices[coinMarketId]?.price}
                    prefix="$"
                  />
                </div>
                <div className={style.tokenTicker}>{symbol}</div>
                <div className={style.percentage}>
                  <NumericFormat
                    decimalScale={2}
                    thousandSeparator
                    displayType="text"
                    value={tokenPrices[coinMarketId]?.percent_change_24h}
                    suffix="%"
                  />
                </div>
              </div>
              <div className={style.btnWrap}>
                <Link href={TRADING_SWAP} target="_blank" rel="noopener noreferrer">
                  <div className={style.buy}>Buy</div>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default StatisticsCards;
