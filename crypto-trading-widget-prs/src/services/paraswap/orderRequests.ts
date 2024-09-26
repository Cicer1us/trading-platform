import axios from 'axios';
import {
  AssetType,
  BuildNFTOrderInput,
  constructAxiosFetcher,
  constructBuildNFTOrder,
  constructEthersContractCaller,
  constructGetNFTOrders,
  constructPartialSDK,
  constructPostNFTOrder,
  constructSignNFTOrder,
  constructApproveTokenForNFTOrder,
  NFTOrderToSend,
  SignableNFTOrderData,
  constructCancelLimitOrder,
  NFTOrderFromAPI,
} from '@paraswap/sdk';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { Nft } from '../moralis/nft-api';

const fetcher = constructAxiosFetcher(axios);

interface OrderAction {
  chainId: number;
  maker: string;
  provider: Web3Provider;
}

interface OrderRequests extends OrderAction {
  nft: Nft;
  tokenAddress: string;
  tokenAmount: string;
  expiry: number;
}

interface CancelOrder extends OrderAction {
  orderHash: string;
}

export interface GetNftOrders {
  chainId: number;
  maker: string;
}

interface SetApprovalForAll {
  chainId: number;
  maker: string;
  provider: Web3Provider;
  nftAddress: string;
}

export const setApprovalForAll = async ({ chainId, maker, provider, nftAddress }: SetApprovalForAll) => {
  const contractCaller = constructEthersContractCaller(
    {
      ethersProviderOrSigner: provider,
      EthersContract: Contract,
    },
    maker
  );

  const makerSDK = constructPartialSDK(
    {
      chainId,
      fetcher,
      contractCaller: contractCaller,
    },
    constructApproveTokenForNFTOrder
  );

  return makerSDK.approveNFTorNFTOrder(nftAddress);
};

export const getNftOrders = async ({ chainId, maker }: GetNftOrders): Promise<NFTOrderFromAPI[]> => {
  const paraSwapLimitOrderSDK = constructPartialSDK(
    {
      chainId,
      fetcher,
    },
    constructGetNFTOrders
  );

  const res = await paraSwapLimitOrderSDK.getNFTOrders({
    maker,
    type: 'LIMIT',
  });
  return res.orders.filter(order => order.state === 'PENDING');
};

export const createOrder = async ({
  maker,
  nft,
  tokenAddress,
  tokenAmount,
  provider,
  chainId,
  expiry,
}: OrderRequests) => {
  const contractCaller = constructEthersContractCaller(
    {
      ethersProviderOrSigner: provider,
      EthersContract: Contract,
    },
    maker
  );

  const paraSwapLimitOrderSDK = constructPartialSDK(
    {
      chainId,
      fetcher,
      contractCaller,
    },
    constructBuildNFTOrder,
    constructSignNFTOrder,
    constructPostNFTOrder
  );

  const makerAssetType = nft.contract_type === 'ERC1155' ? AssetType.ERC1155 : AssetType.ERC721;

  const orderInput: BuildNFTOrderInput = {
    nonce: 1,
    expiry,
    makerAsset: nft.token_address,
    makerAssetType,
    makerAssetId: nft.token_id,
    takerAssetType: AssetType.ERC20,
    takerAsset: tokenAddress,
    makerAmount: (1).toString(10),
    takerAmount: tokenAmount,
    maker,
  };

  const signableOrderData: SignableNFTOrderData = await paraSwapLimitOrderSDK.buildNFTOrder(orderInput);

  const signature: string = await paraSwapLimitOrderSDK.signNFTOrder(signableOrderData);

  const orderToPostToApi: NFTOrderToSend = {
    ...signableOrderData.data,
    signature,
  };

  return paraSwapLimitOrderSDK.postNFTLimitOrder(orderToPostToApi);
};

export const cancelOrder = ({ provider, maker, chainId, orderHash }: CancelOrder) => {
  const contractCaller = constructEthersContractCaller(
    {
      ethersProviderOrSigner: provider,
      EthersContract: Contract,
    },
    maker
  );

  const paraSwapLimitOrderSDK = constructPartialSDK(
    {
      chainId,
      fetcher,
      contractCaller,
    },
    constructCancelLimitOrder
  );
  return paraSwapLimitOrderSDK.cancelLimitOrder(orderHash);
};
