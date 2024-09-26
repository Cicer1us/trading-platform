import { useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { getMultipleAllowances } from 'src/common/bofUtils';
import { PAYMENT_SPENDER } from 'src/common/constants';
import { ONE_MINUTE } from 'src/common/time';
import { ChainId, Token } from 'src/connection/types';
import { useTokensLists } from './useTokenList';

export const constructTokenAllowancesCacheKey = (chainId: ChainId, account: string) => [
  'tokensAllowances',
  chainId,
  account
];

export const useTokenAllowances = (chainId: ChainId) => {
  const { account } = useWeb3React();
  const { data: tokensLists } = useTokensLists();

  return useQuery(
    constructTokenAllowancesCacheKey(chainId, account ?? ''),
    () => getMultipleAllowances(account ?? '', chainId, tokensLists?.[chainId] as Token[], PAYMENT_SPENDER[chainId]),
    {
      enabled: !!account?.length && !!tokensLists?.[chainId],
      cacheTime: ONE_MINUTE,
      staleTime: ONE_MINUTE
    }
  );
};
