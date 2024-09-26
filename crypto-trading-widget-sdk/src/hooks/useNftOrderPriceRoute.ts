import { useQuery } from '@tanstack/react-query';
import { Chain, chainConfigs } from 'utils/chains';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import { Token } from 'data/tokens/token.interface';
import { OptimalRate } from '@paraswap/sdk/src/types';
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { constructNftTakerSdk } from 'services/paraswap/constructNftTakerSdk';

interface UseNftOrderPriceRouteParams {
  library?: Web3Provider;
  chain: Chain;
  account?: string;
  order: NFTOrderFromAPI;
  srcToken?: Token;
  destToken?: Token;
}

const REFETCH_INTERVAL = 1000 * 5;

export const useNftOrderPriceRoute = ({
  library,
  chain,
  account,
  order,
  srcToken,
  destToken,
}: UseNftOrderPriceRouteParams) => {
  const getPriceRoute = async (): Promise<OptimalRate> => {
    if (!srcToken || !destToken) throw new Error('Missing params');
    const provider = new JsonRpcProvider(chainConfigs[chain].rpcUrl);
    const takerSDK = constructNftTakerSdk(library ?? provider, chain, account);
    // price route to buy desired erc20 token
    return takerSDK.getNFTOrdersRate(
      {
        srcToken: srcToken.address,
        srcDecimals: srcToken.decimals,
        destToken: destToken.address,
        destDecimals: destToken.decimals,
        userAddress: account,
      },
      [order]
    );
  };

  return useQuery<OptimalRate, Error>({
    queryKey: ['nftOrderPriceRoute', srcToken?.address],
    queryFn: getPriceRoute,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!srcToken && !!destToken && srcToken.address !== destToken.address,
  });
};
