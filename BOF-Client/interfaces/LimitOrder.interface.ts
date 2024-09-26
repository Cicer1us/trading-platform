import { SignatureType } from '@0x/protocol-utils';

export interface SignedLimitOrder {
  maker: string;
  taker: string;
  makerToken: string;
  takerToken: string;
  makerAmount: string;
  takerAmount: string;
  takerTokenFeeAmount: string;
  expiry: string;
  salt: string;
  sender: string;
  pool: string;
  chainId: number;
  verifyingContract: string;
  signature: Signature;
  feeRecipient: string;
}

interface Signature {
  v: number;
  r: string;
  s: string;
  signatureType: SignatureType;
}

export interface ZeroXLimitOrdersPaginated {
  reason?: string;
  total: number;
  page: number;
  perPage: number;
  records: Array<ZeroXLimitOrder>;
}

interface ZeroXLimitOrder {
  order: SignedLimitOrder;
  metaData: ZeroXOrderMetaData;
}

interface ZeroXOrderMetaData {
  orderHash: string;
  remainingFillableTakerAmount: string;
  createdAt: string;
}

export interface CreatedLimitOrder extends Omit<SignedLimitOrder, 'takerTokenFeeAmount'> {
  orderHash: string;
  feeAmount: string;
}

export interface LimitOrder {
  id: number;
  orderHash: string;
  transactionHash: string;
  maker: string;
  taker: string;
  makerToken: string;
  takerToken: string;
  makerAmount: string;
  takerAmount: string;
  feeAmount: string;
  expiry: string;
  status: string;
  createdAt: string;
}
