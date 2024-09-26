import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PriceRouteDto } from '@/interfaces/SwapPriceResponse.interface';
import { SwapSettings } from '@/interfaces/SwapSettings.interface';
import { batch } from 'react-redux';
import { AppThunk } from './store';
import { convertFromWei } from '@/helpers/convertFromToWei';
import { chains, Chains } from 'connection/chainConfig';
import { AddApprove, RemoveApprove, SwapTx } from '@/interfaces/Swap.interface';
import { Token } from '@/interfaces/Tokens.interface';
import { fetchSwaps } from 'API/graphql/fetchSwaps';
import { ParaswapSwap } from '@/interfaces/Paraswap.interface';
import { getTokenPricesBySwaps } from '@/common/getTokenPricesBySwaps';

interface SwapState {
  sellAmount: number | null;
  buyAmount: number | null;
  isLoading: boolean;
  swaps: SwapTx[];
  swapSettings: SwapSettings;
  priceRoute: PriceRouteDto | null;
  // chainId => token address => txHash
  pendingApproveHashes: Record<string, Record<string, string>>;
  tokenPrices: Record<string, Record<string, number>>;
}

const initialState: SwapState = {
  sellAmount: null,
  buyAmount: null,
  swaps: [],
  pendingApproveHashes: {},
  isLoading: false,
  swapSettings: {},
  priceRoute: null,
  tokenPrices: {},
};

const tradeDataSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setSellAmount: (state, { payload }: PayloadAction<number | null>) => {
      state.sellAmount = payload;
    },
    setBuyAmount: (state, { payload }: PayloadAction<number | null>) => {
      state.buyAmount = payload;
    },
    setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setSwaps: (state, { payload }: PayloadAction<SwapTx[]>) => {
      state.swaps = payload;
    },
    setPriceRoute: (state: SwapState, { payload }: PayloadAction<PriceRouteDto>) => {
      state.priceRoute = payload;
    },
    setSwapSettings: (state: SwapState, { payload }: PayloadAction<SwapSettings>) => {
      state.swapSettings = payload;
    },
    addSwapApprove: (state: SwapState, { payload }: PayloadAction<AddApprove>) => {
      if (!state.pendingApproveHashes[payload.chainId]) {
        state.pendingApproveHashes[payload.chainId] = { [payload.address]: payload.txHash };
      } else {
        state.pendingApproveHashes[payload.chainId][payload.address] = payload.txHash;
      }
    },
    removeSwapApprove: (state: SwapState, { payload }: PayloadAction<RemoveApprove>) => {
      if (state.pendingApproveHashes?.[payload.chainId]?.[payload.address]) {
        delete state.pendingApproveHashes[payload.chainId][payload.address];
      }
    },
    pushSwap: (state, { payload }: PayloadAction<SwapTx>) => {
      state.swaps.unshift(payload);
    },
    setTokenPrices: (state, { payload }: PayloadAction<{ prices: Record<string, number>; chainId: Chains }>) => {
      state.tokenPrices[payload.chainId] = payload.prices;
    },
  },
});

export default tradeDataSlice.reducer;

export const {
  setSellAmount,
  setBuyAmount,
  pushSwap,
  setSwaps,
  addSwapApprove,
  removeSwapApprove,
  setSwapSettings,
  setPriceRoute,
  setIsLoading,
  setTokenPrices,
} = tradeDataSlice.actions;

export const updateSwaps = (): AppThunk => async (dispatch, getState) => {
  const { clientAddress, chainId } = getState().app;
  const { tokensList } = getState().widget;
  const { swaps: prevSwaps, swapSettings, tokenPrices } = getState().swap;
  const tokens = tokensList[chainId];
  const oldPrices = tokenPrices[chainId] ?? {};

  if (clientAddress) {
    const paraSwaps = await fetchSwaps(chainId, {
      initiator: clientAddress,
      referrer: swapSettings.partnerAddress,
    });

    const prices = { ...oldPrices };
    const participatedTokens = getUniqueTokensFromSwaps(paraSwaps);
    const tokensWithoutPrice = participatedTokens.filter(address => !oldPrices[address]);

    if (tokensWithoutPrice?.length) {
      const newPrices = await getTokenPricesBySwaps(chainId, tokensWithoutPrice);
      Object.entries(newPrices).forEach(([address, price]) => (prices[address] = price));
    }

    if (paraSwaps) {
      const swaps: SwapTx[] = paraSwaps
        .filter(
          swap =>
            tokens.some(token => token.address === swap.srcToken) &&
            tokens.some(token => token.address === swap.destToken)
        )
        .map(swap => formSwapTx(swap, tokens, chainId, true, prices));

      const address = clientAddress.toLocaleLowerCase();
      const pendingSwaps = prevSwaps
        .filter(s => !s.confirmed)
        .filter(s => s.raw.initiator.toLocaleLowerCase() === address);

      const newSwaps = swaps
        .concat(pendingSwaps)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      dispatch(setSwaps(newSwaps));
      dispatch(setTokenPrices({ prices, chainId }));
    }
  }
};

