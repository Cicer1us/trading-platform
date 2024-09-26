import { clientManager } from '@/common/DydxClientManager';
import {
  LibrarySymbolInfo,
  ResolutionString,
  PeriodParams,
  HistoryCallback,
  ResolveCallback,
  ErrorCallback,
  OnReadyCallback,
  IBasicDataFeed,
  SubscribeBarsCallback,
  Bar,
} from '@/public/static/tradingview/charting_library/charting_library';
import { Market } from '@dydxprotocol/v3-client';
import { configurationData, defaultSymbolParams, dyDxTradingViewResolution, Resolutions } from './config';
import { getFromToLimitDistribution, getLatestMarketPrice } from './helpers';
import { addChartListener, removeChartListener } from './streams';

const lastBars = new Map<string, Bar>();

const getMarketCandles = async (market: string, from: number, to: number, limit: number, resolution: Resolutions) => {
  const dydxMarket = Object.values(Market).find(v => v.split('-')[0] === market);
  const dydxResolution = dyDxTradingViewResolution[resolution];
  const requestsParams = getFromToLimitDistribution(from, to, limit, resolution as Resolutions);

  const requests = requestsParams.map(({ from, to, limit }) => {
    const fromISO = new Date(from).toISOString();
    const toISO = new Date(to).toISOString();

    return clientManager?.client?.public?.getCandles({
      market: dydxMarket,
      resolution: dydxResolution,
      limit,
      fromISO,
      toISO,
    });
  });

  const responses = await Promise.all(requests);
  const data = [];
  responses.forEach(({ candles }) => data.push(candles));
  return data.flat();
};

const datafeed: IBasicDataFeed = {
  onReady: (callback: OnReadyCallback) => {
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: () => null,

  resolveSymbol: async (symbolName: string, onResolve: ResolveCallback) => {
    const [exchange, market] = symbolName?.split(':');
    const ticker = `${market}-USD`;
    const symbolInfo = {
      ...defaultSymbolParams,
      ticker,
      full_name: ticker,
      name: market,
      description: market,
      exchange: exchange,
    };
    onResolve(symbolInfo);
  },

  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ) => {
    try {
      const symbol = symbolInfo.name;

      const from = periodParams.from * 1000;
      const to = periodParams.to * 1000;
      const limit = periodParams.countBack;

      const candles = await getMarketCandles(symbol, from, to, limit, resolution as Resolutions);

      const data = candles
        .map(can => ({
          volume: Number(can.usdVolume),
          time: new Date(can.startedAt).getTime(),
          low: Number(can.low),
          high: Number(can.high),
          open: Number(can.open),
          close: Number(can.close),
        }))
        .filter(can => can.time > from && can.time < to)
        .sort((a, b) => a.time - b.time);

      // sync last chart bar with leverage market
      if (periodParams.firstDataRequest) {
        const lastBar = data[data.length - 1];
        lastBar.close = getLatestMarketPrice(symbol) ?? lastBar.close;
        data[data.length - 1] = lastBar;
        lastBars.set(symbol, lastBar);
      }

      onResult(data, { noData: data.length === 0 });
    } catch (error) {
      onError(error);
    }
  },

  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string
  ) => {
    const lastBar = lastBars.get(symbolInfo.name);
    addChartListener(symbolInfo.name, resolution, listenerGuid, onTick, lastBar);
  },

  unsubscribeBars: (id: string) => {
    removeChartListener(id);
  },
};

export default datafeed;
