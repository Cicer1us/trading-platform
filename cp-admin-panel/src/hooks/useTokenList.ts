import { useQuery } from '@tanstack/react-query';
import { getTokenLists } from 'src/api/payment/tokens';
import { ONE_HOUR } from 'src/common/time';
import { Token } from 'src/connection/types';

export const constructTokenListCacheKey = () => ['tokensLists'];

export const useTokensLists = () => {
  return useQuery<Record<string, Token[]>>(constructTokenListCacheKey(), () => getTokenLists(), {
    cacheTime: ONE_HOUR,
    staleTime: ONE_HOUR
  });
};
