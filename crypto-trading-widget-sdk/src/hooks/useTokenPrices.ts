import { Chain, chainConfigs } from '../utils/chains';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTokensUsdPrices } from '@bitoftrade/bof-utils';

const TOKEN_PRICES_POOL_TIME = 1000 * 60;

export const useTokenPrices = (tokensLowerCase: string[], chain: Chain) => {
  const chainId = chainConfigs[chain].chainIdDecimal;
  const sortedTokens = useMemo(() => tokensLowerCase.sort((a, b) => a.localeCompare(b)), [tokensLowerCase]);

  return useQuery({
    queryKey: ['pricesData', sortedTokens, chainId],
    // TODO: learn about {signal}
    queryFn: () => getTokensUsdPrices(chainId, sortedTokens),
    enabled: !!tokensLowerCase?.length,
    cacheTime: TOKEN_PRICES_POOL_TIME,
    staleTime: TOKEN_PRICES_POOL_TIME,
  });
};
