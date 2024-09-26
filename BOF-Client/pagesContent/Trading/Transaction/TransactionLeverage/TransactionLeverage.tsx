import React from 'react';
import style from './TransactionLeverage.module.css';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import TransactionLeverageHeader from './TransactionLeverageHeader';
import { TabOption } from '@/redux/leverageSlice';
import PositionsTable from './PositionsTable';
import OrdersTable from './OrdersTable';
import TradesTable from './TradesTable';

const TransactionLeverage = () => {
  const equity = useAppSelector(({ dydxData }) => dydxData?.account?.equity);
  const authStep = useAppSelector(({ dydxAuth }) => dydxAuth.authStep);
  const selectedTab = useAppSelector(({ leverage }) => leverage.transactionLeverageTab);

  return (
    <>
      {equity && authStep >= 2 && (
        <div className={`${style.wrapper} boxStyle`}>
          <TransactionLeverageHeader />
          <div className={`${style.content}`}>
            {selectedTab === TabOption.Positions && <PositionsTable />}
            {selectedTab === TabOption.Orders && <OrdersTable />}
            {selectedTab === TabOption.Trades && <TradesTable />}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(TransactionLeverage);
