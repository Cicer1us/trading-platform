import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AccountResponseObject,
  MarketResponseObject,
  OrderResponseObject,
  OrderStatus,
  PositionStatus,
  UserResponseObject,
  Trade,
} from '@dydxprotocol/v3-client';
import { OperationType, showNotification } from '@/common/dydxHelpers';

export type StepStatus = null | 'loading' | 'done';
export enum AllowanceStatus {
  Allowed = 'allowed',
  NotAllowed = 'notAllowed',
  InProgress = 'inProgress',
}
export type MarketsMap = { [market: string]: MarketResponseObject };
export type TradesMap = { [market: string]: Trade };

export interface IDydxDataState {
  user?: UserResponseObject;
  allowance: AllowanceStatus;
  depositTx?: string;
  account?: AccountResponseObject;
  accountStatus?: StepStatus;
  markets: MarketsMap;
  orders: OrderResponseObject[];
  totalMarginUsage?: number;
  totalMaintenanceMarginRequirement: number;
  accountLeverage?: number;
  lastTrades?: TradesMap;
}

const initialState: IDydxDataState = {
  user: null,
  account: null,
  accountStatus: null,
  markets: null,
  orders: [],
  totalMarginUsage: null,
  accountLeverage: null,
  totalMaintenanceMarginRequirement: null,
  allowance: AllowanceStatus.InProgress,
  depositTx: null,
  lastTrades: {},
};

