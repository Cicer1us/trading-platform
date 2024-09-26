import { BigNumber } from 'bignumber.js';

export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  extensions?: {
    bridgeInfo: Record<string, { tokenAddress: string }>;
  };
  balance?: number | BigNumber;
  usdBalance?: number | BigNumber;
  precision?: number;
  allowance?: number | 'pending';
}
