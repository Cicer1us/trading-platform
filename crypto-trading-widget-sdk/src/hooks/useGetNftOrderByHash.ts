import { NFTOrderFromAPI } from '@paraswap/sdk';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PARASWAP_API_URL } from '../constants';

const getNftOrderByHash = async (hash: string) => {
  const { data } = await axios.get(`${PARASWAP_API_URL}/nft/order/${hash}`);
  return data;
};

export const useGetNftOrderByHash = (hash: string) => {
  return useQuery<NFTOrderFromAPI>({
    queryKey: ['nftOrder', hash],
    queryFn: () => getNftOrderByHash(hash),
    enabled: !!hash?.length,
  });
};
