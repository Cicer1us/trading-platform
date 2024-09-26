import { TransactionReceipt } from '@ethersproject/providers';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type TransactionBase = {
  paymentId: string;
  from: string;
  chainId: number;
  hash: string;
  receipt?: TransactionReceipt;
};

export type PaymentTransaction = TransactionBase & {
  type: 'payment';
};

export type ApprovalTransaction = TransactionBase & {
  type: 'approval';
  tokenAddress: string;
  spender: string;
  amount?: string;
};

export type Transaction = PaymentTransaction | ApprovalTransaction;

type TransactionsState = {
  [account: string]: Transaction[];
};

const initialState: TransactionsState = {};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, { payload }: PayloadAction<Transaction>) => {
      const account = payload.from.toLowerCase();
      const currentState = state[account] ?? [];
      state[account] = [...currentState, payload];
    },
    addReceipt: (state, { payload }: PayloadAction<Pick<Transaction, 'chainId' | 'hash' | 'from' | 'receipt'>>) => {
      const account = payload.from.toLowerCase();
      state[account] =
        state[account]?.map(tx => {
          if (tx.hash === payload.hash) return { ...tx, receipt: payload.receipt };

          return tx;
        }) ?? [];
    }
  }
});

export const { addTransaction, addReceipt } = transactionsSlice.actions;

export default transactionsSlice.reducer;
