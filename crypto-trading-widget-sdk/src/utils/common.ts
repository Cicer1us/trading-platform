import { Chain, chainConfigs } from './chains';
import { Token } from '../data/tokens/token.interface';
import { SwapPriceResponse, GetSwapPrice, getSwapPrice } from '@bitoftrade/bof-utils';
import { PARTNER } from '../constants';
import BigNumber from 'bignumber.js';
import { parseUnits } from '@ethersproject/units';

export const truncateAddress = (address: string): string => {
  if (!address) return 'No Account';
  const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export interface CalculateSwapValueParams {
  amount: string;
  tokenOut: Token;
  tokenIn: Token;
  chain: Chain;
  side: 'BUY' | 'SELL';
}

export const fetchPriceRoute = async (params: CalculateSwapValueParams): Promise<SwapPriceResponse> => {
  const amountInWei = parseUnits(
    params.amount,
    params.side === 'SELL' ? params.tokenOut.decimals : params.tokenIn.decimals
  ).toString();
  const swapPriceParams: GetSwapPrice = {
    srcToken: params.tokenOut.address,
    destToken: params.tokenIn.address,
    amount: amountInWei,
    srcDecimals: params.tokenOut.decimals.toString(),
    destDecimals: params.tokenIn.decimals.toString(),
    side: params.side,
    excludeDirectContractMethods: 'true',
    network: chainConfigs[params.chain].chainIdDecimal.toString(),
  };
  return getSwapPrice(swapPriceParams, PARTNER);
};

export const convertInputStringToNumber = (value: string) => {
  return value.replaceAll(',', '');
};

export const isAllowed = (allowance: BigNumber, inputAmount: string) => {
  return allowance.comparedTo(BigNumber(inputAmount)) >= 0;
};

export const isSupportedChain = (chainId: Chain | undefined): chainId is Chain => {
  return !!chainId && !!chainConfigs[chainId];
};

export function isWalletConnectDenied(error: Error | null): boolean {
  return error?.message === 'User denied account authorization';
}

export function isCoinbaseWalletDenied(error: Error | null): boolean {
  return error?.message === 'Connection request reset. Please try again.';
}

export const cutStringToDisplayOnlyFirstAndLastCharacters = (str: string, n: number) => {
  if (str.length > n * 2) {
    return str.slice(0, 5) + '...' + str.slice(str.length - 5);
  } else {
    return str;
  }
};
