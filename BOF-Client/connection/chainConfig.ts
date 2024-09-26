import { ChainConfig } from '@/interfaces/Chain.interface';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

export const WALLET_CONNECT_STORAGE = 'walletconnect';

const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`NEXT_PUBLIC_INFURA_KEY must be a defined environment variable`);
}

export enum Chains {
  MAINNET = 1,
  POLYGON = 137,
  FANTOM = 250,
  BSC = 56,
  GOERLI = 5,
  AVALANCHE = 43114,
  ARBITRUM = 42161,
  OPTIMISM = 10,
}

export const CHAIN_TO_NAME: Record<Chains, string> = {
  [Chains.MAINNET]: 'mainnet',
  [Chains.GOERLI]: 'goerli',
  [Chains.POLYGON]: 'polygon',
  [Chains.ARBITRUM]: 'arbitrum',
  [Chains.AVALANCHE]: 'avalanche',
  [Chains.OPTIMISM]: 'optimism',
  [Chains.BSC]: 'bsc',
  [Chains.FANTOM]: 'fantom',
};

export const FALLBACK_URLS: Record<Chains, string[]> = {
  [Chains.MAINNET]: [
    // "Safe" URLs
    'https://api.mycryptoapi.com/eth',
    'https://cloudflare-eth.com',
    // "Fallback" URLs
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
  ],
  [Chains.AVALANCHE]: ['https://rpc.ankr.com/avalanche', 'https://1rpc.io/avax/c'],
  [Chains.FANTOM]: ['https://rpc.ftm.tools', 'https://rpcapi.fantom.network'],
  [Chains.GOERLI]: [
    // "Safe" URLs
    'https://rpc.goerli.mudit.blog/',
    // "Fallback" URLs
    'https://1rpc.io/avax/c',
  ],
  [Chains.POLYGON]: [
    // "Safe" URLs
    'https://polygon-rpc.com/',
    'https://rpc-mainnet.matic.network',
    'https://matic-mainnet.chainstacklabs.com',
    'https://rpc-mainnet.maticvigil.com',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://matic-mainnet-full-rpc.bwarelabs.com',
  ],
  [Chains.ARBITRUM]: [
    // "Safe" URLs
    'https://arb1.arbitrum.io/rpc',
    // "Fallback" URLs
    'https://arbitrum.public-rpc.com',
  ],
  [Chains.OPTIMISM]: [
    // "Safe" URLs
    'https://mainnet.optimism.io/',
    // "Fallback" URLs
    'https://rpc.ankr.com/optimism',
  ],
  [Chains.BSC]: [
    // "Safe" URLs
    'https://bsc-mainnet.gateway.pokt.network/v1/lb/6136201a7bad1500343e248d',
    'https://1rpc.io/bnb',
    'https://bsc-dataseed3.binance.org',
    'https://bsc-dataseed2.defibit.io',
    'https://bsc-dataseed1.ninicoin.io',
    'https://binance.nodereal.io',
    'https://bsc-dataseed4.defibit.io',
    'https://rpc.ankr.com/bsc',
  ],
};

