export type Token = {
  chainId: Chain;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
};

export enum Chain {
  MAINNET = 1,
  OPTIMISM = 10,
  BSC = 56,
  POLYGON = 137,
  ARBITRUM = 42161,
  AVALANCHE = 43114,
}

// range between 0 and 10000
// 10 000 is 100%
// 50 is 0.5%
export const DEFAULT_SLIPPAGE = 50;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// TODO: it should be adjust to the real USDC transfer gas limit
export const TRANSFER_CASE_BASE_GAS_LIMIT: Record<Chain, number> = {
  [Chain.MAINNET]: 50000,
  [Chain.OPTIMISM]: 21000,
  [Chain.BSC]: 21000,
  [Chain.POLYGON]: 21000,
  [Chain.ARBITRUM]: 21000,
  [Chain.AVALANCHE]: 21000,
};

// TODO: it should be adjust to the real swap execution gas limit
export const SWAP_CASE_BASE_GAS_LIMIT: Record<Chain, number> = {
  [Chain.MAINNET]: 100000,
  [Chain.OPTIMISM]: 100000,
  [Chain.BSC]: 100000,
  [Chain.POLYGON]: 100000,
  [Chain.ARBITRUM]: 100000,
  [Chain.AVALANCHE]: 100000,
};

export const DEFAULT_PAY_OUT_TOKEN: Record<Chain, Token> = {
  [Chain.MAINNET]: {
    chainId: Chain.MAINNET,
    name: 'USDC',
    symbol: 'USDC',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
  },
  [Chain.OPTIMISM]: {
    chainId: Chain.OPTIMISM,
    name: 'USDC',
    symbol: 'USDC',
    address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    decimals: 6,
  },
  [Chain.BSC]: {
    chainId: Chain.BSC,
    name: 'USDC',
    symbol: 'USDC',
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    decimals: 18,
  },
  [Chain.POLYGON]: {
    chainId: Chain.POLYGON,
    name: 'USDC',
    symbol: 'USDC',
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    decimals: 6,
  },
  [Chain.ARBITRUM]: {
    chainId: Chain.ARBITRUM,
    name: 'USDC',
    symbol: 'USDC',
    address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    decimals: 6,
  },
  [Chain.AVALANCHE]: {
    chainId: Chain.AVALANCHE,
    name: 'USDC',
    symbol: 'USDC',
    address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    decimals: 6,
  },
};

// current implementation works only on Polygon
// after tests and audits it will be deployed on other chains
export const PAYMENT_GATEWAY_ADDRESS: Record<Chain, string> = {
  [Chain.MAINNET]: '0x1A3482FBC2Ff19A24149Ea7Cd72AaF384417e0AC',
  [Chain.OPTIMISM]: '',
  [Chain.BSC]: '0x77503Aa42ED67E903F63EC8FbBD8B5acC5d2a7Ee',
  [Chain.POLYGON]: '0xb7742b7cf4d590de1f2bded0139537fea8f00710',
  [Chain.ARBITRUM]: '',
  [Chain.AVALANCHE]: '',
};

// TODO: test these rpc urls
export const RPC_URL: Record<Chain, string> = {
  [Chain.MAINNET]: 'https://eth.llamarpc.com',
  [Chain.OPTIMISM]: 'https://mainnet.optimism.io',
  [Chain.BSC]: 'https://bsc.meowrpc.com',
  [Chain.POLYGON]: 'https://polygon.llamarpc.com',
  [Chain.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
  [Chain.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
};

export const FINALIZED_TX_BLOCK_AMOUNT: Record<Chain, number> = {
  [Chain.MAINNET]: 6,
  [Chain.OPTIMISM]: 1,
  [Chain.BSC]: 1,
  [Chain.POLYGON]: 126,
  [Chain.ARBITRUM]: 10,
  [Chain.AVALANCHE]: 1,
};
