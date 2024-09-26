import { CRYPTO_PAYMENT } from '@/common/LocationPath';
import { ButtonSimple } from '@/components/Buttons/Buttons';
import Link from 'next/link';
import React from 'react';
import Card from '@/components/Card/Card';

import style from './CryptoPaymentGrid.module.css';

const CryptoPaymentGrid = (): JSX.Element => {
  return (
    <>
      <div className={style.wrap}>
        <div className={style.subtitleSection}>
          <Link href={CRYPTO_PAYMENT} target="_blank" rel="noopener noreferrer">
            <ButtonSimple color="green" size="small" className={style.btn}>
              Sign in
            </ButtonSimple>
          </Link>
        </div>

        <Card className={`${style.decentralized} ${style.cardCustomized}`}>
          <h3 className={style.title}>Decentralised</h3>
          <p className={style.content}>
            With decentralized crypto payment system users can pay with digital assets directly without intermediaries.
            The crypto payment gateway is powered by decentralized blockchain technology, ensuring transparency,
            security, and immutability of transactions.
          </p>
        </Card>

        <Card className={`${style.fundsAvailable} ${style.cardCustomized}`}>
          <h3 className={style.title}>Funds available </h3>
          <p className={style.content}>
            By implementing a crypto payment solution on the website, the seller can be assured that payments for goods
            and services will be received promptly in their cryptocurrency wallet.
          </p>
        </Card>

        <Card className={`${style.plugins} ${style.cardCustomized}`}>
          <h3 className={style.title}>Plugins</h3>
          <p className={style.content}>
            Integrate the crypto payment gateway into your existing infrastructure. With easy installation and
            configuration, our plugin empowers you to expand your payment options effortlessly.
          </p>
        </Card>

        <Card className={`${style.payWithAnyToken} ${style.cardCustomized}`}>
          <h3 className={style.title}>Pay with any token</h3>
          <p className={style.content}>
            The crypto payment processing allows users to make purchases using any token of their choice, while
            automatically converting the tokens for the convenience of sellers and buyers.
          </p>
        </Card>
      </div>
    </>
  );
};

export default CryptoPaymentGrid;
