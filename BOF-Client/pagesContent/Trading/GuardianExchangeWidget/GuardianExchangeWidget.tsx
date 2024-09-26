import React from 'react';
import style from './GuardianExchangeWidhet.module.css';

export const GuardianExchangeWidget: React.FC = () => {
  return (
    <>
      <iframe
        name={'iFrameName'}
        className={style.iframe}
        src={
          'https://guardarian.com/calculator/v1?partner_api_token=c14d927f-cb01-4561-9520-28ec22c92709&default_fiat_amount=1000&default_fiat_currency=EUR&default_crypto_currency=btc'
        }
      />
    </>
  );
};
