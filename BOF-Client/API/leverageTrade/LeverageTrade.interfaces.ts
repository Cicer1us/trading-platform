export enum LeverageTradeSide {
  BUY = 'BUY',
  SELL = ' SELL',
}

export enum LeverageTradeLiquidity {
  TAKER = 'TAKER',
  MAKER = ' MAKER',
}

export enum LeverageTradeType {
  MARKET = 'MARKET',
}

export interface LeverageTrade {
  userAddress: string;
  market: string;
  side: LeverageTradeSide;
  liquidity: LeverageTradeLiquidity;
  type: string;
  price: number;
  size: number;
  fee: number;
  orderId: string;
  transactionId: number;
  orderClientId: number;
}
