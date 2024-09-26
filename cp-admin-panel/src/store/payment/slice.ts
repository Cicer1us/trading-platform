import { createSlice } from '@reduxjs/toolkit';
import { USDC_TOKEN } from 'src/common/constants';
import { ChainId, ConnectionType, Token } from 'src/connection/types';
import Router from 'next/router';
import { AppDispatch } from '..';

export enum PaymentScreen {
  DEFAULT = 'DEFAULT',
  UNLOCK = 'UNLOCK',
  UNLOCK_WAITING = 'UNLOCK_WAITING',
  UNLOCK_SUCCESS = 'UNLOCK_SUCCESS',
  UNLOCK_ERROR = 'UNLOCK_ERROR',
  PAYMENT_WAITING = 'PAYMENT_WAITING',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  SEARCH_TOKEN = 'SEARCH_TOKEN'
}

interface PaymentState {
  screen: Record<string, PaymentScreen>;
  selectedChainId: ChainId;
  selectedToken: Token;
  selectedWallet: ConnectionType | undefined;
  selectedSlippage: number;
}

const initialState: PaymentState = {
  screen: {},
  selectedChainId: ChainId.MAINNET,
  selectedToken: USDC_TOKEN[ChainId.MAINNET],
  selectedWallet: undefined,
  selectedSlippage: 50
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setScreen: (state: PaymentState, { payload }: { payload: { screen: PaymentScreen; paymentId: string } }) => {
      state.screen[payload.paymentId] = payload.screen;
    },
    setSelectedChainId: (state: PaymentState, { payload }: { payload: ChainId }) => {
      state.selectedChainId = payload;
      state.selectedToken = USDC_TOKEN[payload];
    },
    setSelectedToken: (state: PaymentState, { payload }: { payload: Token }) => {
      state.selectedToken = payload;
    },
    setSelectedWallet: (state: PaymentState, { payload }: { payload: ConnectionType | undefined }) => {
      state.selectedWallet = payload;
    },
    setSelectedSlippage: (state: PaymentState, { payload }: { payload: number }) => {
      state.selectedSlippage = payload;
    }
  }
});

export const { setSelectedChainId, setSelectedToken, setSelectedWallet, setSelectedSlippage } = paymentSlice.actions;

export default paymentSlice.reducer;

export const setPaymentScreen = (screen: PaymentScreen) => async (dispatch: AppDispatch) => {
  const paymentId = Router.query.orderId as string;
  dispatch(paymentSlice.actions.setScreen({ screen, paymentId }));
};

export const selectSlippage = (state: { payment: PaymentState }) => state.payment.selectedSlippage;
