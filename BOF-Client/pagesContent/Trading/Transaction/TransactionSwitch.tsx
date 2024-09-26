import React from 'react';
import style from './TransactionSwitch.module.css';
import TransactionSwap from 'pagesContent/Trading/Transaction/TransactionSwap/TransactionSwap';
import TransactionLeverage from 'pagesContent/Trading/Transaction/TransactionLeverage/TransactionLeverage';
import TransactionLimit from 'pagesContent/Trading/Transaction/TransactionLimit/TransactionLimit';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import { useWeb3React } from '@web3-react/core';
import { TabsList } from '@/redux/redux.enum';
import TransactionCrossSwap from '../CrossChain/Table/TransactionCrossSwap';

const TransactionSwitch: React.FC = () => {
  const { account: clientAddress } = useWeb3React();
  const typeTrade = useAppSelector(({ widget }) => widget.tab);
  return (
    <div className={style.wrapper}>
      {clientAddress && typeTrade === TabsList.SWAP && <TransactionSwap />}
      {clientAddress && typeTrade === TabsList.LEVERAGE && <TransactionLeverage />}
      {clientAddress && typeTrade === TabsList.LIMIT && <TransactionLimit />}
      {clientAddress && typeTrade === TabsList.CROSS_CHAIN && <TransactionCrossSwap />}
    </div>
  );
};

export default React.memo(TransactionSwitch);
