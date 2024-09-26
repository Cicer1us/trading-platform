export type ChainConfig = {
  chainId: number;
  rpcUrl: string;
  name: string;
  explorerUrl: string;
  nativeToken: {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    coingeckoId: string;
  };
  coingeckoChain: string;
  eip1559: boolean;
  isTest: boolean;
  displayPriority: number;
  coinMarketId?: string;
  coinMarketName?: string;
};
