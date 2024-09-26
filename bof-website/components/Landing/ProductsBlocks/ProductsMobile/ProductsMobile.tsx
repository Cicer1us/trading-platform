import React from 'react';
import style from './ProductsMobile.module.css';
import Tab from './Tab/Tab';
import Tabs from './Tabs/Tabs';
import Card from '@/components/Card/Card';
import Link from 'next/link';
import { ButtonSimple } from '../../../Buttons/Buttons';
import { ALLPAY, CROSS_CHAIN_MSG, TRADING_SWAP } from '@/common/LocationPath';

const ProductsMobile = (): JSX.Element => {
  return (
    <>
      <div className={style.wrapper}>
        <Tabs>
          <Tab title="Developers">
            <Card className={style.background}>
              <div className={style.title}>Cross-Chain Messaging Protocol</div>
              <p className={style.content}>Protocol which providers communication (Messaging) between chains.</p>
              <Link href={CROSS_CHAIN_MSG} target="_blank" rel="noopener noreferrer">
                <ButtonSimple color="green" size="small" className={style.btn}>
                  Learn more
                </ButtonSimple>
              </Link>
            </Card>
          </Tab>
          <Tab title="Traders">
            <div className={style.tradersWrap}>
              <Card className={style.background}>
                <div className={style.title}>Cross-chain trading</div>
                <p className={style.content}>
                  Swap tokens between multiple blockchains with the lowest fees on the market, an intuitive UI, and
                  complete transparency.
                </p>
                <Link href={''} target="_blank" rel="noopener noreferrer">
                  <ButtonSimple color="green" size="small" className={style.btn}>
                    Explore app
                  </ButtonSimple>
                </Link>
              </Card>
              <Card className={style.background}>
                <div className={style.title}>Trading platform</div>
                <p className={style.content}>
                  Decentralized multi-chain trading platform built on the Ethereum ecosystem to maximize efficiency of
                  your crypto funds.
                </p>
                <Link href={TRADING_SWAP} target="_blank" rel="noopener noreferrer">
                  <ButtonSimple color="green" size="small" className={style.btn}>
                    Explore app
                  </ButtonSimple>
                </Link>
              </Card>
            </div>
          </Tab>
          <Tab title="Business">
            <Card className={style.background}>
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
            </Card>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default ProductsMobile;
