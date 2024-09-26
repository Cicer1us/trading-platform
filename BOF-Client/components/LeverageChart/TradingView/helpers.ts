import store from '@/redux/store';
import { MAX_CANDLES_PER_REQUEST, Resolutions } from './config';
import { getMarketBySymbol } from '@/common/dydxHelpers';

interface MarketRequestParams {
  from: number;
  to: number;
  limit: number;
}

export const getLatestMarketPrice = (symbol: string): number | null => {
  const lastTrade = store.getState()?.dydxData?.lastTrades?.[getMarketBySymbol(symbol)];
  if (lastTrade) return Number(Number(lastTrade.price).toFixed(2));
  return null;
};

export const getFromToLimitDistribution = (
  from: number,
  to: number,
  limit: number,
  resolution: Resolutions
): MarketRequestParams[] => {
  if (limit <= MAX_CANDLES_PER_REQUEST) {
    return [{ from, to, limit }];
  }
  return getRequestsParamsDistribution(from, limit, resolution);
};

const getRequestsParamsDistribution = (from: number, limit: number, resolution: Resolutions): MarketRequestParams[] => {
  const offset = MAX_CANDLES_PER_REQUEST;
  const requestsAmount = Math.ceil(limit / offset);
  const requestsParams: MarketRequestParams[] = [];

  for (let i = 0; i < requestsAmount; i++) {
    const limitFrom = i * offset;
    const limitTo = limitFrom + offset;
    const candlesAmount = limitTo < limit ? offset : limit % offset;

    const fromTime = requestsParams[requestsParams.length - 1]?.to ?? from;
    const toTime = getLastCandleTimestamp(fromTime, candlesAmount, resolution);

    requestsParams.push({ from: fromTime, to: toTime, limit: candlesAmount });
  }

  return requestsParams;
};

const getLastCandleTimestamp = (from: number, offset: number, resolution: Resolutions): number => {
  if (resolution === Resolutions.THIRTY_MINS) return getLastCandleByThirtyMins(from, offset);
  if (resolution === Resolutions.FIFTEEN_MINS) return getLastCandleByFifteenMins(from, offset);
  if (resolution === Resolutions.ONE_HOUR) return getLastCandleByHours(from, offset);
  return getLastCandleByDays(from, offset);
};

const getLastCandleByFifteenMins = (from: number, offset: number) => {
  const fullHours = Math.round(offset / 4);
  const fifteenMins = offset % 4;

  const toTime = new Date(from);
  toTime.setHours(toTime.getHours() + fullHours);
  toTime.setMinutes(toTime.getMinutes() + fifteenMins * 15);
  return toTime.getTime();
};

const getLastCandleByThirtyMins = (from: number, offset: number): number => {
  const fullHours = Math.round(offset / 2);
  const thirtyMins = offset % 2;

  const toTime = new Date(from);
  toTime.setHours(toTime.getHours() + fullHours);
  toTime.setMinutes(toTime.getMinutes() + thirtyMins * 30);
  return toTime.getTime();
};

const getLastCandleByHours = (from: number, offset: number) => {
  const fullDays = Math.round(offset / 24);
  const hours = offset % 24;

  const toTime = new Date(from);
  toTime.setDate(toTime.getDate() + fullDays);
  toTime.setHours(toTime.getHours() + hours);
  return toTime.getTime();
};

const getLastCandleByDays = (from: number, offset: number) => {
  const toTime = new Date(from);
  toTime.setDate(toTime.getDate() + offset);
  return toTime.getTime();
};