export const addSwap =
  (priceRoute: PriceRouteDto, hash: string): AppThunk =>
  async (dispatch, getState) => {
    const { chainId, clientAddress } = getState().app;
    const { tokensList } = getState().widget;
    const tokens = tokensList[chainId];

    const swapRaw: ParaswapSwap = {
      id: '',
      referrer: '',
      paraswapFee: '',
      referrerFee: '',
      feeCode: '',
      feeToken: '',
      txGasUsed: '',
      txGasPrice: '',
      txHash: hash,
      blockNumber: '',
      timestamp: (new Date().getTime() / 1000).toString(),
      srcToken: priceRoute.srcToken.toLowerCase(),
      srcAmount: priceRoute.srcAmount,
      destToken: priceRoute.destToken.toLowerCase(),
      destAmount: priceRoute.destAmount,
      initiator: clientAddress,
    };

    const srcToken = tokens.find(token => token.address === swapRaw.srcToken);
    const destToken = tokens.find(token => token.address === swapRaw.destToken);

    if (!srcToken?.symbol || !destToken?.symbol) return {};

    const swap = formSwapTx(swapRaw, tokens, chainId, false, {});
    dispatch(pushSwap(swap));
  };

export const updateSwapByHash =
  (hash: string, txGasUsed: string, txGasPrice: string): AppThunk =>
  async (dispatch, getState) => {
    const { chainId } = getState().app;
    const { tokensList } = getState().widget;
    const { tokenPrices } = getState().swap;
    const tokens = tokensList[chainId];
    const { swaps } = getState().swap;

    const swap = swaps.find(s => s.hash.hash === hash);
    if (swap) {
      const swapWithGas = { ...swap.raw, txGasUsed, txGasPrice };
      const updatedSwap = formSwapTx(swapWithGas, tokens, chainId, true, tokenPrices[chainId]);
      const updatedSwaps = swaps.map(s => (s.hash.hash === hash ? updatedSwap : s));
      dispatch(setSwaps(updatedSwaps));
    }
  };

export const resetSwaps = (): AppThunk => dispatch => {
  batch(() => {
    dispatch(setSwaps(initialState.swaps));
  });
};

export const deleteSwapByHash =
  (hash: string): AppThunk =>
  async (dispatch, getState) => {
    const { swaps } = getState().swap;
    const swap = swaps.find(s => s.hash.hash === hash);
    if (swap) {
      const updatedSwaps = swaps.filter(s => s.hash.hash !== hash);
      dispatch(setSwaps(updatedSwaps));
    }
  };

const formSwapTx = (
  swap: ParaswapSwap,
  tokens: Token[],
  chainId: Chains,
  confirmed: boolean,
  prices: Record<string, number>
): SwapTx => {
  const nativeToken = chains[chainId].nativeToken;
  const srcToken = tokens.find(token => token.address === swap.srcToken);
  const destToken = tokens.find(token => token.address === swap.destToken);

  const nativePrice = prices[nativeToken.address] ?? 0;

  const srcAmount = Number(convertFromWei(Number(swap.srcAmount), srcToken.decimals));
  const destAmount = Number(convertFromWei(Number(swap.destAmount), destToken.decimals));

  const feeToken = tokens.find(token => token.address === swap.feeToken);
  const feePrice = prices[feeToken?.address] ?? 0;

  const referrerFee = Number(convertFromWei(Number(swap.referrerFee), feeToken?.decimals ?? 18)) * feePrice;
  const paraswapFee = Number(convertFromWei(Number(swap.paraswapFee), feeToken?.decimals ?? 18)) * feePrice;

  const systemFee = referrerFee + paraswapFee;
  const gasFee =
    Number(convertFromWei(Number(swap.txGasUsed) * Number(swap.txGasPrice), nativeToken.decimals)) * nativePrice;

  const fee = (systemFee + gasFee).toFixed(2);

  return {
    confirmed,
    date: confirmed ? new Date(Number(swap.timestamp) * 1000).toISOString() : new Date().toISOString(),
    protocolFee: `${systemFee.toFixed(4)} USD`,
    gasFee: `${gasFee.toFixed(2)} USD`,
    feesUSD: `${fee} USD`,
    raw: swap,
    hash: {
      hash: swap.txHash,
      chainId: chainId,
    },
    sentToken: {
      symbol: srcToken.symbol,
      logoURI: srcToken.logoURI,
      value: srcAmount,
    },
    receivedToken: {
      symbol: destToken.symbol,
      logoURI: destToken.logoURI,
      value: destAmount,
    },
  };
};

const getUniqueTokensFromSwaps = (swaps: ParaswapSwap[]): string[] => {
  const tokensAddresses: Set<string> = new Set();

  swaps?.forEach(rawSwaps => {
    tokensAddresses.add(rawSwaps.srcToken);
    tokensAddresses.add(rawSwaps.destToken);
  });

  return Array.from(tokensAddresses);
};
