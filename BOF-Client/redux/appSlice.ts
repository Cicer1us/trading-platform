import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, ThemeColorEnum } from '@/interfaces/AppState.interface';
import { chains, Chains } from 'connection/chainConfig';
import { getMultiChainMultipleBalances, getMultipleBalances } from '@/helpers/getMultipleBalances';
import { CHAIN_ID, LANGUAGE, SELECTED_WALLET } from './redux.localStorage';
import { getLocalStorageValue } from '@/helpers/getLocalStorageValue';
import { TabsList } from './redux.enum';
import { RootState } from './store';
import { availableChainsCrossSwap } from '@/common/constants';
import { ConnectionType } from 'connection/connectors';

const getDefaultChainId = () => {
  const localValue = getLocalStorageValue(CHAIN_ID);
  if (!localValue || !Number.isInteger(localValue) || !chains[localValue]) return Chains.MAINNET;
  return Number(localValue);
};

const getDefaultSelectedWallet = (): ConnectionType | undefined => {
  const localValue = getLocalStorageValue(SELECTED_WALLET) as ConnectionType;
  if (!localValue || !Object.values(ConnectionType).includes(localValue)) return undefined;
  return localValue;
};

const initialState: AppState = {
  selectedWallet: getDefaultSelectedWallet(),
  theme: ThemeColorEnum.DARK,
  clientAddress: '',
  balances: Object.keys(chains).reduce((acc, chainId) => ({ ...acc, [chainId]: {} }), {}),
  language: 'en',
  chainId: getDefaultChainId(),
};

export const balancesSelector = ({ app }) => {
  const chainId = app.chainId;
  const balances = app.balances;
  return balances[chainId] ?? {};
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateSelectedWallet(state, { payload: { wallet } }: { payload: { wallet: ConnectionType } }) {
      state.selectedWallet = wallet;
      if (wallet) localStorage.setItem(SELECTED_WALLET, wallet);
      else localStorage.removeItem(SELECTED_WALLET);
    },
    setTheme: (state, { payload }: PayloadAction<ThemeColorEnum>) => {
      localStorage.setItem('theme', payload);
      state.theme = payload;
    },
    toggleTheme: state => {
      if (state.theme === ThemeColorEnum.DARK) {
        localStorage.setItem('theme', ThemeColorEnum.LIGHT);
        state.theme = ThemeColorEnum.LIGHT;
      } else {
        localStorage.setItem('theme', ThemeColorEnum.DARK);
        state.theme = ThemeColorEnum.DARK;
      }
    },
    setClientAddress: (state, { payload }: PayloadAction<string>) => {
      sessionStorage.setItem('clientAddress', payload);
      state.clientAddress = payload;
    },
    setBalance: (state, { payload }: PayloadAction<{ address: string; balance: number; chainId: number }>) => {
      if (state.balances[payload.chainId]) {
        state.balances[payload.chainId][payload.address] = payload.balance;
      }
    },
    setBalances: (state, { payload }: PayloadAction<Record<number, Record<string, number>>>) => {
      state.balances = payload;
    },
    setLanguage: (state, { payload }: PayloadAction<string>) => {
      localStorage.setItem(LANGUAGE, payload);
      state.language = payload;
    },
    setCurrentChainId: (state, { payload }: PayloadAction<Chains>) => {
      if (chains[payload]) {
        localStorage.setItem(CHAIN_ID, payload.toString());
      }
      state.chainId = payload;
    },
    resetBalances: state => {
      state.balances = initialState.balances;
    },
  },
});

export default appSlice.reducer;

export const {
  toggleTheme,
  setTheme,
  setClientAddress,
  setBalances,
  setLanguage,
  setCurrentChainId,
  resetBalances,
  setBalance,
  updateSelectedWallet,
} = appSlice.actions;

export const updateBalances = () => async (dispatch, getState: () => RootState) => {
  const { clientAddress, balances, chainId } = getState().app;
  const { tokensList, tab } = getState().widget;

  if (clientAddress) {
    if (tab !== TabsList.CROSS_CHAIN) {
      const tokens = tokensList[chainId];
      // TODO: maybe update only chains from selectedTokenA | selectedTokenB ??
      const newBalances = await getMultipleBalances(clientAddress, tokens, chainId);
      dispatch(setBalances({ ...balances, [chainId]: newBalances }));
    } else {
      const tokens = availableChainsCrossSwap.reduce((total, chain) => {
        total[chain] = tokensList[chain];
        return total;
      }, {});
      const multiChainBalances = await getMultiChainMultipleBalances(clientAddress, tokens);
      dispatch(setBalances(multiChainBalances));
    }
  }
};
