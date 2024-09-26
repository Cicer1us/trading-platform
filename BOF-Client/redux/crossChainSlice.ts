import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';
import {
  CrossChainParams,
  CrossChainSwapRow,
  CrossChainTxStatus,
  CrossSwap,
  PendingCrossSwapParams,
} from '@/interfaces/CrossChain.interface';
import { AddApprove, RemoveApprove } from '@/interfaces/Swap.interface';
import { availableChainsCrossSwap } from '@/common/constants';
import getNativeTokenPrice from 'API/tokens/getNativeTokenPrice';
import { convertFromWei } from '@/helpers/convertFromToWei';
import { Token } from '@/interfaces/Tokens.interface';
import Web3 from 'web3';
import { updateBalances } from './appSlice';
import { batch } from 'react-redux';
import { getCrossSwaps } from '@bitoftrade/cross-chain-frontend-sdk';
import { SrcCrossSwap } from '@bitoftrade/cross-chain-frontend-sdk/dist/thegraph/events/getSrcCrossSwaps';
import { Notify, NotifyEnum } from '@/components/CustomToastContainer/CustomToastContainer';
import { getT } from '@/hooks/useMultilingual';
import { chains } from 'connection/chainConfig';
import { getMultiChainMultipleAllowance } from '@/helpers/getMultipleBalances';
import { SmartContracts } from '@bitoftrade/cross-chain-core';

interface CrossChainState {
  crossChainSwaps: CrossChainSwapRow[];
  pendingApproveHashes: Record<string, Record<string, string>>;
  nativeTokenUsdPrices: Record<number, number>;
  srcAmount: number | null;
  destAmount: number | null;
  slippage: string;
  lastParams: CrossChainParams;
  allowances: Record<number, Record<string, number>>;
}

const initialState: CrossChainState = {
  crossChainSwaps: [],
  lastParams: null,
  allowances: Object.keys(chains).reduce((acc, chainId) => ({ ...acc, [chainId]: {} }), {}),
  pendingApproveHashes: {},
  nativeTokenUsdPrices: {},
  srcAmount: null,
  destAmount: null,
  slippage: '100', //slippage in basic point
};

const crossChainDataSlice = createSlice({
  name: 'crossChain',
  initialState,
  reducers: {
    setAllowance: (state, { payload }: PayloadAction<{ address: string; allowance: number; chainId: number }>) => {
      if (state.allowances[payload.chainId]) {
        state.allowances[payload.chainId][payload.address] = payload.allowance;
      }
    },
    setAllowances: (state, { payload }: PayloadAction<Record<number, Record<string, number>>>) => {
      state.allowances = payload;
    },
    setCrossSrcAmount: (state, { payload }: PayloadAction<number | null>) => {
      state.srcAmount = payload;
    },
    setCrossDestAmount: (state, { payload }: PayloadAction<number | null>) => {
      state.destAmount = payload;
    },
    setSlippage: (state, { payload }: PayloadAction<string>) => {
      state.slippage = payload;
    },
    addCrossSwap: (state, { payload }: PayloadAction<CrossChainSwapRow>) => {
      state.crossChainSwaps.unshift(payload);
    },
    setSwapsHistory: (state, { payload }: PayloadAction<CrossChainSwapRow[]>) => {
      state.crossChainSwaps = payload;
    },
    setLastParams: (state, { payload }: PayloadAction<CrossChainParams>) => {
      state.lastParams = payload;
    },
    addCrossSwapApprove: (state, { payload }: PayloadAction<AddApprove>) => {
      if (!state.pendingApproveHashes[payload.chainId]) {
        state.pendingApproveHashes[payload.chainId] = { [payload.address]: payload.txHash };
      } else {
        state.pendingApproveHashes[payload.chainId][payload.address] = payload.txHash;
      }
    },
    removeCrossSwapApprove: (state, { payload }: PayloadAction<RemoveApprove>) => {
      if (state.pendingApproveHashes?.[payload.chainId]?.[payload.address]) {
        delete state.pendingApproveHashes[payload.chainId][payload.address];
      }
    },
    setNativeTokenUsdPrices: (state, { payload }: PayloadAction<Record<number, number>>) => {
      state.nativeTokenUsdPrices = payload;
    },
  },
});

export default crossChainDataSlice.reducer;

export const {
  setSwapsHistory,
  setLastParams,
  addCrossSwapApprove,
  removeCrossSwapApprove,
  setNativeTokenUsdPrices,
  setCrossSrcAmount,
  setCrossDestAmount,
  addCrossSwap,
  setAllowance,
  setAllowances,
} = crossChainDataSlice.actions;

