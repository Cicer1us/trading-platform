import { TRADING } from '@/common/LocationPath';
import { Chains, chains } from 'connection/chainConfig';
import { getLocalStorageValue } from '@/helpers/getLocalStorageValue';
import { isToken } from '@/helpers/isToken';
import topLists from '@/helpers/topLists';
import { Token } from '@/interfaces/Tokens.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { syncLeverageWithURL } from './leverageSlice';
import { TabsList, WidgetList } from './redux.enum';
import { CUSTOM_TOKENS, TAB } from './redux.localStorage';
import { RootState } from './store';

export enum SelectTokenModal {
  FIRST_INPUT = 'FIRST_INPUT',
  SECOND_INPUT = 'SECOND_INPUT',
  CLOSED = 'CLOSED',
}

export const longListSelector = ({ widget, app }: RootState) => {
  const chainId = app.chainId;
  const tokens = widget.tokensList;
  return tokens[chainId] ?? [];
};

interface WidgetState {
  selectTokenModal: SelectTokenModal;
  isBuy: boolean;
  tabs: Array<string>;
  tab: TabsList;
  tokensList: Record<number, Token[]>;
  tokensListIsLoaded: boolean;
  selectedTokenA: Token | null;
  selectedTokenB: Token | null;
  list: WidgetList;
  symbolToLogoUriMap: Record<string, string>;
}

const addCustomTokenToLocalStorage = (chainId: Chains, token: Token) => {
  const customTokens = getLocalStorageValue(CUSTOM_TOKENS) ?? {};
  if (customTokens[chainId] && !customTokens[chainId][token.address]) {
    customTokens[chainId][token.address] = token;
  } else {
    customTokens[chainId] = { [token.address]: token };
  }
  localStorage.setItem(CUSTOM_TOKENS, JSON.stringify(customTokens));
};

const getInitTokensList = () => {
  const tokensList = {};
  const customTokens = getLocalStorageValue(CUSTOM_TOKENS) ?? {};
  Object.keys(chains).forEach(chainId => {
    if (customTokens[chainId]) {
      const tokens = Object.values(customTokens[chainId]).filter(token => isToken(token));
      tokensList[chainId] = [...tokens];
    } else {
      tokensList[chainId] = [];
    }
  });
  return tokensList;
};

const getUniqueSymbolToLogoUriMap = (tokensList: Record<number, Token[]>): Record<string, string> => {
  const map = {};
  for (const token of Object.values(tokensList).flat()) {
    const key = token?.symbol;
    const value = token?.logoURI;
    if (!map[key] && value) {
      map[key] = value;
    }
  }
  return map;
};

const initialState: WidgetState = {
  tokensListIsLoaded: false,
  selectTokenModal: SelectTokenModal.CLOSED,
  list: WidgetList.ALL,
  isBuy: false,
  tabs: Object.values(TabsList),
  tab: TabsList.SWAP,
  tokensList: getInitTokensList(),
  selectedTokenA: null,
  selectedTokenB: null,
  symbolToLogoUriMap: {},
};

const widgetSlice = createSlice({
  name: 'widget',
  initialState,
  reducers: {
    setSelectTokenModal: (state: WidgetState, { payload }: PayloadAction<SelectTokenModal>) => {
      state.selectTokenModal = payload;
    },
    setTokensList: (state: WidgetState, { payload }: PayloadAction<Record<number, Token[]>>) => {
      if (!state.tokensListIsLoaded) {
        Object.keys(state.tokensList).forEach(chainId => {
          if (chainId === String(Chains.GOERLI)) {
            state.tokensList[Chains.GOERLI] = [...state.tokensList[Chains.MAINNET], ...payload[Chains.MAINNET]];
          } else {
            state.tokensList[chainId] = [...state.tokensList[chainId], ...payload[chainId]];
          }
        });
        state.symbolToLogoUriMap = getUniqueSymbolToLogoUriMap(payload);
        state.tokensListIsLoaded = true;
      }
    },
    // use this for token selection without changing chainId
    setSelectedTokenA: (state: WidgetState, { payload }: PayloadAction<Token>) => {
      if (state.tab === TabsList.CROSS_CHAIN) {
        state.selectedTokenA = payload;
        setURLFirstTokenId(payload.address.toLowerCase());
      } else {
        // switch tokens if new token A equals token B
        if (state?.selectedTokenB?.address === payload?.address) {
          state.selectedTokenB = state.selectedTokenA;
          setURLSecondTokenId(state.selectedTokenA.address.toLowerCase());
        }
        if (state.selectedTokenA?.address !== payload?.address) {
          state.selectedTokenA = payload;
          setURLFirstTokenId(payload.address.toLowerCase());
        }
      }
    },
    // use this for token selection without changing chainId
    setSelectedTokenB: (state: WidgetState, { payload }: PayloadAction<Token>) => {
      if (state.tab === TabsList.CROSS_CHAIN) {
        state.selectedTokenB = payload;
        setURLSecondTokenId(payload.address.toLowerCase());
      } else {
        // switch tokens if new token B equals token A
        if (state?.selectedTokenA?.address === payload?.address) {
          state.selectedTokenA = state.selectedTokenB;
          setURLFirstTokenId(state.selectedTokenB.address.toLowerCase());
        }
        if (state.selectedTokenB?.address !== payload?.address) {
          state.selectedTokenB = payload;
          setURLSecondTokenId(payload.address.toLowerCase());
        }
      }
    },
    // use this for cross-chain tokens selection
    setSelectedTokens: (state: WidgetState, { payload }: PayloadAction<{ tokenA: Token; tokenB: Token }>) => {
      state.selectedTokenA = payload.tokenA;
      state.selectedTokenB = payload.tokenB;
      setURLFirstTokenId(payload.tokenA.address.toLowerCase());
      setURLSecondTokenId(payload.tokenB.address.toLowerCase());
    },
    setIsBuy: (state: WidgetState, { payload }: PayloadAction<boolean>) => {
      state.isBuy = payload;
    },
    addCustomToken: (
      state: WidgetState,
      { payload: { chainId, token } }: PayloadAction<{ chainId: Chains; token: Token }>
    ) => {
      state.tokensList[chainId].push(token);
      addCustomTokenToLocalStorage(chainId, token);
    },
    setTab: (state: WidgetState, { payload }: PayloadAction<TabsList>) => {
      state.tab = payload;
      localStorage.setItem(TAB, payload);
      setURLWidgetTab(payload);
    },
    setWidgetList: (state: WidgetState, { payload }: PayloadAction<WidgetList>) => {
      state.list = payload;
    },
  },
});

