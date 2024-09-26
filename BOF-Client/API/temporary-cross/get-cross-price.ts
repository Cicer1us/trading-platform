import { PriceRoute } from '@bitoftrade/bof-utils';
import { CrossRoute } from '@bitoftrade/cross-chain-core';

interface QueryParams {
  srcChainId: number;
  srcToken: string;
  srcTokenDecimals: number;
  destChainId: number;
  destToken: string;
  destTokenDecimals: number;
  amount: string;
  slippage: string;
}

export interface CrossPrice {
  srcChainId: number;
  srcToken: string;
  srcTokenDecimals: number;
  destChainId: number;
  destToken: string;
  destTokenDecimals: number;
  amount: string;
  slippage: number;
  nativeTokenAmount: string;
  srcSwap: {
    priceRoute: PriceRoute | null;
    connectorToken: {
      chainId: number;
      name: string;
      symbol: string;
      address: string;
      decimals: number;
    };
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
    estimatedGas: {
      gasLimit: number;
      gasLimitUSD: number;
      gasCompensation: string;
    };
  };
  route: CrossRoute;
  minConnectorTokenRefundAmount: string;
}

export interface CrossPriceError {
  error: string;
}

export async function tempGetCrossSwapPrice(
  queryParams: QueryParams,
  baseUrl: string
): Promise<CrossPrice | CrossPriceError> {
  const url = new URL(baseUrl);
  Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
  const response = await fetch(url.toString());
  const data = await response.json();
  return data;
}
