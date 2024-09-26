import React, { useEffect } from 'react';
import style from './Trading.module.css';
import TransactionSwitch from './Transaction/TransactionSwitch';
import Widget from './Widget/Widget';
import collectVP from 'analytics/collectVP';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import useWindowSize from '@/hooks/useWindowSize';
import { TabsList } from '@/redux/redux.enum';
import { LeveragePairInformation } from './LeverageInfo/LeveragePairInformation';
import { AccountPortfolioInformation } from './LeverageInfo/AccountPortfolioInformation';
import { SyncTokensTabWithURL } from './SyncTokensTabWithURL';
import LeverageChart from '@/components/LeverageChart/LeverageChart';
import Chart from '@/components/Chart/Chart';

interface Size {
  width: number | undefined;
  height: number | undefined;
}

const Trading: React.FC = (): JSX.Element => {
  const isAuthorized = useAppSelector(({ dydxAuth }) => dydxAuth.authIsCompleted);
  const tab = useAppSelector(({ widget }) => widget.tab);
  const currentStep = useAppSelector(({ dydxAuth }) => dydxAuth.authStep);

  const windowSize: Size = useWindowSize();
  useEffect(() => collectVP(), []);
  return (
    <div className={style.wrapper}>
      {tab && (
        <SyncTokensTabWithURL>
          <div className={style.container}>
            <Widget />
            <div className={`${style.chartContainer} ${windowSize.width < 767 ? style.chartBalanceDeposit : ''}`}>
              {tab === TabsList.LEVERAGE && <LeveragePairInformation />}
              {isAuthorized && tab === TabsList.LEVERAGE && currentStep >= 2 && <AccountPortfolioInformation />}
              {tab === TabsList.LEVERAGE ? <LeverageChart /> : <Chart />}
            </div>
          </div>
        </SyncTokensTabWithURL>
      )}
      <TransactionSwitch />
    </div>
  );
};

export default Trading;
