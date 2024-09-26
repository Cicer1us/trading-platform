import store from '@/redux/store';
import { Bar, SubscribeBarsCallback } from '@/public/static/tradingview/charting_library/charting_library';
import { Unsubscribe } from '@reduxjs/toolkit';
import { Resolutions } from './config';
import { getMarketBySymbol } from '@/common/dydxHelpers';
import dayjs from 'dayjs';

interface MarketSubs {
  id: string;
  resolution: string;
  lastBar: Bar;
  handler: SubscribeBarsCallback;
  unsubscribe: Unsubscribe;
}

const subs = new Map<string, MarketSubs>();

export const addChartListener = (
  market: string,
  resolution: string,
  id: string,
  onTick: SubscribeBarsCallback,
  lastBar: Bar
) => {
  const sub = subs.get(market);

  const onPriceChange = (price: number) => {
    const updatedBar = getUpdatedBar(market, price);
    updateLastBar(market, updatedBar);
  };

  if (!sub || id !== sub?.id) {
    sub?.unsubscribe();
    const uns = createStoreListener(market, onPriceChange);
    subs.set(market, { id, resolution, lastBar, handler: onTick, unsubscribe: uns });
  }
};

const updateLastBar = (market: string, bar: Bar) => {
  const sub = subs.get(market);
  subs.set(market, { ...sub, lastBar: bar });
  sub.handler(bar);
};

const getUpdatedBar = (market: string, price: number): Bar => {
  const sub = subs.get(market);
  const lastBar = sub.lastBar;
  const nextBarTimestamp = getNextBarTimestamp(market);

  if (lastBar.time !== nextBarTimestamp) {
    return {
      time: nextBarTimestamp,
      open: lastBar.close,
      high: price,
      low: price,
      close: price,
    };
  }

  return {
    ...lastBar,
    high: Math.max(lastBar.high, price),
    low: Math.min(lastBar.low, price),
    close: price,
  };
};

const getNextBarTimestamp = (market: string): number => {
  const { lastBar, resolution } = subs.get(market);
  const nextBar = new Date(lastBar.time);

  if (resolution === Resolutions.FIFTEEN_MINS) nextBar.setMinutes(nextBar.getMinutes() + 15);
  if (resolution === Resolutions.THIRTY_MINS) nextBar.setMinutes(nextBar.getMinutes() + 30);
  if (resolution === Resolutions.ONE_HOUR) nextBar.setHours(nextBar.getHours() + 1);
  if (resolution === Resolutions.ONE_DAY) nextBar.setDate(nextBar.getDate() + 1);

  const currentTime = new Date().getTime();
  const nextBarTime = nextBar.getTime();

  return currentTime > nextBarTime ? nextBarTime : lastBar.time;
};

const createStoreListener = (symbol: string, callback: (price: number) => void): Unsubscribe => {
  const currentMarket = getMarketBySymbol(symbol);
  // const selector = ({ dydxData }) => dydxData.lastTrades[getMarketBySymbol(symbol)];

  // use same selector as for LeveragePairInformation:price
  const selector = ({ dydxData }): number => {
    const lastTimeUpdatedMinutesAgo = dayjs().diff(dayjs(dydxData?.lastTrades?.[currentMarket]?.createdAt), 'seconds');
    if (lastTimeUpdatedMinutesAgo > 60) {
      return dydxData?.markets?.[currentMarket].indexPrice;
    } else {
      return dydxData?.lastTrades?.[currentMarket]?.price;
    }
  };
  let prevPrice = null;

  const createMarketListener = () => {
    const state = store.getState();
    const lastPrice = selector(state);
    if (lastPrice) {
      const currentPrice = Number(lastPrice);

      if (currentPrice !== prevPrice) {
        prevPrice = currentPrice;
        callback(currentPrice);
      }
    }
  };

  return store.subscribe(createMarketListener);
};

export const removeChartListener = (id: string) => {
  for (const [key, sub] of subs.entries()) {
    if (sub.id === id) {
      sub.unsubscribe();
      subs.delete(key);
    }
  }
};
