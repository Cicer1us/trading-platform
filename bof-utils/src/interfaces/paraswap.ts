export interface SwapPriceResponse {
  priceRoute: PriceRoute;
  error?: string;
}

export interface PriceRoute {
  blockNumber: number;
  network: number;
  srcToken: string;
  destToken: string;
  srcDecimals: number;
  destDecimals: number;
  destAmount: string;
  srcAmount: string;
  gasCostUSD: string;
  gasCost: string;
  side: 'SELL' | 'BUY';
  tokenTransferProxy: string;
  contractAddress: string;
  contractMethod: string;
  partnerFee: number;
  srcUSD: string;
  destUSD: string;
  partner: string;
  maxImpactReached: boolean;
  hmac: string;
  bestRoute: BestRoute[];
}

export interface BestRoute {
  percent: number;
  swaps: BestRouteSwap[];
}

export interface BestRouteSwap {
  srcToken: string;
  destToken: string;
  srcDecimals: number;
  destDecimals: number;
  swapExchanges: SwapExchange[];
}

export interface SwapExchange {
  exchange: string;
  srcAmount: string;
  destAmount: string;
  percent: number;
  poolAddresses: string[];
  data: SwapExchangeData;
}

export interface SwapExchangeData {
  router: string;
  path: string[];
  factory: string;
  initCode: string;
  feeFactor: number;
  pools: SwapExchangePool[];
  gasUSD: string;
}

export interface SwapExchangePool {
  address: string;
  fee: number;
  direction: boolean;
}

export interface GetSwapPrice {
  srcToken: string;
  destToken: string;
  amount: string;
  srcDecimals: string;
  destDecimals: string;
  side: string;
  includeContractMethods?: string;
  excludeDirectContractMethods?: string;
  network: string;
}
