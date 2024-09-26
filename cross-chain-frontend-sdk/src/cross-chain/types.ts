import type { OptimalRate } from '@paraswap/sdk';
import { CrossRoute } from '@bitoftrade/cross-chain-core';
import { SrcCrossSwap } from '../thegraph/events/getSrcCrossSwaps';
import { DestCrossSwap } from '../thegraph/events/getDestCrossSwaps';

export type CrossChainSwapPriceInput = {
  srcChainId: number;
  srcToken: string;
  srcTokenDecimals: number;
  destChainId: number;
  destToken: string;
  destTokenDecimals: number;
  amount: string;
  slippage: number;
};

export interface CrossChainSwapPrice extends CrossChainSwapPriceInput {
  srcSwap: {
    priceRoute: (Omit<OptimalRate, 'gasCost' | 'gasCostUSD'> & { gasCost: number; gasCostUSD: number }) | null;
    connectorToken: {
      chainId: number;
      name: string;
      symbol: string;
      address: string;
      decimals: number;
    };
    srcAmountUSD: number;
    connectorTokenIncome: string;
    connectorTokenIncomeHumanAmount: string;
    estimatedGas: {
      gasLimit: number;
      gasLimitUSD: number;
    };
  };
  destSwap: {
    minDestAmount: string;
    protocolFeeRate: number;
    connectorToken: {
      chainId: number;
      name: string;
      symbol: string;
      address: string;
      decimals: number;
    };
    destAmount: string;
    destAmountUSD: number;
    estimatedGas: {
      gasLimit: number;
      gasLimitUSD: number;
      gasCompensation: string;
    };
  };
  nativeTokenAmount: string;
  route: CrossRoute;
  minConnectorTokenRefundAmount: string;
}

export type CrossChainSrcSwapTxInput = {
  crossChainSwapPrice: CrossChainSwapPrice;
  userAddress: string;
  receiverAddress: string;
  refundAddress?: string;
};

export interface CrossChainError {
  error: string;
}

export type CrossChainSwap = {
  srcTx: SrcCrossSwap;
  destTx: DestCrossSwap | null;
  route: CrossRoute;
};
