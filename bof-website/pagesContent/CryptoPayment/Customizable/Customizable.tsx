import React from 'react';
import Image from 'next/image';

import style from './Customizable.module.css';

const CustomizablePart = (): JSX.Element => {
  return (
    <>
      <h2 className={style.whyHeadline}>Customizable</h2>

      <div className={style.whyWrap}>
        <div className={style.cell}>
          <div className={style.whyIcon}>
            <Image width={32} height={32} src="/images/crypto-payment/widget.svg" alt="Image" loading="lazy" />
          </div>

          <div className={style.whyTitle}>Widget</div>
          <div className={style.whyContent}>
            The crypto payment gateway can be customized to seamlessly integrate with the website design, ensuring a
            cohesive user experience that matches the color scheme and style of the website.
          </div>
        </div>

        <div className={style.cell}>
          <div className={style.whyIcon}>
            <Image width={32} height={32} src="/images/crypto-payment/slippage-limit.svg" alt="Image" loading="lazy" />
          </div>

          <div className={style.whyTitle}>Slippage limit</div>
          <div className={style.whyContent}>
            The bitoftrade crypto payment gateway allows the buyer to set the maximum slippage. Slippage can be limited,
            and the purchase will be made only if the final price satisfies the buyer.
          </div>
        </div>

        <div className={style.cell}>
          <div className={style.whyIcon}>
            <Image
              width={32}
              height={32}
              src="/images/crypto-payment/multiple-networks.svg"
              alt="Image"
              loading="lazy"
            />
          </div>

          <div className={style.whyTitle}>Multiple networks</div>
          <div className={style.whyContent}>
            The advantage of accepting crypto payments on various blockchain networks is that merchants can accept
            payments on any network, while users have the convenience of transacting on different networks for their
            payment options.
          </div>
        </div>

        <div className={style.cell}>
          <div className={style.whyIcon}>
            <Image width={32} height={32} src="/images/crypto-payment/support.svg" alt="Image" loading="lazy" />
          </div>

          <div className={style.whyTitle}>Support</div>
          <div className={style.whyContent}>
            You have any questions regarding crypto payment solutions? Don&apos;t know how to accept crypto payments?
            The bitoftrade support team is here to help!
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizablePart;
