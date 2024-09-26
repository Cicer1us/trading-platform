import { TableTx } from './TransactionTable.interface';

export enum LimitOrderStatus {
  OPEN = 'Open',
  CANCELLED = 'Cancelled',
  FILLED = 'Filled',
  EXPIRED = 'Expired',
  CANCELLING = 'Cancelling',
}

export interface LimitRaw {
  id: number;
  orderHash: string;
  transactionHash: string;
  maker: string;
  taker: string;
  sender: string;
  chainId: string;
  feeRecipient: string;
  verifyingContract: string;
  pool: string;
  salt: string;
  takerGasFeeAmount: string;
  makerToken: string;
  takerToken: string;
  makerAmount: string;
  takerAmount: string;
  feeAmount: string;
  expiry: string;
  createdAt: string;
  takerTokenFeeAmount: string;
  status: LimitOrderStatus;
  takerAmountUSD: number;
  takerTokenFeeAmountUSD: number;
  takerGasFeeAmountUSD: number;
}

export interface LimitOrder extends TableTx<LimitRaw> {
  expiredAt: string;
  status: LimitOrderStatus;
}
