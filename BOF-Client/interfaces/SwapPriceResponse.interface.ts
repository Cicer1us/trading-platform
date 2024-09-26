export interface SwapPriceResponseDto {
  priceRoute: PriceRouteDto;
  error?: string;
}

export interface PriceRouteDto {
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
  bestRoute: BestRouteDto[];
}

export interface BestRouteDto {
  percent: number;
  swaps: BestRouteSwapDto[];
}

export interface BestRouteSwapDto {
  srcToken: string;
  destToken: string;
  srcDecimals: number;
  destDecimals: number;
  swapExchanges: SwapExchangeDto[];
}

export interface SwapExchangeDto {
  exchange: string;
  srcAmount: string;
  destAmount: string;
  percent: number;
  poolAddresses: string[];
  data: SwapExchangeDataDto;
}

export interface SwapExchangeDataDto {
  router: string;
  path: string[];
  factory: string;
  initCode: string;
  feeFactor: number;
  pools: SwapExchangePoolDto[];
  gasUSD: string;
}

export interface SwapExchangePoolDto {
  address: string;
  fee: number;
  direction: boolean;
}
