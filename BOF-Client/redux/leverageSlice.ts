import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { calcLeverageAndUsdAmount, calcTokenAndUsdAmount } from '@/common/leverageCalculations';
import { OrderType } from '@dydxprotocol/v3-client';
import { setURLFirstTokenId, setURLSecondTokenId, setURLWidgetTab } from './widgetSlice';
import { TabsList } from './redux.enum';
import { BASIC_LEVERAGE_TOKEN } from '@/common/LeverageTradeConstants';

export interface Market {
  name: string;
}

export enum TimeRangeUnit {
  Min = 'minute',
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
}

export enum TabOption {
  Positions = 'Positions',
  Orders = 'Orders',
  Trades = 'Trades',
}

export type LeverageFieldFocus = 'usdAmount' | 'leverageLevel' | 'tokenAmount' | null;
interface LeverageState {
  orderType: OrderType;
  orderInProgress: boolean;
  orderError: string | null;
  leverageLevel: number;
  tokenAmount: number;
  usdAmount: number;
  limitPrice: number | string;
  timeRage: number | string;
  triggerPrice: number | string;
  timeRangeUnit: TimeRangeUnit;
  transactionLeverageTab: TabOption;
  markets: string[];
  selectedMarket: string;
}

const initialState: LeverageState = {
  orderInProgress: false,
  orderError: null,
  leverageLevel: null,
  tokenAmount: null,
  usdAmount: null,
  limitPrice: '',
  triggerPrice: '',
  orderType: OrderType.MARKET,
  timeRage: 28,
  timeRangeUnit: TimeRangeUnit.Day,
  transactionLeverageTab: TabOption.Positions,
  markets: ['ETH'],
  selectedMarket: 'ETH',
};

const leverageSlice = createSlice({
  name: 'leverage',
  initialState,
  reducers: {
    setMarkets: (state, { payload }: PayloadAction<string[]>) => {
      state.markets = payload;
    },
    setSelectedMarket: (state, { payload }: PayloadAction<string>) => {
      state.selectedMarket = payload.toUpperCase();
      syncLeverageWithURL(payload);
    },
    setOrderInProgress: (state, { payload }: PayloadAction<boolean>) => {
      state.orderInProgress = payload;
    },
    setLeverageOrderError: (state, { payload }: PayloadAction<string>) => {
      state.orderError = payload;
    },
    setLeverageLevel: (
      state,
      { payload }: PayloadAction<{ currentMarketPrice: number; leverageLevel: number; equity: number }>
    ) => {
      state.leverageLevel = payload.leverageLevel;
      const result = calcTokenAndUsdAmount(payload.currentMarketPrice, payload.leverageLevel, payload.equity);
      state.tokenAmount = result.assetAmount;
      state.usdAmount = result.usdAmount;
      state.orderError = null;
    },
    setTokenAmount: (
      state,
      { payload }: PayloadAction<{ currentMarketPrice: number; tokenAmount: number; equity: number }>
    ) => {
      state.tokenAmount = payload.tokenAmount;
      state.orderError = null;

      if (state.orderType !== OrderType.MARKET) {
        state.usdAmount = payload.tokenAmount * Number(state.limitPrice);
      } else {
        const result = calcLeverageAndUsdAmount(payload.currentMarketPrice, payload.tokenAmount, payload.equity);
        state.leverageLevel = result.leverageLevel;
        state.usdAmount = result.usdAmount;
      }
    },
    setUsdAmount: (
      state,
      { payload }: PayloadAction<{ usdAmount: number; currentMarketPrice: number; equity: number }>
    ) => {
      state.usdAmount = payload.usdAmount;
    },
    setLimitPrice: (state, { payload }: PayloadAction<number>) => {
      state.limitPrice = payload;
      state.usdAmount = Number(state.tokenAmount) * payload;
      state.orderError = null;
    },
    setOrderType: (state, { payload }: PayloadAction<OrderType>) => {
      state.orderType = payload;
      state.tokenAmount = null;
      state.usdAmount = null;
      state.leverageLevel = null;
      state.limitPrice = '';
      state.triggerPrice = '';
      state.timeRage = 28;
      state.timeRangeUnit = TimeRangeUnit.Day;
      state.orderError = null;
    },
    setTriggerPrice: (state, { payload }: PayloadAction<number>) => {
      state.triggerPrice = payload;
    },
    setTimeRange: (state, { payload }: PayloadAction<number>) => {
      state.timeRage = payload;
    },
    setTimeRangeUnit: (state, { payload }: PayloadAction<TimeRangeUnit>) => {
      state.timeRangeUnit = payload;
    },
    setTransactionLeverageTab: (state, { payload }: PayloadAction<TabOption>) => {
      state.transactionLeverageTab = payload;
    },
  },
});

export default leverageSlice.reducer;

export const {
  setMarkets,
  setSelectedMarket,
  setOrderInProgress,
  setLeverageOrderError,
  setLeverageLevel,
  setTokenAmount,
  setUsdAmount,
  setLimitPrice,
  setOrderType,
  setTriggerPrice,
  setTimeRange,
  setTimeRangeUnit,
  setTransactionLeverageTab,
} = leverageSlice.actions;

export const syncLeverageWithURL = (market: string) => {
  setURLFirstTokenId(market.toUpperCase());
  setURLSecondTokenId(BASIC_LEVERAGE_TOKEN.toUpperCase());
  setURLWidgetTab(TabsList.LEVERAGE);
};
