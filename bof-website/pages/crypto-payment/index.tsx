import MetaTags from '@/components/MetaTags/MetaTags';
import WideLayout from '@/layouts/WideLayout/WideLayout';

import Discord from 'pagesContent/CrossChainProtocol/Discord/Discord';
import LandingFooter from 'components/Footer/Footer';

import CryptoPaymentGrid from 'pagesContent/CryptoPayment/CryptoPaymentGrid/CryptoPaymentGrid';
import CustomizablePart from 'pagesContent/CryptoPayment/Customizable/Customizable';
import AdminPanel from 'pagesContent/CryptoPayment/AdminPanel/AdminPanel';

import style from './CryptoPayment.module.css';

const CrossChainProtocol = () => {
  return (
    <>
      <MetaTags
        title="Crypto Payment"
        description="Crypto Payment, secure crypto payment solution for prompt transactions. "
        image={`https://bitoftrade.com/images/newImages/logo.png`}
        url={`https://bitoftrade.com/crypto-payment`}
      />

      <WideLayout>
        <div className={style.wrapper}>
          <section className={`${style.section}`}>
            <h1 className={style.title}>Crypto Payment</h1>
            <p className={style.subtitle}>
              Secure crypto payment solution for prompt transactions. <br />
              Empower your online business with decentralized blockchain payments!
            </p>
            <CryptoPaymentGrid />
          </section>

          <section className={`${style.section} ${style.gradient}`}>
            <CustomizablePart />
          </section>

          <section className={style.section}>
            <AdminPanel />
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
