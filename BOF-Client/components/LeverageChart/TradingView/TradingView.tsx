import React, { useEffect, useRef, useState } from 'react';
import { widget, IChartingLibraryWidget } from '@/public/static/tradingview/charting_library';
import { candlesVisibleRangeToShift, container, defaultWidgetParams } from './config';
import datafeed from './datafeed';
import { DotLoader } from 'react-spinners';
import style from './TradingView.module.css';
import useMultilingual from '@/hooks/useMultilingual';

interface TradingViewProps {
  symbol: string;
}

const TradingView = ({ symbol }: TradingViewProps) => {
  const { t } = useMultilingual('chart');
  const tvWidget = useRef<IChartingLibraryWidget | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(false);
    const widgetOptions = { ...defaultWidgetParams, symbol: `DyDx:${symbol}` };
    tvWidget.current = new widget(widgetOptions);
    tvWidget?.current.onChartReady(() => {
      datafeed.onReady(moveCandlesToRight);
      setIsLoaded(true);
    });

    return () => tvWidget?.current.remove();
  }, [symbol]);

  const moveCandlesToRight = () => {
    const today = new Date();
    const [days, hours] = candlesVisibleRangeToShift[defaultWidgetParams.interval];
    const prevWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days, today.getHours() - hours);
    const from = prevWeek.getTime() / 1000;
    const to = today.getTime() / 1000;
    tvWidget.current?.chart().setVisibleRange({ from, to }, { applyDefaultRightMargin: false, percentRightMargin: 5 });
  };

  return (
    <>
      {!isLoaded && (
        <div className={style.loader}>
          <DotLoader size={80} color={'#38d9c0'} loading={true} />
          <p>{t('sryForWaiting')}</p>
        </div>
      )}
      <div id={container} style={{ display: isLoaded ? 'block' : 'none' }} />
    </>
  );
};

export default React.memo(TradingView);
