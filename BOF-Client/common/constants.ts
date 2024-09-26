import { Chains } from 'connection/chainConfig';
import { TabsList } from '@/redux/redux.enum';

export const ARTICLES_PER_PAGE = 4;
export const CONTACT_US_EMAIL_ADDRESS = 'support@bitoftrade.zendesk.com';
export const LOGO_URL = '/images/bitoftrade-logo.png';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export enum Exchanges {
  PARASWAP = 'PARASWAP',
  ZeroX = 'ZeroX',
}

export const PROXY_APPROVE_ADDRESSES = {
  [Exchanges.PARASWAP]: '0x216B4B4Ba9F3e719726886d34a177484278Bfcae',
};

export const EXCHANGES_API_URL = {
  [Exchanges.PARASWAP]: 'https://api.paraswap.io',
  [Exchanges.ZeroX]: 'https://api.0x.org',
};

const availableChainsLeverage = [Chains.MAINNET, Chains.GOERLI];
const availableChainsSwap = [
  Chains.MAINNET,
  Chains.POLYGON,
  Chains.AVALANCHE,
  Chains.FANTOM,
  Chains.BSC,
  Chains.ARBITRUM,
  Chains.OPTIMISM,
];
const availableChainsLimit = [Chains.MAINNET];
const availableChainsCrossSwap = [Chains.POLYGON, Chains.BSC];

export const availableChains: Record<TabsList, Chains[]> = {
  [TabsList.LEVERAGE]: availableChainsLeverage,
  [TabsList.SWAP]: availableChainsSwap,
  [TabsList.LIMIT]: availableChainsLimit,
  [TabsList.CROSS_CHAIN]: availableChainsCrossSwap,
};

if (process.env.NEXT_PUBLIC_NEXT_ENV !== 'production') {
  availableChainsSwap.push(Chains.GOERLI);
}

export { availableChainsSwap, availableChainsLimit, availableChainsLeverage, availableChainsCrossSwap };
