import React from 'react';
import style from './Qualities.module.css';

const Qualities = (): JSX.Element => {
  return (
    <>
      <h2 className={style.whyHeadline}>Complete DeFi Platform</h2>
      <div className={style.whyWrap}>
        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/Landing/whyus/transparent.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>Transparent</div>
          <div className={style.whyContent}>
            There are no hidden exchange fees. You’ll receive a full summary of the fees you pay before the transaction
            is executed.
          </div>
        </div>

        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/Landing/whyus/secured.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>Secured</div>
          <div className={style.whyContent}>We are a fully decentralized exchange platform secured on chains.</div>
        </div>

        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/Landing/whyus/kyc.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>No KYC</div>
          <div className={style.whyContent}>
            You can use the bitoftrade features with your crypto wallet without verification and KYC.
          </div>
        </div>

        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/Landing/whyus/support.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>High-class support</div>
          <div className={style.whyContent}>
            We provide the best customer service with personal care and quick responses via user friendly channels.
          </div>
        </div>

        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/Landing/whyus/multichain.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>Multichain</div>
          <div className={style.whyContent}>
            bitoftrade platform utilizes solutions built on top of leading blockchains.
          </div>
        </div>

        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/Landing/whyus/fiat.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>Fiat Gateway</div>
          <div className={style.whyContent}>
            {'Buy & sell crypto for fiat. More than 40 traditional currencies and 250 cryptocurrencies are available.'}
          </div>
        </div>
      </div>
    </>
  );
};

export default Qualities;
