import { Chain, chainConfigs } from '../utils/chains';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Token } from 'data/tokens/token.interface';

const fetchTokenLists = async (chain: Chain) => {
  switch (chain) {
    case Chain.Ethereum:
      return axios.get('https://gateway.ipfs.io/ipns/tokens.uniswap.org');
    case Chain.Polygon:
      return axios.get('https://unpkg.com/quickswap-default-token-list@1.2.74/build/quickswap-default.tokenlist.json');
  }
};

const convertTokenListIntoMap = (tokenList: any, chain: Chain) => {
  const chainId = chainConfigs[chain].chainIdDecimal;
  const tokenMap: { [key: string]: Token } = {};
  tokenList.tokens.forEach((token: any) => {
    if (token.chainId === chainId) {
      tokenMap[token.address.toLowerCase()] = { ...token, address: token.address.toLowerCase() };
    }
  });
  const nativeToken = chainConfigs[chain].nativeToken;
  tokenMap[nativeToken.address] = nativeToken as Token;
  return tokenMap;
};

const fetchTokenListAndConvertIntoMap = async (chain: Chain) => {
  try {
    const tokenList = await fetchTokenLists(chain);
    return convertTokenListIntoMap(tokenList?.data, chain);
  } catch (e) {
    console.error(e);
    return {};
  }
};

const POOL_TIME = 1000 * 60 * 60;

export const useTokenList = (chain: Chain) => {
  return useQuery({
    queryKey: ['tokenLists', chain],
    queryFn: () => fetchTokenListAndConvertIntoMap(chain),
    enabled: !!chain,
    cacheTime: POOL_TIME,
    staleTime: POOL_TIME,
  });
};
