import { Token } from '../data/tokens/token.interface';

export type TokenBasicInfo = Omit<Token, 'allowance' | 'allowanceStatus'>;

export type ChainConfig = {
  chainIdDecimal: number;
  chainIdHex: string;
  rpcUrl: string;
  name: string;
  explorerUrl: string;
  nativeToken: TokenBasicInfo;
  moralisName: string;
  coingeckoNetwork: string;
  eip1559: boolean;
  isTest: boolean;
  coinMarketId: string;
  image: string;
};

type NetworkById = Record<Chain, ChainConfig>;

export enum Chain {
  Ethereum = 1,
  Polygon = 137,
  Fantom = 250,
  Bsc = 56,
  Avalanche = 43114,
}

const infuraHttpUrl = 'https://rpc.ankr.com/eth';

export const chainConfigs: NetworkById = {
  [Chain.Ethereum]: {
    isTest: false,
    chainIdDecimal: 1,
    chainIdHex: '0x1',
    name: 'Ethereum',
    moralisName: 'eth',
    rpcUrl: infuraHttpUrl,
    explorerUrl: 'https://etherscan.io',
    coingeckoNetwork: 'ethereum',
    coinMarketId: '1027',
    eip1559: true,
    nativeToken: {
      name: 'ETH',
      symbol: 'ETH',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      chainId: 1,
      logoURI: `${process.env.REACT_APP_STORAGE}/eth.png`,
    },
    image: `${process.env.REACT_APP_STORAGE}/eth.png`,
  },
  [Chain.Polygon]: {
    isTest: false,
    chainIdDecimal: 137,
    chainIdHex: '0x89',
    name: 'Polygon',
    moralisName: 'polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    coingeckoNetwork: 'polygon-pos',
    coinMarketId: '3890',
    eip1559: true,
    nativeToken: {
      name: 'MATIC',
      symbol: 'MATIC',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      chainId: 1,
      logoURI: `${process.env.REACT_APP_STORAGE}/polygon.png`,
    },
    image: `${process.env.REACT_APP_STORAGE}/polygon.png`,
  },
  [Chain.Bsc]: {
    isTest: false,
    chainIdDecimal: 56,
    chainIdHex: '0x38',
    name: 'BSC',
    moralisName: 'bsc',
    rpcUrl: 'https://bsc-dataseed1.defibit.io',
    explorerUrl: 'https://bscscan.com',
    coingeckoNetwork: 'binance-smart-chain',
    coinMarketId: '1839',
    eip1559: false,
    nativeToken: {
      name: 'BNB',
      symbol: 'BNB',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      chainId: 1,
      logoURI: `${process.env.REACT_APP_STORAGE}/binance.png`,
    },
    image: `${process.env.REACT_APP_STORAGE}/binance.png`,
  },
  [Chain.Fantom]: {
    isTest: false,
    chainIdDecimal: 250,
    chainIdHex: '0xfa',
    name: 'Fantom',
    moralisName: 'fantom',
    rpcUrl: 'https://rpc.ftm.tools',
    explorerUrl: 'https://ftmscan.com',
    coingeckoNetwork: 'fantom',
    coinMarketId: '3513',
    eip1559: false,
    nativeToken: {
      name: 'FTM',
      symbol: 'FTM',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      chainId: 1,
      logoURI: `${process.env.REACT_APP_STORAGE}/fantom.png`,
    },
    image: `${process.env.REACT_APP_STORAGE}/fantom.png`,
  },
  [Chain.Avalanche]: {
    isTest: false,
    chainIdDecimal: 43114,
    chainIdHex: '0xa86a',
    name: 'Avalanche',
    moralisName: 'avalanche',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    coingeckoNetwork: 'avalanche',
    coinMarketId: '5805',
    eip1559: false,
    nativeToken: {
      name: 'AVAX',
      symbol: 'AVAX',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      chainId: 1,
      logoURI: `${process.env.REACT_APP_STORAGE}/avalanche.png`,
    },
    image: `${process.env.REACT_APP_STORAGE}/avalanche.png`,
  },
};

export const rpcUrls = Object.values(chainConfigs).reduce<Record<number, string>>((acc, config) => {
  acc[config.chainIdDecimal] = config.rpcUrl;
  return acc;
}, {});
