import MainGrid from 'pagesContent/AllPayWidget/MainGrid/MainGrid';

import Discord from 'pagesContent/CrossChainProtocol/Discord/Discord';

import LandingFooter from 'components/Footer/Footer';
import MetaTags from '@/components/MetaTags/MetaTags';
import WideLayout from '@/layouts/WideLayout/WideLayout';

import style from './AllPayWidget.module.css';
import WhoCanUse from 'pagesContent/AllPayWidget/WhoCanUse/WhoCanUse';

const AllPayWidget = () => {
  return (
    <>
      <MetaTags
        title="AllPay Widget"
        description="Welcome to the bitoftrade Widget. It can be embedded into any webpage, enabling your users to link their wallets, make cryptocurrency payments, trade fungible tokens, and purchase NFT all without ever leaving the hosting website."
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://allpay.bitoftrade.com/`}
      />

      <WideLayout>
        <div className={style.wrapper}>
          <section className={`${style.section} ${style.gradient}`}>
            <h1 className={style.title}>AllPay Widget</h1>
            <p className={style.subtitle}>Buy & sell crypto assets directly on your website.</p>
            <MainGrid />
          </section>

          <section className={`${style.section} ${style.gradient}`}>
            <WhoCanUse />
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

export default AllPayWidget;
