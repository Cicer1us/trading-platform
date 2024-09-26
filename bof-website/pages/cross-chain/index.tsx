import Discord from 'pagesContent/CrossChainProtocol/Discord/Discord';
import MainGrid from 'pagesContent/CrossChainProtocol/MainGrid/MainGrid';
import Qualities from 'pagesContent/CrossChainProtocol/Qualities/Qualities';
import Security from 'pagesContent/CrossChainProtocol/Security/Security';

import LandingFooter from 'components/Footer/Footer';
import MetaTags from '@/components/MetaTags/MetaTags';
import style from './CrossChainProtocol.module.css';
import WideLayout from '@/layouts/WideLayout/WideLayout';

const CrossChainProtocol = () => {
  return (
    <>
      <MetaTags
        title="Cross Chain Messaging Protocol"
        description="Cross chain messaging protocol, easy to integrate and start, build your own cross chain service with us."
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.com/cross-chain-protocol`}
      />

      <WideLayout>
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
      </WideLayout>
    </>
  );
};

export default CrossChainProtocol;