export const updateNativeTokenUsdPrices = (): AppThunk => async dispatch => {
  const requests = [];
  const prices = {};
  availableChainsCrossSwap.forEach(chain => requests.push(getNativeTokenPrice(chain)));
  const pricesResponse = await Promise.all(requests);
  availableChainsCrossSwap.forEach((chain, index) => (prices[chain] = pricesResponse[index]));
  dispatch(setNativeTokenUsdPrices(prices));
};

export const updateCrossSwaps = (): AppThunk => async (dispatch, getState) => {
  const { clientAddress } = getState().app;
  const { tokensList } = getState().widget;
  const { nativeTokenUsdPrices } = getState().crossChain;

  if (clientAddress && Object.keys(nativeTokenUsdPrices).length) {
    const crossSwaps = await getCrossSwaps(clientAddress);
    const rows = crossSwaps
      .map(swap => createCrossSwapRow(swap, tokensList, nativeTokenUsdPrices))
      .sort((a, b) => Number(b.swap.srcTx?.timestamp) - Number(a.swap.srcTx?.timestamp));
    dispatch(setSwapsHistory(rows));
  }
};

export const setRejectStatusForCrossSwap =
  (hash: string): AppThunk =>
  async (dispatch, getState) => {
    const { crossChainSwaps } = getState().crossChain;

    const updatedSwaps = crossChainSwaps.map(swap =>
      swap?.srcHash?.hash === hash ? { ...swap, status: CrossChainTxStatus.FIRST_TX_REJECTED } : swap
    );
    dispatch(setSwapsHistory(updatedSwaps));
  };

export const addPendingCrossSwap =
  (params: PendingCrossSwapParams): AppThunk =>
  async (dispatch, getState) => {
    const { tokensList } = getState().widget;
    const { nativeTokenUsdPrices } = getState().crossChain;

    const srcTx: SrcCrossSwap = {
      minDestAmount: params.minDestAmount,
      txHash: params.hash,
      srcAmount: params.srcAmount,
      srcToken: params.srcToken,
      srcChainId: params.srcChainId,
      destChainId: params.destChainId,
      destToken: params.destToken,
      destUser: params.destUser,
      initiator: params.initiator,
      timestamp: (new Date().getTime() / 1000).toFixed(),
      connectorToken: params.connectorToken,
      connectorTokenIncome: '0',
      refundAddress: params.refundAddress,
      liquidityProvider: params.liquidityProvider,
      blockHash: '',
      blockNumber: '0',
      txGasPrice: '',
      txGasUsed: '',
    };

    const pendingSwap: CrossSwap = {
      pendingSrcTxGasCostUSD: params.firstTxGasCostUSD,
      pendingDestTxGasCostUSD: params.secondTxGasCostUSD,
      route: params.liquidityProvider,
      srcTx,
      destTx: null,
    };

    dispatch(addCrossSwap(createCrossSwapRow(pendingSwap, tokensList, nativeTokenUsdPrices)));
  };

export const setFirstCrossTxCompleted =
  (txHash: string, txGasUsed: string, txGasPrice: string): AppThunk =>
  async (dispatch, getState) => {
    const { crossChainSwaps, nativeTokenUsdPrices } = getState().crossChain;
    const { tokensList } = getState().widget;

    const updatedCrossSwaps = crossChainSwaps.map(swap => {
      if (swap.swap.srcTx.txHash !== txHash) return swap;
      const updatedSrcTx: SrcCrossSwap = {
        ...swap.swap.srcTx,
        txGasPrice,
        txGasUsed,
      };
      return createCrossSwapRow(
        { ...swap.swap, srcTx: updatedSrcTx, pendingSrcTxGasCostUSD: null },
        tokensList,
        nativeTokenUsdPrices
      );
    });

    dispatch(setSwapsHistory(updatedCrossSwaps));
  };

