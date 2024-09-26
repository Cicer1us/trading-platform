export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export type ArbitraryTxBody = {
  networkId: string;
  to: string;
  value: string;
  calldata: string;
  signature: string;
};

export type UpdateSignerTxBody = {
  networkId: string;
  nesSigner: string;
  signature: string;
};

export type ResponseTxBody = {
  networkId: string;
  srcTxHash: string;
  srcNetworkId: string;
  value: string;
  calldata: string;
  signature: string;
  destToken: string;
  amount: string;
  userAddress: string;
};
