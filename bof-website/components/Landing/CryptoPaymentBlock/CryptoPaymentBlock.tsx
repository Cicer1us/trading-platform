import React from 'react';
import Card from '@/components/Card/Card';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import style from './CryptoPaymentBlock.module.css';

const CryptoPaymentBlock = (): JSX.Element => {
  return (
    <>
      <div className={style.wrap}>
        <Card className={style.styledCard}>
          <div className={style.contentWrap}>
            <span className={style.tag}>For business</span>

            <h2 className={style.header}>Crypto Payment</h2>
            <p className={style.content}>
              Crypto Payment System is an innovative crypto payment solution. This reliable payment method is designed
              for e-commerce and other companies that want to accept crypto tokens as payment for their goods and
              services.
            </p>

            <Link href={'/crypto-payment'} target="_blank" rel="noopener noreferrer">
              <ButtonSimple color="green" size="small" className={style.btn}>
                Learn more
              </ButtonSimple>
            </Link>
          </div>

          <div className={style.imgWrapper}>
            <Image
              src="/images/Landing/products/crypto-payment.svg"
              fill={true}
              alt="wallet and phone crypto payment"
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default CryptoPaymentBlock;