export const updatePendingCrossSwaps = (): AppThunk => async (dispatch, getState) => {
  const { clientAddress } = getState().app;
  const { crossChainSwaps, nativeTokenUsdPrices } = getState().crossChain;
  const { tokensList } = getState().widget;

  const pendingSwaps = crossChainSwaps.filter(
    swap => swap.status === CrossChainTxStatus.FIRST_TX_PENDING || swap.status === CrossChainTxStatus.SECOND_TX_PENDING
  );

  if (pendingSwaps.length) {
    const hashesByChain = {};
    pendingSwaps.forEach(swap => {
      const { chainId, hash } = swap?.srcHash;
      hashesByChain[chainId] = [...(hashesByChain[chainId] ?? []), hash];
    });
    const updatedSwaps = await getCrossSwaps(clientAddress, hashesByChain);
    const swapsRow = crossChainSwaps.map(swapRow => {
      const rawSwap = updatedSwaps.find(s => s.srcTx.txHash === swapRow.srcHash?.hash);
      return rawSwap ? createCrossSwapRow(rawSwap, tokensList, nativeTokenUsdPrices) : swapRow;
    });

    batch(() => {
      // update if swap on dest network was confirmed
      if (updatedSwaps?.some(swap => swap.destTx)) {
        updatedSwaps
          .filter(swap => swap.destTx)
          .forEach(swap => {
            Notify({
              state: NotifyEnum.SUCCESS,
              message: getT('swapModal')('crossSwapSecondTxCompleted'),
              link: {
                chainId: Number(swap.srcTx?.destChainId),
                hash: swap?.destTx.txHash,
              },
            });
          });
        dispatch(updateBalances());
      }
      dispatch(setSwapsHistory(swapsRow));
    });
  }
};

const createCrossSwapRow = (
  swap: CrossSwap,
  tokens: Record<string, Token[]>,
  nativeTokenUsdPrices: Record<string, number>
): CrossChainSwapRow => {
  const { srcTx, destTx } = swap;

  const convertGasCostToHuman = (gasUsed: string, gasPrice: string): number => {
    if (!gasUsed || !gasPrice) return 0;
    const gas = Web3.utils.toBN(gasUsed).mul(Web3.utils.toBN(gasPrice));
    return Number(Web3.utils.fromWei(gas));
  };

  // todo: refactor
  const srcToken = tokens[srcTx.srcChainId].find(token => token.address === srcTx.srcToken);
  const destToken = tokens[srcTx?.destChainId].find(token => token.address === srcTx?.destToken);

  if (srcToken && destToken) {
    const destWeiAmount = !!destTx ? destTx?.destAmount : srcTx?.minDestAmount;

    const srcAmount = Number(convertFromWei(Number(srcTx?.srcAmount), srcToken.decimals));
    const destAmount = Number(convertFromWei(Number(destWeiAmount), destToken.decimals));

    const srcTxFeeUsd =
      swap?.pendingSrcTxGasCostUSD ??
      convertGasCostToHuman(srcTx?.txGasUsed, srcTx?.txGasPrice) * nativeTokenUsdPrices[srcTx?.srcChainId];

    const destTxFeeUsd =
      swap?.pendingDestTxGasCostUSD ??
      convertGasCostToHuman(destTx?.txGasUsed, destTx?.txGasPrice) * nativeTokenUsdPrices[srcTx?.destChainId];

    const status = swap?.pendingSrcTxGasCostUSD
      ? CrossChainTxStatus.FIRST_TX_PENDING
      : !destTx
      ? CrossChainTxStatus.SECOND_TX_PENDING
      : CrossChainTxStatus.COMPLETED;

    return {
      status,
      srcToken,
      destToken,
      srcTxFee: null,
      srcTxFeeUsd,
      destTxFeeUsd,
      destTxFee: null,
      swap,
      date: new Date(Number(srcTx?.timestamp) * 1000).toISOString(),
      destHash: {
        hash: destTx?.txHash,
        chainId: Number(srcTx?.destChainId),
      },
      srcHash: {
        hash: srcTx?.txHash,
        chainId: Number(srcTx?.srcChainId),
      },
      srcTokenColumn: {
        symbol: srcToken.symbol,
        logoURI: srcToken.logoURI,
        value: srcAmount,
      },
      destTokenColumn: {
        symbol: destToken.symbol,
        logoURI: destToken.logoURI,
        value: destAmount,
      },
    };
  }
};

export const updateAllowances = () => async (dispatch, getState: () => RootState) => {
  const { clientAddress } = getState().app;
  const { tokensList } = getState().widget;

  if (clientAddress) {
    const allowanceAddress = {};
    const tokens = {};
    availableChainsCrossSwap.forEach(chain => {
      tokens[chain] = tokensList[chain];
      allowanceAddress[chain] = SmartContracts[chain]?.crossChainRouter ?? '0x';
    }, {});
    const multiChainAllowances = await getMultiChainMultipleAllowance(clientAddress, tokens, allowanceAddress);
    dispatch(setAllowances(multiChainAllowances));
  }
};
