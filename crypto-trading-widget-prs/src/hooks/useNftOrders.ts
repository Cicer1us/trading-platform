import { useQuery } from '@tanstack/react-query';
import { getNftOrders, GetNftOrders } from '../services/paraswap/orderRequests';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import { getNftIdentifier } from '../features/NftPortfolio/utils/common';
import { COMMON_STALE_TIME } from '../constants';
import { assert } from 'ts-essentials';

export const useNftOrders = ({ maker, chainId }: Partial<GetNftOrders>) => {
  return useQuery({
    queryKey: ['nftOrders', maker, chainId],
    queryFn: () => {
      assert(maker && chainId, 'maker && chainId guaranteed by `enabled`');
      return getNftOrders({ maker, chainId });
    },
    enabled: !!maker && !!chainId,
    cacheTime: COMMON_STALE_TIME,
    staleTime: COMMON_STALE_TIME,
  });
};

const nftOrdersArrayToMap = (pendingNftOrders: NFTOrderFromAPI[]) => {
  const newNftOrdersMap: Record<string, NFTOrderFromAPI> = {};
  pendingNftOrders.forEach(nftOrder => {
    newNftOrdersMap[getNftIdentifier(nftOrder.makerAsset, nftOrder.makerAssetId)] = { ...nftOrder };
  });
  return newNftOrdersMap;
};

export const useNftOrdersMap = ({ maker, chainId }: GetNftOrders) => {
  const { data: nftOrders } = useNftOrders({ maker, chainId });

  return useQuery({
    queryKey: ['nftOrders', nftOrders],
    queryFn: () => nftOrdersArrayToMap(nftOrders ?? []),
    enabled: !!nftOrders && !!nftOrders.length,
    cacheTime: COMMON_STALE_TIME,
    staleTime: COMMON_STALE_TIME,
  });
};
