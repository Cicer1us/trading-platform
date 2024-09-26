import React from 'react';
import style from './TransactionLeverage.module.css';
import useMultilingual from '@/hooks/useMultilingual';
import Tab from '@/components/Tabs/Tab/Tab';
import TransactionTableTabs from '@/components/Tabs/TransactionTableTabs';
import { setTransactionLeverageTab, TabOption } from '@/redux/leverageSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks/reduxHooks';

const TabsOptions: Array<TabOption> = [TabOption.Positions, TabOption.Orders, TabOption.Trades];

const TransactionLeverageHeader = () => {
  const dispatch = useDispatch();
  const { t } = useMultilingual('transaction');

  const selectedTab = useAppSelector(({ leverage }) => leverage.transactionLeverageTab);

  const handleTabSwitch = (newTab: TabOption) => {
    dispatch(setTransactionLeverageTab(newTab));
  };

  return (
    <div className={style.header}>
      <div className={style.wrapperTabs}>
        <h3 className={style.title}>
          {selectedTab === TabOption.Positions && t('leverageTitlePositions')}
          {selectedTab === TabOption.Orders && t('leverageTitleOrders')}
          {selectedTab === TabOption.Trades && t('leverageTitleTrades')}
        </h3>
      </div>
      <TransactionTableTabs>
        {TabsOptions.map((item, index) => (
          <Tab
            key={`${item.length}-${index}`}
            handlerSelect={() => handleTabSwitch(item)}
            isActive={selectedTab === item}
          >
            {item}
          </Tab>
        ))}
      </TransactionTableTabs>
    </div>
  );
};

export default React.memo(TransactionLeverageHeader);
