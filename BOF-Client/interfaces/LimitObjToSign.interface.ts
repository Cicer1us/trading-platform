export interface LimitObjToSign {
  makerToken: string;
  takerToken: string;
  makerAmount: string;
  takerAmount: string;
  maker: string;
  expiry: number;
  takerTokenFeeAmount: string;
  feeRecipient: string;
}
