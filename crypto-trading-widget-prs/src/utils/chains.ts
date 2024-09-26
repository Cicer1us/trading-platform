import { Web3Provider } from '@ethersproject/providers';
import { Token } from '../data/tokens/token.interface';

export type TokenBasicInfo = Omit<Token, 'allowance' | 'allowanceStatus'>;

export type ChainConfig = {
  chainIdDecimal: number;
  chainIdHex: Chain;
  rpcUrl: string;
  name: string;
  explorerUrl: string;
  nativeToken: TokenBasicInfo;
  coingeckoNetwork: string;
  eip1559: boolean;
  isTest: boolean;
  coinMarketId: string;
  image: string;
  moralisName: string;
};

type NetworkById = Record<Chain, ChainConfig>;

export enum Chain {
  Ethereum = '0x1',
  Polygon = '0x89',
}

export const AVAILABLE_CHAINS = [Chain.Ethereum, Chain.Polygon];

// const infuraHttpUrl = 'https://mainnet.infura.io/v3/3b68cb4636674246a77fcca1e6bd9948';
const infuraHttpUrl = 'https://rpc.ankr.com/eth';

export const chainConfigs: NetworkById = {
  [Chain.Ethereum]: {
    isTest: false,
    chainIdDecimal: 1,
    chainIdHex: Chain.Ethereum,
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
      logoURI: `${process.env.NEXT_PUBLIC_APP_STORAGE}/eth.png`,
    },
    image: `${process.env.NEXT_PUBLIC_APP_STORAGE}/eth.png`,
  },
  [Chain.Polygon]: {
    isTest: false,
    chainIdDecimal: 137,
    chainIdHex: Chain.Polygon,
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
      logoURI: `${process.env.NEXT_PUBLIC_APP_STORAGE}/polygon.png`,
    },
    image: `${process.env.NEXT_PUBLIC_APP_STORAGE}/polygon.png`,
  },
};

export const getChainConfigs = (chains: Chain[]): ChainConfig[] => {
  const configs: ChainConfig[] = [];
  chains.forEach(chain => configs.push(chainConfigs[chain]));
  return configs;
};

export const checkChainAvailability = (chain: Chain): boolean => {
  const chainAvailable = AVAILABLE_CHAINS.find(ch => ch === chain);
  return !!chainAvailable;
};

function isErrorWithCode(error: unknown): error is { code: number } {
  return !!(error && typeof error === 'object' && 'code' in error);
}

export const switchChain = async (library: Web3Provider, chain: Chain, cb: (chain: Chain) => void) => {
  const provider = library.provider;
  if (!provider.request) {
    return;
  }
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain }],
    });
    cb(chain);
  } catch (error: unknown) {
    if ((isErrorWithCode(error) && error?.code === 4902) || String(error).includes('Unrecognized chain ID')) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chain,
              rpcUrls: [chainConfigs[chain].rpcUrl],
              chainName: chainConfigs[chain].name,
              iconUrls: [chainConfigs[chain].image],
              nativeCurrency: {
                name: chainConfigs[chain].nativeToken.name,
                symbol: chainConfigs[chain].nativeToken.symbol,
                decimals: chainConfigs[chain].nativeToken.decimals,
              },
              blockExplorerUrls: [chainConfigs[chain].explorerUrl],
            },
          ],
        });
        cb(chain);
      } catch (error) {
        // setError(error);
        console.error(error);
      }
    }
  }
};
