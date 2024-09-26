import React from 'react';
import style from './Qualities.module.css';

const Qualities = (): JSX.Element => {
  return (
    <>
      <h2 className={style.whyHeadline}>Complete DeFi Platform</h2>
      <div className={style.whyWrap}>
        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/crosschain/qualities/easy.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>Easy start</div>
          <div className={style.whyContent}>
            Steep learning curve, no need to learn complicated concepts. Just drop it into your project.
          </div>
        </div>

        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/Landing/whyus/secured.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>Secure</div>
          <div className={style.whyContent}>Powered by threshold signatures scheme.</div>
        </div>

        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/crosschain/qualities/free.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>Free</div>
          <div className={style.whyContent}>
            {
              'With bitoftrade, you can freely integrate unique tools for crypto payments & transfers into your website.'
            }
          </div>
        </div>

        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/crosschain/qualities/evm.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>EVM-compatible</div>
          <div className={style.whyContent}>
            {'All popular networks: Ethereum, Avalanche, Polygon, Fantom, and BSC.'}
          </div>
        </div>

        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/crosschain/qualities/reliable.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>Reliable</div>
          <div className={style.whyContent}>
            Maintained by bitoftrade team good uptime / availability backward compatible.
          </div>
        </div>

        <div className={style.cell}>
          <img className={style.whyIcon} src="/images/crosschain/qualities/help.png" alt="Image" loading="lazy" />
          <div className={style.whyTitle}>Help is near</div>
          <div className={style.whyContent}>
            Join our Discord and we will help you to integrate it or troubleshoot your issues.
          </div>
        </div>
      </div>
    </>
  );
};

export default Qualities;
