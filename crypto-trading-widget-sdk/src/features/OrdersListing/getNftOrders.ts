import { constructGetNFTOrders, constructPartialSDK } from '@paraswap/sdk';
import { axiosFetcher } from 'services/paraswap/constructNftTakerSdk';

interface GetNftOrders {
  chainId: number;
  maker: string;
}

export const getNftOrders = async ({ chainId, maker }: GetNftOrders) => {
  const paraSwapLimitOrderSDK = constructPartialSDK(
    {
      chainId,
      fetcher: axiosFetcher,
    },
    constructGetNFTOrders
  );
  return paraSwapLimitOrderSDK.getNFTOrders({
    maker,
    type: 'LIMIT',
  });
};
