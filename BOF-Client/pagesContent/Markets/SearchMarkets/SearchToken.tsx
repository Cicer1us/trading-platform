import { CoinMarketToken } from '@/interfaces/Markets.interface';
import { getMarketLogoURI } from 'constants/markets';
import React from 'react';
import style from './SearchMarkets.module.css';
import Image from 'next/image';

interface MarketSearchSectionProps {
  title: string;
  tokens: CoinMarketToken[];
  href: (token: CoinMarketToken) => string;
}

interface MarketSearchTokenProps {
  title: string;
  id: number;
  href: string;
}

export const MarketSearchToken: React.FC<MarketSearchTokenProps> = ({ title, id, href }) => {
  return (
    <a className={style.token} href={href} target="_blank" rel="noopener noreferrer">
      <div className={style.icon}>
        <Image src={getMarketLogoURI(id)} alt={title} width={20} height={20} />
      </div>
      <div className={style.symbol}>{title}</div>
    </a>
  );
};

export const MarketSearchSection: React.FC<MarketSearchSectionProps> = ({ tokens, href, title }) => {
  return (
    <>
      <div className={style.sectionTitle}>{title} </div>
      <div className={style.section}>
        {tokens.map(token => (
          <MarketSearchToken id={token.id} title={token.symbol} href={href(token)} key={token.id} />
        ))}
      </div>
    </>
  );
};
