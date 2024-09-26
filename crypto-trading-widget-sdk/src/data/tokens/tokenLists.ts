import { Chain, chainConfigs, TokenBasicInfo } from '../../utils/chains';

import ethereumTokens from './etherum-uniswap.json';
import polygonTokens from './polygon-quickswap.json';
import avalancheTokens from './avalanche-pangolin.json';
import bscTokens from './bsc-pancake.json';
import fantomTokens from './fantom-spooky.json';

const filterByChainId = (tokens: TokenBasicInfo[], chain: Chain): TokenBasicInfo[] => {
  const chainId = chainConfigs[chain].chainIdDecimal;
  return tokens.filter(token => token.chainId === chainId);
};

export const getTokenList = (chain: Chain): TokenBasicInfo[] => {
  switch (chain) {
    case Chain.Ethereum:
      return filterByChainId(ethereumTokens.tokens as TokenBasicInfo[], chain);
    case Chain.Polygon:
      return filterByChainId(polygonTokens.tokens as TokenBasicInfo[], chain);
    case Chain.Avalanche:
      return filterByChainId(avalancheTokens.tokens as TokenBasicInfo[], chain);
    case Chain.Fantom:
      return filterByChainId(fantomTokens.tokens as TokenBasicInfo[], chain);
    case Chain.Bsc:
      return filterByChainId(bscTokens.tokens as TokenBasicInfo[], chain);
  }
};
