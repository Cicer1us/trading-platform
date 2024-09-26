import { Chain, chainConfigs } from '../utils/chains';
import { useQuery } from '@tanstack/react-query';
import { getTokenList } from '../data/tokens/tokenLists';
import { bitoftradeUtils } from '../utils/bitoftradeUtils';
import Web3 from 'web3';

const BALANCES_POOL_TIME = 1000 * 5;

const getBalances = async (userAccount: string, chain: Chain) => {
  const balances = await bitoftradeUtils.getMultipleBalances(
    userAccount,
    chainConfigs[chain].chainIdDecimal,
    getTokenList(chain)
  );

  const web3Inst = new Web3(chainConfigs[chain].rpcUrl);
  const accountBalanceWei = await web3Inst?.eth.getBalance(userAccount); //Will give value in.
  balances[chainConfigs[chain].nativeToken.address] = web3Inst?.utils.fromWei(accountBalanceWei ?? '0', 'ether');
  return balances;
};

export const useTokenBalances = (userAccount: string, chain: Chain) => {
  return useQuery({
    queryKey: ['balancesData', userAccount + chain],
    // TODO: learn about {signal}
    queryFn: () => getBalances(userAccount, chain),
    enabled: !!userAccount?.length,
    cacheTime: BALANCES_POOL_TIME,
    staleTime: BALANCES_POOL_TIME,
  });
};
