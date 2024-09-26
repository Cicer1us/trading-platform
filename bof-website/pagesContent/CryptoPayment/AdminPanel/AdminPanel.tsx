import React from 'react';
import Card from '@/components/Card/Card';

import style from './AdminPanel.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { CRYPTO_PAYMENT } from '@/common/LocationPath';
import { ButtonSimple } from '@/components/Buttons/Buttons';

const AdminPanel = (): JSX.Element => {
  return (
    <>
      <div className={style.wrap}>
        <Card className={style.styledCard}>
          <div className={style.contentWrap}>
            <h2 className={style.header}>Admin panel</h2>
            <p className={style.content}>
              With the admin panel, sellers can easily view and manage all crypto transactions on their website. Admin
              panel is a tool to monitor and control the crypto transactions happening within online business. This
              crypto payment gateway is simple to integrate and does not require any coding knowledge!
            </p>

            <Link href={CRYPTO_PAYMENT} target="_blank" rel="noopener noreferrer">
              <ButtonSimple color="green" size="small" className={style.btn}>
                Sign in
              </ButtonSimple>
            </Link>
          </div>

          <div className={style.imgWrapper}>
            <Image src="/images/crypto-payment/laptop.svg" fill={true} alt="laptop crypto payment" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminPanel;
