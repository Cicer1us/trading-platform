import Discord from '@/components/Crosschain/Discord/Discord';
import MainGrid from '@/components/Crosschain/MainGrid/MainGrid';
import Qualities from '@/components/Crosschain/Qualities/Qualities';
import Security from '@/components/Crosschain/Security/Security';
import React from 'react';
import style from './CrossChainProtocol.module.css';
import LandingFooter from 'components/Footer/Footer';
import MetaTags from '@/components/MetaTags/MetaTags';

const CrossChainProtocol = (): JSX.Element => {
  return (
    <>
      <MetaTags
        title="Cross Chain Messaging Protocol"
        description="Cross chain messaging protocol, easy to integrate and start, build your own cross chain service with us."
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.com/cross-chain-protocol`}
      />
      <div className={style.wrapper}>
        <section className={`${style.section} ${style.gradient}`}>
          <h1 className={style.title}>
            Cross-Chain <br /> Messaging Protocol
          </h1>
          <p className={style.subtitle}>
            A tool for building secure services and dApps that can send messages across multiple chains. <br /> Build
            your cross-chain service with us!
          </p>
          <MainGrid />
        </section>

        <section className={`${style.section} ${style.gradient}`}>
          <Qualities />
        </section>

        <section className={style.section}>
          <Security />
        </section>

        <section className={style.FooterSection}>
          <Discord />
          <LandingFooter />
        </section>
      </div>
    </>
  );
};

export default React.memo(CrossChainProtocol);
