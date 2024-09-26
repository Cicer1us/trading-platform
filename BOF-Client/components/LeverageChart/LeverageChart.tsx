import React from 'react';
import { useAppSelector } from '@/redux/hooks/reduxHooks';
import dynamic from 'next/dynamic';
import style from './LeverageChart.module.css';

const TradingView = dynamic(() => import('./TradingView/TradingView'), { ssr: false });

const LeverageChart = () => {
  const market = useAppSelector(({ leverage }) => leverage.selectedMarket);

  return (
    <div className={`${style.leverageChart} boxStyle`}>
      <TradingView symbol={market} />
    </div>
  );
};

export default React.memo(LeverageChart);
