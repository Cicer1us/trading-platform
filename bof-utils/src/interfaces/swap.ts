export interface SwapTxObj {
  from: string;
  to: string;
  chainId: number;
  data: string;
  value: string;
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
  gasPrice: string;
  gas: string;
  error?: string;
}
