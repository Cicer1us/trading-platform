import { ContractMethod, OptimalRate, SimpleFetchSDK, SwapSide } from '@paraswap/sdk';

export type GetSwapRateInput = {
  paraswapSdk: SimpleFetchSDK;
  srcToken: string;
  destToken: string;
  amount: string;
  srcDecimals: string;
  destDecimals: string;
  side: SwapSide;
  partner?: string;
  includeContractMethods?: ContractMethod[];
  excludeContractMethods?: ContractMethod[];
};

export type SwapSettings = {
  partnerAddress?: string;
  feePercentage?: string;
};

export type BuildSwapTx = {
  paraswapSdk: SimpleFetchSDK;
  srcToken: string;
  srcDecimals: number;
  srcAmount: string;
  destToken: string;
  destDecimals: number;
  destAmount: string;
  userAddress: string;
  receiverAddress?: string;
  priceRoute: OptimalRate;
  partnerAddress: string;
  partnerFeeBps: number;
};
