import { useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { ChainId, Token } from 'src/connection/types';
import { ONE_MINUTE } from 'src/common/time';
import { getMultipleBalances } from 'src/common/bofUtils';
import { useTokensLists } from './useTokenList';

export const constructTokensBalancesCacheKey = (chainId: ChainId, account: string) => [
  'tokensBalances',
  chainId,
  account
];

export const useTokensBalances = (chainId: ChainId) => {
  const { account } = useWeb3React();
  const { data: tokensLists } = useTokensLists();

  return useQuery(
    constructTokensBalancesCacheKey(chainId, account ?? ''),
    () => getMultipleBalances(account ?? '', chainId, tokensLists?.[chainId] as Token[]),
    {
      enabled: !!account?.length && !!tokensLists?.[chainId],
      cacheTime: ONE_MINUTE,
      staleTime: ONE_MINUTE
    }
  );
};