const dydxDataSlice = createSlice({
  name: 'dydxData',
  initialState,
  reducers: {
    setUser: (state: IDydxDataState, { payload }: PayloadAction<UserResponseObject>) => {
      state.user = payload;
    },
    setAccount: (state: IDydxDataState, { payload }: PayloadAction<Record<string, any>>) => {
      const firstLoad = !!payload?.account;
      if (payload.account) {
        state.account = payload.account as AccountResponseObject;
      } else if (payload.accounts && payload.accounts.length > 0) {
        for (const [key, value] of Object.entries(payload.accounts[0])) {
          state.account[key] = value;
        }
      }

      if (payload.accounts && payload.transfers) {
        payload.transfers.forEach(transfer => {
          showNotification(OperationType.Transfer, transfer, false);
        });
      }

      if (payload.fills) {
        for (let i = 0; i < payload.fills.length; i++) {
          state.orders = state.orders.filter(order => order.id !== payload.fills[i].orderId);
          showNotification(OperationType.Fill, payload.fills[i], firstLoad);
        }
      }

      if (payload.orders) {
        const newOrders = [];
        for (let i = 0; i < payload.orders.length; i++) {
          const order = payload.orders[i];
          showNotification(OperationType.Order, order, firstLoad);
          if ((order.status === OrderStatus.CANCELED && !firstLoad) || order.status === OrderStatus.PENDING) {
            state.orders = state.orders.filter(oldOrder => oldOrder.id !== order.id);
          }
          if (
            (order.status === OrderStatus.FILLED && order.remainingSize > 0) ||
            order.status === OrderStatus.OPEN ||
            order.status === OrderStatus.UNTRIGGERED
          ) {
            newOrders.push(order);
          }
        }
        state.orders = state.orders.concat(newOrders);
      }

      if (payload.positions) {
        for (let i = 0; i < payload.positions.length; i++) {
          if (!state.account.openPositions[payload.positions[i]?.market]) {
            state.account.openPositions[payload.positions[i].market] = Object();
            state.account.openPositions[payload.positions[i].market].unrealizedPnl = '0.00';
          }
          for (const [key, value] of Object.entries(payload.positions[i])) {
            state.account.openPositions[payload.positions[i].market][key] = value;
          }
          if (
            payload.positions[i].status === PositionStatus.CLOSED ||
            payload.positions[i].status === PositionStatus.LIQUIDATED
          ) {
            delete state.account.openPositions[payload.positions[i].market];
          }
        }
      }

      if (state.accountStatus !== 'done') {
        state.accountStatus = 'done';
      }
    },
    setTotalMarginUsage: (state: IDydxDataState, { payload }: PayloadAction<number>) => {
      state.totalMarginUsage = payload;
    },
    setMarkets: (state: IDydxDataState, { payload }: PayloadAction<Record<string, unknown>>) => {
      if (payload.markets) {
        state.markets = payload.markets as MarketsMap;
      } else {
        for (const [key, value] of Object.entries(payload)) {
          for (const [innerKey, innerValue] of Object.entries(value)) {
            if (state?.markets?.[key]?.[innerKey]) {
              state.markets[key][innerKey] = innerValue;
            }
          }
        }
      }

      let positionsTotal = 0;
      if (state?.account?.openPositions && state?.markets && state?.account?.equity) {
        let initialMarginRequirement = 0;
        let maintenanceMarginRequirement = 0;
        for (const [key, value] of Object.entries(state.account.openPositions)) {
          const positionPrice = Number(value.size) * Number(state.markets[key].oraclePrice);
          positionsTotal += positionPrice;
          initialMarginRequirement += Math.abs(
            Number(value.size) *
              Number(state.markets[key].oraclePrice) *
              Number(state.markets[key].initialMarginFraction)
          );
          maintenanceMarginRequirement += Math.abs(
            Number(value.size) *
              Number(state.markets[key].oraclePrice) *
              Number(state.markets[key].maintenanceMarginFraction)
          );
        }
        state.totalMarginUsage = (initialMarginRequirement / Number(state?.account?.equity)) * 100;
        state.totalMaintenanceMarginRequirement = maintenanceMarginRequirement;
        state.account.freeCollateral = (Number(state?.account?.equity) - initialMarginRequirement).toString();
      }

      // Q is the account's USDC balance (note that Q may be negative). In the API, this is called quoteBalance
      // P is the oracle price for the market
      // S is the size of the position
      // Total Account Value = Q + Σ (Si × Pi)
      if (state?.account?.quoteBalance) {
        state.account.equity = (Number(state?.account?.quoteBalance) + positionsTotal).toString();
      }

      if (state?.account?.openPositions && state?.markets) {
        let total = 0;
        for (const [key, value] of Object.entries(state.account.openPositions)) {
          total += Math.abs(Number(value.size) * Number(state.markets[key].oraclePrice));
          if (value.side === 'LONG') {
            const unrealizedPnl =
              Number(value.size) * (Number(state.markets[key].indexPrice) - Number(value.entryPrice));
            state.account.openPositions[key].unrealizedPnl = unrealizedPnl.toString();
          } else {
            const unrealizedPnl =
              Number(value.size) * (Number(value.entryPrice) - Number(state.markets[key].indexPrice)) * -1;
            state.account.openPositions[key].unrealizedPnl = unrealizedPnl.toString();
          }
        }

        const newLeverage = total / Number(state.account.equity);
        if (newLeverage && total > 0) {
          state.accountLeverage = newLeverage;
        } else if (total === 0) {
          state.accountLeverage = undefined;
        }
      }
    },
    setDydxDataToInitial: (state: IDydxDataState) => {
      state.account = null;
      state.accountStatus = null;
      state.orders = [];
      state.totalMarginUsage = null;
      state.accountLeverage = null;
      state.totalMaintenanceMarginRequirement = null;
    },
    setDydxAuthStatus: (state: IDydxDataState, { payload }: PayloadAction<StepStatus>) => {
      state.accountStatus = payload;
    },
    setLastTrade: (state: IDydxDataState, { payload }: PayloadAction<{ market: string; trade: Trade }>) => {
      state.lastTrades[payload.market] = payload.trade;
    },
    setAllowance: (state: IDydxDataState, { payload }: PayloadAction<AllowanceStatus>) => {
      state.allowance = payload;
    },
    setDepositTx: (state: IDydxDataState, { payload }: PayloadAction<string>) => {
      state.depositTx = payload;
    },
  },
});

export default dydxDataSlice.reducer;

export const {
  setUser,
  setAccount,
  setMarkets,
  setDydxDataToInitial,
  setTotalMarginUsage,
  setDydxAuthStatus,
  setLastTrade,
  setAllowance,
  setDepositTx,
} = dydxDataSlice.actions;
