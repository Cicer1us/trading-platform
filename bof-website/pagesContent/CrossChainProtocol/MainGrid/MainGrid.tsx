import { CROSS_CHAIN_MSG_DOCS } from '@/common/LocationPath';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import Link from 'next/link';
import React from 'react';
import style from './MainGrid.module.css';
import Card from '@/components/Card/Card';

const MainGrid = (): JSX.Element => {
  return (
    <>
      <div className={style.wrap}>
        <div className={style.subtitleSection}>
          <Link href={CROSS_CHAIN_MSG_DOCS} target="_blank" rel="noopener noreferrer">
            <ButtonSimple color="green" size="small" className={style.btn}>
              Explore
            </ButtonSimple>
          </Link>
        </div>

        <Card className={`${style.howItWorks} ${style.cardCustomized}`}>
          <h3 className={style.title}>How does it work</h3>
          <p className={style.content}>
            {'Emit event -> get proof of your event -> use this proof to submit your transaction.'}
          </p>
          <div className={style.imgWrapper}>
            <img
              className={`${style.bannerImage}`}
              src="/images/cross-chain-landing/howItWorks.png"
              alt="how it works"
            />
          </div>
        </Card>

        <Card className={`${style.howWeUseIt} ${style.cardCustomized}`}>
          <h3 className={style.title}>How we use it</h3>
          <p className={style.content}>We utilize this protocol for our cross-chain trading feature.</p>
          <img
            className={`${style.bannerImage} ${style.howWeUseItImage}`}
            src="/images/cross-chain-landing/howWeUseIt.png"
            alt="how we use it"
          />
        </Card>

        <Card className={`${style.howYouUseIt} ${style.cardCustomized}`}>
          <h3 className={style.title}>How you can use it</h3>
          <p className={style.content}>
            Messaging protocol can be used in any case involving cross-chain interactions:
            <br />- inter-chain liquidity transfers <br />- NFT bridging <br />- custom cross-chain dApps
          </p>
          <div className={style.imgWrapper}>
            <img
              className={`${style.bannerImage}`}
              src="/images/cross-chain-landing/howyoucan.png"
              alt="you you can use it"
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default MainGrid;
