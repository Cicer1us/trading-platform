import { GuardianExchangeWidget } from '../Trading/GuardianExchangeWidget/GuardianExchangeWidget';
import React from 'react';
import style from './FiatExchange.module.css';

export const FiatExchange: React.FC = () => {
  return (
    <div className={style.content}>
      <GuardianExchangeWidget />
    </div>
  );
};
