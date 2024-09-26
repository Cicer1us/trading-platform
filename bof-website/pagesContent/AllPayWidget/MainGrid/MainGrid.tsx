import { ALLPAY_CUSTOMIZATION, ALLPAY_DOCS } from '@/common/LocationPath';
import { ButtonDark } from '@/components/Buttons/Buttons';
import Link from 'next/link';
import React from 'react';
import style from './MainGrid.module.css';
import Card from '@/components/Card/Card';

const MainGrid = (): JSX.Element => {
  return (
    <>
      <div className={style.wrap}>
        <div className={`${style.subtitleSection}`}>
          <div className={style.buttonWrapper}>
            <Link href={ALLPAY_CUSTOMIZATION} target="_blank" rel="noopener noreferrer">
              <ButtonDark color="green" size="middle" className={style.btn}>
                Setup Widget
              </ButtonDark>
            </Link>
          </div>

          <div className={style.buttonWrapper}>
            <Link href={ALLPAY_DOCS} target="_blank" rel="noopener noreferrer">
              <ButtonDark color="grayBlue" size="middle" className={style.btn}>
                Docs
              </ButtonDark>
            </Link>
          </div>
        </div>

        <Card className={`${style.cardMinHeight} ${style.customizeDesign}`}>
          <h3 className={style.title}>Customizable design</h3>
          <p className={style.content}>Adjust the widget to your brand colors, choose what networks to work with.</p>
          <img
            className={`${style.bannerImage} ${style.settingsImage}`}
            src="/images/allpay-landing/settings.png"
            alt="setting image"
          />
        </Card>

        <Card className={`${style.cardMinHeight} ${style.buyWithAnyToken}`}>
          <h3 className={style.title}>Buy with any token</h3>
          <p className={style.content}>
            The widget allows users to connect their wallet and buy crypto assets with any available token on their
            balance.
          </p>
          <img
            className={`${style.bannerImage} ${style.nftImage}`}
            src="/images/allpay-landing/tokens.png"
            alt="tokens image"
          />
        </Card>

        <Card className={`${style.cardMinHeight} ${style.nftBanner}`}>
          <h3 className={style.title}>NFT</h3>
          <p className={style.content}>List your NFTs and allow your users to buy it not crushing the UX.</p>
          <img
            className={`${style.bannerImage} ${style.nftImage}`}
            src="/images/allpay-landing/nft.png"
            alt="nfts on screen image"
          />
        </Card>

        <Card className={`${style.cardMinHeight} ${style.networks}`}>
          <h3 className={style.title}>5 networks</h3>
          <p className={style.content}>Ethereum, Polygon, Fantom, Avalanche, BSC are available for the widget users.</p>
        </Card>
      </div>
    </>
  );
};

export default MainGrid;
