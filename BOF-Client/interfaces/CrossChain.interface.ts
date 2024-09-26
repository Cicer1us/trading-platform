import { CrossRoute } from '@bitoftrade/cross-chain-core';
import { CrossChainSwap } from '@bitoftrade/cross-chain-frontend-sdk/dist/types';
import { Token } from './Tokens.interface';
import { TokenColumn, HashColumn } from './TransactionTable.interface';
import { CrossPrice } from 'API/temporary-cross/get-cross-price';

export enum CrossChainTxStatus {
  NOT_CREATED = 'NOT_CREATED',
  FIRST_TX_PENDING = 'FIRST_TX_PENDING',
  FIRST_TX_REJECTED = 'FIRST_TX_REJECTED',
  SECOND_TX_PENDING = 'SECOND_TX_PENDING',
  COMPLETED = 'COMPLETED',
}

export interface CrossChainParams {
  data: CrossPrice;
  srcToken: Token;
  destToken: Token;
  srcAmount: string;
  connectorToken: string;
  connectorTokenAmountOnSrcNetwork: string;
  refundAddress: string;
  crossRoute: CrossRoute;
  destAmount: string;
  minDestAmount: string;
  minConnectorTokenRefundAmount: string;
  firstTxGasCostUSD: number;
  secondTxGasCostUSD: number;
}

export interface CrossChainSwapRow {
  status: CrossChainTxStatus;
  date: string;
  swap: CrossChainSwap;
  srcToken: Token;
  destToken: Token;
  srcTokenColumn: TokenColumn;
  destTokenColumn: TokenColumn;
  srcHash: HashColumn;
  destHash: HashColumn;
  srcTxFee: number;
  destTxFee: number | null;
  srcTxFeeUsd: number;
  destTxFeeUsd: number | null;
}

export interface CrossSwap extends CrossChainSwap {
  pendingSrcTxGasCostUSD?: number;
  pendingDestTxGasCostUSD?: number;
}

export interface PendingCrossSwapParams {
  hash: string;
  minDestAmount: string;
  srcAmount: string;
  srcToken: string;
  srcChainId: string;
  destChainId: string;
  destToken: string;
  destUser: string;
  initiator: string;
  connectorToken: string;
  refundAddress: string;
  liquidityProvider: CrossRoute;
  firstTxGasCostUSD: number;
  secondTxGasCostUSD: number;
}
