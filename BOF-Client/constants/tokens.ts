import { Token } from '@/interfaces/Tokens.interface';
import { usdcToken } from '@bitoftrade/cross-chain-core';
import { Chains } from 'connection/chainConfig';

export const USDC_ADDRESS = {
  [Chains.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [Chains.AVALANCHE]: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
  [Chains.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  [Chains.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  [Chains.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
};

const USDC_LOGO_URI =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png';

export const DEFAULT_STABLE_TOKEN: Record<Chains, Token> = {
  [Chains.MAINNET]: { ...usdcToken[Chains.MAINNET], logoURI: USDC_LOGO_URI },
  [Chains.AVALANCHE]: { ...usdcToken[Chains.AVALANCHE], logoURI: USDC_LOGO_URI },
  [Chains.BSC]: { ...usdcToken[Chains.BSC], logoURI: USDC_LOGO_URI },
  [Chains.POLYGON]: { ...usdcToken[Chains.POLYGON], logoURI: USDC_LOGO_URI },
  [Chains.OPTIMISM]: { ...usdcToken[Chains.OPTIMISM], logoURI: USDC_LOGO_URI },
  [Chains.ARBITRUM]: { ...usdcToken[Chains.ARBITRUM], logoURI: USDC_LOGO_URI },
  [Chains.FANTOM]: { ...usdcToken[Chains.FANTOM], logoURI: USDC_LOGO_URI },
  [Chains.GOERLI]: {
    address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    chainId: Chains.GOERLI,
    logoURI: USDC_LOGO_URI,
  },
};
