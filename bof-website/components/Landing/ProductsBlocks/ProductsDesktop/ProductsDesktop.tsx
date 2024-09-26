import React from 'react';
import Link from 'next/link';
import Card from '@/components/Card/Card';
import { ALLPAY, CROSS_CHAIN_MSG, TRADING_SWAP } from '@/common/LocationPath';
import style from './ProductsDesktop.module.css';
import { ButtonSimple } from '@/components/Buttons/Buttons';

const ProductsDesktop = (): JSX.Element => {
  return (
    <>
      <div className={style.sectionTitle}>What we build</div>
      <div className={style.wrap}>
        {/*cross chain protocol */}
        <Card className={style.crossChainProtocol}>
          <div className={style.tag}>For developers</div>
          <div className={style.title}>Cross-Chain Messaging Protocol</div>
          <p className={style.content}>Protocol which providers communication (Messaging) between chains.</p>
          <Link href={CROSS_CHAIN_MSG} target="_blank" rel="noopener noreferrer">
            <ButtonSimple color="green" size="small" className={style.btn}>
              Learn more
            </ButtonSimple>
          </Link>
        </Card>

        {/*cross chain swap */}
        <Card className={style.crossChainSwaps}>
          <div className={style.tag}>For traders</div>
          <div className={style.title}>Cross-chain trading</div>
          <p className={style.content}>
            Swap tokens between multiple blockchains with the lowest fees on the market, an intuitive UI, and complete
            transparency.
          </p>
          <Link href={''} target="_blank" rel="noopener noreferrer">
            <ButtonSimple color="green" size="small" className={style.btn}>
              Explore app
            </ButtonSimple>
          </Link>
        </Card>

        {/*Trading platform */}
        <Card className={`${style.tradingPlatform} ${style.tradingPlatform}`}>
          <div className={style.tag}>For traders</div>
          <div className={style.title}>Trading platform</div>
          <p className={style.content}>
            Decentralized multi-chain trading platform built on the Ethereum ecosystem to maximize efficiency of your
            crypto funds.
          </p>
          <Link href={TRADING_SWAP} target="_blank" rel="noopener noreferrer">
            <ButtonSimple color="green" size="small" className={style.btn}>
              Explore app
            </ButtonSimple>
          </Link>
        </Card>

        {/*AllPay Widget */}
        <Card className={`${style.AllPayWidget} ${style.AllPayImg}`}>
          <div className={style.widgetContent}>
            <div className={style.tag}>For business</div>
            <div className={style.title}>AllPay Widget</div>
            <p className={style.content}>
              A web object that works independently and can be embedded into any web page, allowing users to connect
              their wallet and invest any available token in the user’s balance for services or buy any other token or
              NFT without leaving the hosting site.
            </p>
            <Link href={ALLPAY} target="_blank" rel="noopener noreferrer">
              <ButtonSimple color="green" size="small" className={style.btn}>
                Explore app
              </ButtonSimple>
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
};

export default React.memo(ProductsDesktop);
