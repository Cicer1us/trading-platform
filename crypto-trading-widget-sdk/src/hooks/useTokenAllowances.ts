import { Chain, chainConfigs } from '../utils/chains';
import { useQuery } from '@tanstack/react-query';
import { getTokenList } from '../data/tokens/tokenLists';
import { bitoftradeUtils } from '../utils/bitoftradeUtils';

const ALLOWANCES_POOL_TIME = 1000 * 60 * 10;

const getAllowances = async (userAccount: string, chain: Chain) => {
  return bitoftradeUtils.getMultipleAllowanceAmount(
    userAccount,
    chainConfigs[chain].chainIdDecimal,
    getTokenList(chain)
  );
};

export const constructAllowanceCacheKey = (account?: string, chain?: Chain) => ['allowancesData', account, chain];

export const useTokenAllowances = (account: string, chain: Chain) => {
  return useQuery({
    queryKey: constructAllowanceCacheKey(account, chain),
    // TODO: learn about {signal}
    queryFn: () => getAllowances(account, chain),
    enabled: !!account?.length,
    cacheTime: ALLOWANCES_POOL_TIME,
    staleTime: ALLOWANCES_POOL_TIME,
  });
};
