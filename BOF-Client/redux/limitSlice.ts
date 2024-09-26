import { Chains, chains } from 'connection/chainConfig';
import { convertFromWei } from '@/helpers/convertFromToWei';
import { LimitOrderStatus, LimitRaw, LimitOrder } from '@/interfaces/Limit.interface';
import { LimitSettings } from '@/interfaces/LimitSettings.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import getRawLimitOrders from 'API/limit/getLimitDeals';
import { batch } from 'react-redux';
import { AppThunk } from './store';
import { Token } from '@/interfaces/Tokens.interface';
import { AddApprove, RemoveApprove } from '@/interfaces/Swap.interface';

interface LimitState {
  limitOrders: LimitOrder[];
  settings: LimitSettings;
  pendingApproveHashes: Record<string, Record<string, string>>;
}

const initialState: LimitState = {
  limitOrders: [],
  settings: {},
  pendingApproveHashes: {},
};

const limitDealsSlice = createSlice({
  name: 'limit',
  initialState,
  reducers: {
    setLimitOrders: (state: LimitState, { payload }: PayloadAction<LimitOrder[]>) => {
      state.limitOrders = payload;
    },
    setLimitSettings: (state: LimitState, { payload }: PayloadAction<LimitSettings>) => {
      state.settings = payload;
    },
    addLimitApprove: (state: LimitState, { payload }: PayloadAction<AddApprove>) => {
      if (!state.pendingApproveHashes[payload.chainId]) {
        state.pendingApproveHashes[payload.chainId] = { [payload.address]: payload.txHash };
      } else {
        state.pendingApproveHashes[payload.chainId][payload.address] = payload.txHash;
      }
    },
    removeLimitApprove: (state: LimitState, { payload }: PayloadAction<RemoveApprove>) => {
      if (state.pendingApproveHashes?.[payload.chainId]?.[payload.address]) {
        delete state.pendingApproveHashes[payload.chainId][payload.address];
      }
    },
  },
});

export default limitDealsSlice.reducer;

export const { setLimitOrders, addLimitApprove, removeLimitApprove, setLimitSettings } = limitDealsSlice.actions;

export const updateLimitOrders = (): AppThunk => async (dispatch, getState) => {
  const { clientAddress, chainId } = getState().app;
  const { tokensList } = getState().widget;
  const tokens = tokensList[chainId];

  const rawLimitOrders = await getRawLimitOrders(clientAddress);

  const limitOrders = rawLimitOrders
    .filter(raw => {
      const tokenSent = tokens.some(token => token.address === raw.makerToken);
      const tokenReceived = tokens.some(token => token.address === raw.takerToken);
      return tokenSent && tokenReceived;
    })
    .map(order => formLimitOrder(order, tokens, Chains.MAINNET))
    .sort((a, b) => new Date(b.raw.createdAt).getTime() - new Date(a.raw.createdAt).getTime());

  dispatch(setLimitOrders(limitOrders));
};

export const setLimitCancellingStatusById =
  (id: number, hash: string): AppThunk =>
  async (dispatch, getState) => {
    const { limitOrders } = getState().limit;

    const deals = limitOrders.map(order => ({
      ...order,
      status: order.raw.id === id ? LimitOrderStatus.CANCELLING : order.status,
      hash: { hash, chainId: Chains.MAINNET },
    }));

    dispatch(setLimitOrders(deals));
  };

export const resetLimitOrders = (): AppThunk => dispatch => {
  batch(() => {
    dispatch(setLimitOrders(initialState.limitOrders));
  });
};

export const updateLimitOrder =
  (id: number, status: LimitOrderStatus): AppThunk =>
  (dispatch, getState) => {
    const { limitOrders } = getState().limit;
    const newOrders = limitOrders.map(deal => (deal.raw.id === id ? { ...deal, status } : { ...deal }));
    dispatch(setLimitOrders(newOrders));
  };

const formLimitOrder = (limit: LimitRaw, tokens: Token[], chainId: Chains): LimitOrder => {
  const srcToken = tokens.find(token => token.address === limit.makerToken);
  const destToken = tokens.find(token => token.address === limit.takerToken);

  const sentAmount = Number(convertFromWei(Number(limit.makerAmount), srcToken.decimals));
  const receivedAmount = Number(convertFromWei(Number(limit.takerAmount), destToken.decimals));
  const status = limit.status;

  const isExpired = Number(limit.expiry) < Date.now() / 1000;
  const dealStatus = status === LimitOrderStatus.OPEN && isExpired ? LimitOrderStatus.EXPIRED : status;

  const systemFee = limit.takerTokenFeeAmountUSD ?? 0;
  const gasFee = limit.takerGasFeeAmountUSD ?? 0;
  const fee = (systemFee + gasFee).toFixed(2);

  return {
    expiredAt: new Date(Number(limit.expiry) * 1000).toISOString(),
    status: dealStatus,
    feesUSD: `${fee} USD`,
    date: limit.createdAt,
    raw: limit,
    hash: {
      hash: limit?.transactionHash,
      chainId: chainId,
    },
    sentToken: {
      symbol: srcToken.symbol,
      logoURI: srcToken.logoURI,
      value: sentAmount,
    },
    receivedToken: {
      symbol: destToken.symbol,
      logoURI: destToken.logoURI,
      value: receivedAmount,
    },
  };
};
