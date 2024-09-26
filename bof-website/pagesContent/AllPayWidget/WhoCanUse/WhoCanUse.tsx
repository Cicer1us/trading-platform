import React from 'react';
import Card from '@/components/Card/Card';
import style from './WhoCanUse.module.css';
import Image from 'next/image';

const WhoCanUse = (): JSX.Element => {
  return (
    <>
      <h2 className={style.header}>Who can use our widget?</h2>

      <div className={style.wrap}>
        <Card className={style.gridThreshold}>
          <div className={style.contentWrap}>
            <Image
              className={`${style.bannerImage}`}
              width={72}
              height={72}
              src="/images/allpay-landing/tokenOwners.png"
              alt="token owner"
            />
            <h3 className={style.title}>Token owners</h3>
            <p className={style.content}>
              Samantha runs yield farming protocol. To interact with Samantha&apos;s protocol smart contracts, you need
              SYFP tokens which are traded in a number of DEXs.
            </p>
            <p className={style.content}>
              With an implemented and customized AllPay Widget, Samantha allows protocol users to buy SYFP tokens
              without leaving the site.
            </p>
          </div>
        </Card>

        <Card>
          <div className={style.contentWrap}>
            <Image
              width={72}
              height={72}
              className={`${style.bannerImage}`}
              src="/images/allpay-landing/creators.png"
              alt="token creators"
            />

            <h3 className={style.title}>Creators</h3>
            <p className={style.content}>
              Bob, a famous artist, has decided to create an NFT collection and wants to promote it on his website.
            </p>
            <p className={style.content}>
              He chose to use the AllPay Widget to pre-sell some of the collections goods on his website.
            </p>
          </div>
        </Card>

        <Card>
          <div className={style.contentWrap}>
            <Image
              width={72}
              height={72}
              className={`${style.bannerImage}`}
              src="/images/allpay-landing/metaverse.png"
              alt="metaverse"
            />

            <h3 className={style.title}>GameFi Metaverse</h3>
            <p className={style.content}>
              Xena and her friends are developing a Web3 game. Players are intended to buy and sell NFT items to improve
              their characters inside the game.
            </p>
            <p className={style.content}>
              With an implemented and customized AllPay Widget, Samantha allows protocol users to buy SYFP tokens
              without leaving the site.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default WhoCanUse;
