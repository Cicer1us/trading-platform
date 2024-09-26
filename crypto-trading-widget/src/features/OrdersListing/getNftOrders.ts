import { constructGetNFTOrders, constructAxiosFetcher, constructPartialSDK } from '@paraswap/sdk';
import axios from 'axios';

const fetcher = constructAxiosFetcher(axios);
interface GetNftOrders {
  chainId: number;
  maker: string;
}

export const getNftOrders = async ({ chainId, maker }: GetNftOrders) => {
  const paraSwapLimitOrderSDK = constructPartialSDK(
    {
      chainId,
      fetcher,
    },
    constructGetNFTOrders
  );
  return paraSwapLimitOrderSDK.getNFTOrders({
    maker,
    type: 'LIMIT',
  });
};