export default widgetSlice.reducer;

export const {
  addCustomToken,
  setSelectTokenModal,
  setIsBuy,
  setTab,
  setSelectedTokenA,
  setSelectedTokenB,
  setTokensList,
  setWidgetList,
  setSelectedTokens,
} = widgetSlice.actions;

export const setCurrentTab = (tab: TabsList) => (dispatch, getState) => {
  const { chainId } = getState().app;
  const { tokensList, selectedTokenA, selectedTokenB } = getState().widget;
  const tokens = tokensList[chainId];
  const nativeToken = chains[chainId].nativeToken.symbol;

  if (!selectedTokenA || !selectedTokenB) {
    dispatch(setDefaultTokens(tab));
    return;
  }

  if (tab === TabsList.LIMIT && selectedTokenA.symbol === nativeToken && chainId === Chains.MAINNET) {
    const topToken = topLists[chainId].find(t => t !== nativeToken && t !== selectedTokenB.symbol);
    const tokenA = tokens.find(token => token?.symbol === topToken);

    dispatch(setSelectedTokenA(tokenA));
  }

  if (tab === TabsList.LIMIT && selectedTokenB.symbol === nativeToken && chainId === Chains.MAINNET) {
    const topToken = topLists[chainId].find(t => t !== nativeToken && t !== selectedTokenA.symbol);
    const tokenB = tokens.find(token => token?.symbol === topToken);
    dispatch(setSelectedTokenB(tokenB));
  }

  dispatch(setTab(tab));
  dispatch(syncTokensWithURL());
};

export const syncTokensWithURL = () => (dispatch, getState) => {
  const { selectedMarket } = getState().leverage;
  const { tab, selectedTokenA, selectedTokenB } = getState().widget;
  if (tab === TabsList.LEVERAGE) {
    syncLeverageWithURL(selectedMarket);
  } else {
    setURLWidgetTab(tab);
    setURLFirstTokenId(selectedTokenA.address);
    setURLSecondTokenId(selectedTokenB.address);
  }
};

export const setDefaultTokens = (tab: TabsList) => (dispatch, getState) => {
  const getFirstTopToken = (chainId: Chains, tokens: Token[]): Token | null => {
    for (const symbol of topLists[chainId]) {
      const token = tokens.find(token => token.symbol === symbol);
      if (token) return token;
    }
    return null;
  };

  const { chainId } = getState().app;
  const { tokensList } = getState().widget;
  const tokens = tokensList[chainId];
  const tokenA = getFirstTopToken(chainId, tokens);
  const tokenB = tokens.find(t => t.symbol === chains[chainId].nativeToken.symbol);

  dispatch(setSelectedTokenA(tokenA));
  dispatch(setSelectedTokenB(tokenB));
  dispatch(setTab(tab));
};

export const setURLWidgetTab = (tab: TabsList) => {
  if (window) {
    updateUrlPathByIndex(4, tab.toLocaleLowerCase());
  }
};

export const setURLFirstTokenId = (tokenId: string) => {
  if (window) {
    updateUrlPathByIndex(5, tokenId);
  }
};

export const setURLSecondTokenId = (tokenId: string) => {
  if (window) {
    updateUrlPathByIndex(6, tokenId);
  }
};

export const isTradingPage = path => {
  const tradingPath = TRADING.split('/')[1];
  return !!path.find(query => query.includes(tradingPath));
};

const updateUrlPathByIndex = (index: number, value: string) => {
  const pathUrl = window.location.href.split('/').map(url => url.replace(/\?(.*)/g, ''));
  const path = removeLocale(pathUrl);
  if (isTradingPage(path)) {
    const url: URL = new URL(window.location.href);
    path[index] = value;
    const newURL = `${path.join('/')}${url.search}`;
    window.history.replaceState(null, '', newURL);
  }
};

export const removeLocale = path => {
  return path.filter(item => item !== 'ru');
};