export const RPC_URL: Record<Chains, string> = {
  [Chains.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [Chains.GOERLI]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  [Chains.OPTIMISM]: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
  [Chains.ARBITRUM]: `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
  [Chains.POLYGON]: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
  [Chains.BSC]: `https://bsc-dataseed.binance.org`,
  [Chains.AVALANCHE]: `https://avalanche-mainnet.infura.io/v3/${INFURA_KEY}`,
  [Chains.FANTOM]: `https://rpc.ftm.tools`,
};

export const chains: Record<Chains, ChainConfig> = {
  [Chains.GOERLI]: {
    isTest: true,
    chainId: Chains.GOERLI,
    name: 'Goerli',
    rpcUrl: RPC_URL[Chains.GOERLI],
    explorerUrl: 'https://goerli.etherscan.io',
    coingeckoChain: 'goerli',
    coinMarketId: '',
    eip1559: true,
    displayPriority: 8,
    nativeToken: {
      name: 'ETH',
      symbol: 'ETH',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      coingeckoId: 'goerli',
    },
  },
  [Chains.MAINNET]: {
    isTest: false,
    chainId: Chains.MAINNET,
    name: 'Ethereum',
    rpcUrl: RPC_URL[Chains.MAINNET],
    explorerUrl: 'https://etherscan.io',
    coingeckoChain: 'ethereum',
    coinMarketId: '1027',
    coinMarketName: 'Ethereum',
    eip1559: true,
    displayPriority: 1,
    nativeToken: {
      name: 'ETH',
      symbol: 'ETH',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      coingeckoId: 'ethereum',
    },
  },
  [Chains.POLYGON]: {
    isTest: false,
    chainId: Chains.POLYGON,
    name: 'Polygon',
    rpcUrl: RPC_URL[Chains.POLYGON],
    explorerUrl: 'https://polygonscan.com',
    coingeckoChain: 'polygon-pos',
    coinMarketId: '3890',
    coinMarketName: 'Polygon',
    eip1559: true,
    displayPriority: 2,
    nativeToken: {
      name: 'MATIC',
      symbol: 'MATIC',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      coingeckoId: 'matic-network',
    },
  },
  [Chains.BSC]: {
    isTest: false,
    chainId: Chains.BSC,
    name: 'BSC',
    rpcUrl: RPC_URL[Chains.BSC],
    explorerUrl: 'https://bscscan.com',
    coingeckoChain: 'binance-smart-chain',
    coinMarketId: '1839',
    coinMarketName: 'BNB Smart Chain (BEP20)',
    eip1559: false,
    displayPriority: 3,
    nativeToken: {
      name: 'BNB',
      symbol: 'BNB',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      coingeckoId: 'binancecoin',
    },
  },
  [Chains.FANTOM]: {
    isTest: false,
    chainId: Chains.FANTOM,
    name: 'Fantom',
    rpcUrl: RPC_URL[Chains.FANTOM],
    explorerUrl: 'https://ftmscan.com',
    coingeckoChain: 'fantom',
    coinMarketId: '3513',
    coinMarketName: 'Fantom',
    eip1559: false,
    displayPriority: 4,
    nativeToken: {
      name: 'FTM',
      symbol: 'FTM',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      coingeckoId: 'fantom',
    },
  },
  [Chains.AVALANCHE]: {
    isTest: false,
    chainId: Chains.AVALANCHE,
    name: 'Avalanche',
    rpcUrl: RPC_URL[Chains.AVALANCHE],
    explorerUrl: 'https://snowtrace.io',
    coingeckoChain: 'avalanche',
    coinMarketId: '5805',
    coinMarketName: 'Avalanche C-Chain',
    eip1559: false,
    displayPriority: 5,
    nativeToken: {
      name: 'AVAX',
      symbol: 'AVAX',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      coingeckoId: 'avalanche-2',
    },
  },
  [Chains.ARBITRUM]: {
    isTest: false,
    chainId: Chains.ARBITRUM,
    name: 'Arbitrum',
    rpcUrl: RPC_URL[Chains.ARBITRUM],
    explorerUrl: 'https://arbiscan.io',
    coingeckoChain: 'arbitrum-one',
    coinMarketId: '51',
    eip1559: false,
    displayPriority: 6,
    nativeToken: {
      name: 'ETH',
      symbol: 'ETH',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      coingeckoId: 'ethereum',
    },
  },
  [Chains.OPTIMISM]: {
    isTest: false,
    chainId: Chains.OPTIMISM,
    name: 'Optimism',
    rpcUrl: RPC_URL[Chains.OPTIMISM],
    explorerUrl: 'https://optimistic.etherscan.io',
    coingeckoChain: 'optimistic-ethereum',
    coinMarketId: '11840',
    eip1559: false,
    displayPriority: 7,
    nativeToken: {
      name: 'ETH',
      symbol: 'ETH',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
      coingeckoId: 'ethereum',
    },
  },
};

const createRpcProvider = (chainId: Chains) => {
  const rpcUrl = RPC_URL[chainId];
  return new StaticJsonRpcProvider(rpcUrl, {
    chainId,
    name: CHAIN_TO_NAME[chainId],
  });
};

export const RPC_PROVIDERS: Record<Chains, StaticJsonRpcProvider> = {
  [Chains.MAINNET]: createRpcProvider(Chains.MAINNET),
  [Chains.GOERLI]: createRpcProvider(Chains.GOERLI),
  [Chains.OPTIMISM]: createRpcProvider(Chains.OPTIMISM),
  [Chains.ARBITRUM]: createRpcProvider(Chains.ARBITRUM),
  [Chains.AVALANCHE]: createRpcProvider(Chains.AVALANCHE),
  [Chains.POLYGON]: createRpcProvider(Chains.POLYGON),
  [Chains.BSC]: createRpcProvider(Chains.BSC),
  [Chains.FANTOM]: createRpcProvider(Chains.FANTOM),
};
