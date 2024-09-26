import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { PriceRoute, SwapTxObj } from '@bitoftrade/bof-utils';
import { Token } from 'data/tokens/token.interface';
import { getTokenList } from '../data/tokens/tokenLists';
import { Chain, chainConfigs } from '../utils/chains';
import { AppState, AssetDirection, InputOptions, TokenList, TokenListMap, WidgetScreen } from './app.interface';
import { WidgetType } from './customisationSlice';
import { AVAILABLE_CHAINS } from '../constants';
import { ConnectionType } from 'utils/connections';
import { SELECTED_WALLET } from './redux.localStorage';

const generateTokenListMap = (): TokenListMap => {
  const tokenListMap: { [chain: string]: TokenList } = {};

  AVAILABLE_CHAINS.forEach(chain => {
    const tokens: Record<string, Token> = {};
    const nativeToken = chainConfigs[chain].nativeToken;
    tokens[nativeToken.address] = {
      ...nativeToken,
      address: nativeToken.address.toLowerCase(),
    };

    const tokenListArray = getTokenList(chain as Chain);
    let youReceiveToken = tokenListArray[0];
    tokenListArray.forEach(elem => {
      const address = elem.address.toLowerCase();
      tokens[address] = {
        ...elem,
        address,
      };
      if (elem.symbol === 'USDC') {
        youReceiveToken = elem;
      }
    });

    tokenListMap[chain] = {
      tokens,
      youPayToken: nativeToken.address.toLowerCase(),
      youReceiveToken: (youReceiveToken?.address ?? nativeToken.address).toLowerCase(),
      timestamp: Date.now(),
    };
  });

  return tokenListMap as TokenListMap;
};

const tokenListMap: TokenListMap = generateTokenListMap();

const getInitialSelectedWallet = (): ConnectionType | undefined => {
  const storedWallet = window.localStorage.getItem(SELECTED_WALLET) as ConnectionType;
  if (!storedWallet) return undefined;
  return storedWallet;
};

const initialState: AppState = {
  tokenListMap: tokenListMap,
  chainList: [Chain.Ethereum, Chain.Polygon, Chain.Avalanche, Chain.Bsc, Chain.Fantom],
  currentScreen: WidgetScreen.Default,
  youPay: { amount: '', locked: false, maxButton: true, loading: false, startingDirection: AssetDirection.Pay },
  youReceive: { amount: '', locked: true, loading: false, startingDirection: AssetDirection.Receive },
  priceRoute: null,
  // TODO: Consider moving to component
  buttonError: null,
  selectedChain: Chain.Ethereum,
  selectedWallet: getInitialSelectedWallet(),
  swapTxInProgress: false,
};

const switchInputs = (state: Draft<AppState>) => {
  const youPay = { ...state.youReceive, maxButton: state.youPay.maxButton };
  const youReceived = { ...state.youPay, maxButton: state.youReceive.maxButton };
  state.youPay = youPay;
  state.youReceive = youReceived;
  const chain = state.selectedChain;
  const youPayToken = state.tokenListMap[chain].youPayToken;
  state.tokenListMap[chain].youPayToken = state.tokenListMap[chain].youReceiveToken;
  state.tokenListMap[chain].youReceiveToken = youPayToken;
};

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setCurrentScreen: (state, { payload }: PayloadAction<WidgetScreen>) => {
      state.currentScreen = payload;
    },
    setSwapWidgetToken: (state, { payload }: PayloadAction<Token>) => {
      if (
        (state.currentScreen === WidgetScreen.SearchPayToken &&
          state.tokenListMap[state.selectedChain as Chain].youReceiveToken === payload.address) ||
        (state.currentScreen === WidgetScreen.SearchReceiveToken &&
          state.tokenListMap[state.selectedChain as Chain].youPayToken === payload.address)
      ) {
        switchInputs(state);
        state.currentScreen = WidgetScreen.Default;
        return;
      }

      if (state.currentScreen === WidgetScreen.SearchPayToken) {
        state.tokenListMap[state.selectedChain].youPayToken = payload.address;
      } else if (state.currentScreen === WidgetScreen.SearchReceiveToken) {
        state.tokenListMap[state.selectedChain].youReceiveToken = payload.address;
      }
      state.currentScreen = WidgetScreen.Default;
    },
    setSaleWidgetToken: (state, { payload }: PayloadAction<Token>) => {
      state.tokenListMap[state.selectedChain].youPayToken = payload.address;
      state.currentScreen = WidgetScreen.Default;
    },
    setWidgetType: (state, { payload }: PayloadAction<WidgetType>) => {
      const isLocked = payload === WidgetType.SALE;
      if (state.youPay.startingDirection === AssetDirection.Pay) {
        state.youReceive.locked = isLocked;
      } else {
        state.youPay.locked = isLocked;
      }
    },
    setYouReceiveToken: (state, { payload: { chain, token } }: PayloadAction<{ chain: Chain; token: Token }>) => {
      if (state.youPay.startingDirection === AssetDirection.Pay) {
        if (state.tokenListMap[chain].youPayToken === token.address) {
          state.tokenListMap[chain].youPayToken = chainConfigs[chain].nativeToken.address;
        }
        state.tokenListMap[chain].youReceiveToken = token.address;
      } else {
        if (state.tokenListMap[chain].youReceiveToken === token.address) {
          state.tokenListMap[chain].youReceiveToken = chainConfigs[chain].nativeToken.address;
        }
        state.tokenListMap[chain].youPayToken = token.address;
      }
    },
    setChainList: (state, { payload }: PayloadAction<Chain[]>) => {
      state.chainList = payload;
    },
    setSwitchInputs: state => {
      switchInputs(state);
    },
    setPay: (state, { payload }: PayloadAction<Partial<InputOptions>>) => {
      state.youPay = { ...state.youPay, ...payload };
    },
    setReceive: (state, { payload }: PayloadAction<Partial<InputOptions>>) => {
      state.youReceive = { ...state.youReceive, ...payload };
    },
    setPriceRoute: (state, { payload }: PayloadAction<PriceRoute | null>) => {
      state.priceRoute = payload;
      state.buttonError = null;
    },
    setTransactionObject: (state, { payload }: PayloadAction<SwapTxObj>) => {
      state.transaction = payload;
    },
    setButtonError: (state, { payload }: PayloadAction<string | null>) => {
      state.youReceive.loading = false;
      state.youPay.loading = false;
      state.buttonError = payload;
    },
    setSelectedChain: (state, { payload }: PayloadAction<Chain>) => {
      if (state.chainList.find(chain => chain === payload)) {
        state.selectedChain = payload;
      } else {
        state.selectedChain = Chain.Ethereum;
      }
    },
    setSelectedWallet: (state, { payload }: PayloadAction<ConnectionType | undefined>) => {
      state.selectedWallet = payload;
      if (payload) localStorage.setItem(SELECTED_WALLET, payload);
      else localStorage.removeItem(SELECTED_WALLET);
    },
    setSwapTxInProgress: (state, { payload }: PayloadAction<boolean>) => {
      state.swapTxInProgress = payload;
    },
    resetState: state => ({
      ...initialState,
      selectedChain: state.selectedChain,
    }),
  },
});

export default appSlice.reducer;

export const {
  setCurrentScreen,
  setSwapWidgetToken,
  setSaleWidgetToken,
  setYouReceiveToken,
  setChainList,
  setSwitchInputs,
  setPriceRoute,
  setPay,
  setReceive,
  setTransactionObject,
  setButtonError,
  setSelectedChain,
  setSelectedWallet,
  setWidgetType,
  setSwapTxInProgress,
  resetState,
} = appSlice.actions;
