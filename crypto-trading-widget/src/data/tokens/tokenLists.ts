import { Chain, chainConfigs } from '../../utils/chains';
import { Token } from './token.interface';

import ethereumTokens from './etherum-uniswap.json';
import polygonTokens from './polygon-quickswap.json';
import avalancheTokens from './avalanche-pangolin.json';
import bscTokens from './bsc-pancake.json';
import fantomTokens from './fantom-spooky.json';

const filterByChainId = (tokens: Token[], chain: Chain): Token[] => {
  const chainId = chainConfigs[chain].chainIdDecimal;
  return tokens.filter(token => token.chainId === chainId);
};

export const getTokenList = (chain: Chain): Token[] => {
  switch (chain) {
    case Chain.Ethereum:
      return filterByChainId(ethereumTokens.tokens as Token[], chain);
    case Chain.Polygon:
      return filterByChainId(polygonTokens.tokens as Token[], chain);
  }
};
