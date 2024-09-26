import { useInfiniteQuery } from '@tanstack/react-query';
import { constructFetchNfts, GetNtfsByWalletResponse, Nft } from '../services/moralis/nft-api';
import { useWalletContext } from 'context/WalletContext';
import { chainConfigs } from 'utils/chains';
import { assert } from 'ts-essentials';
import { useEffect, useMemo } from 'react';
import { useNftOrders } from './useNftOrders';
import { toByTokenAddressAndTokenId, getNftsWithOrders } from 'features/NftPortfolio/utils/common';
import { NftsSearchFilters } from 'features/NftPortfolio/hooks/useNftSearchFilters';

type FetchNftsInput = {
  pageParam?: GetNtfsByWalletResponse['cursor'];
  signal?: AbortSignal;
};

const delayBetweenPaginatedRequests = 100;

type UseAllNftsResult = {
  allNfts: Nft[];
  noNfts: boolean;
};

export const useAllNfts = (nftSearchFilters: NftsSearchFilters): UseAllNftsResult => {
  const { account, walletChain } = useWalletContext();

  const moralisChain = walletChain && chainConfigs[walletChain]?.moralisName;
  const chainIdDecimal = walletChain && chainConfigs[walletChain]?.chainIdDecimal;

  const { data: orders } = useNftOrders({ maker: account, chainId: chainIdDecimal });

  const { fetchNextPage, data, hasNextPage, isLoading, isFetching, isFetchedAfterMount } = useInfiniteQuery<
    GetNtfsByWalletResponse,
    Error,
    GetNtfsByWalletResponse
  >({
    queryKey: ['nftList', account, moralisChain],
    queryFn: ({ pageParam: cursor, signal }: FetchNftsInput) => {
      assert(account && moralisChain, 'account && moralisChain guaranteed by `enabled`');

      const fetchFn = constructFetchNfts({
        address: account,
        chain: moralisChain,
      });

      return fetchFn({ cursor, signal });
    },
    enabled: !!account && !!moralisChain,
    getNextPageParam: lastPage => {
      return lastPage?.cursor;
    },
    onSuccess: result => {
      const lastPage = result.pages[result.pages.length - 1];
      const hasMore = !!lastPage.cursor;
      if (!hasMore) return;
      // don't send back to back
      setTimeout(fetchNextPage, delayBetweenPaginatedRequests);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const allNfts = useMemo(() => {
    let allPagesNfts = data
      ? data.pages
          .map(page => page.result)
          .flat()
          .filter(nft => !!nft)
      : [];

    if (!allPagesNfts.length) return allPagesNfts;

    if (nftSearchFilters && nftSearchFilters.searchQuery) {
      allPagesNfts = allPagesNfts.filter(nft => {
        const nftName = nft.normalized_metadata ? nft.normalized_metadata.name : nft.name;
        const searchQuery = nftSearchFilters.searchQuery;
        return nftName?.toLowerCase().includes(searchQuery?.toLowerCase() ?? '');
      });
    }

    if (nftSearchFilters && nftSearchFilters.filterByOrderOption && orders) {
      const nftsWithOrders = getNftsWithOrders(allPagesNfts, orders);
      const nftWithOrdersListMap = toByTokenAddressAndTokenId(nftsWithOrders);

      switch (nftSearchFilters.filterByOrderOption) {
        case 'With order':
          allPagesNfts = nftsWithOrders;
          break;
        case 'Without order':
          allPagesNfts = allPagesNfts.filter(
            nft => !nftWithOrdersListMap[nft.token_address.toLowerCase()]?.[nft.token_id.toLowerCase()]
          );
          break;
      }
    }

    return allPagesNfts;
  }, [data, nftSearchFilters, orders]);

  const noNfts = useMemo(() => !allNfts.length && !isLoading && !isFetching, [allNfts.length, isLoading, isFetching]);

  useEffect(() => {
    // proceed where stopped (f.x. if change network and then back to original network)
    if (hasNextPage && !isFetchedAfterMount) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchedAfterMount]);

  return {
    noNfts,
    allNfts,
  };
};
