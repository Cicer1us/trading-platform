import { CrossRoute } from '@bitoftrade/cross-chain-core';
import { Token } from './Tokens.interface';

export interface SwapPrice {
  value: number;
  error: string;
}

export type PriceInput = { srcToken: Token; destToken: Token; amount: string; slippage: string };
export type AllowanceInput = { token: Token; clientAddress: string };

export type BuildCrossSwapInput = {
  srcToken: Token;
  destToken: Token;
  clientAddress: string;
  srcAmount: string;
  connectorToken: string;
  route: CrossRoute;
  minDestAmount: string;
  refundAddress: string;
  slippage: string;
};
