import { NFTOrderFromAPI, OptimalRate } from '@paraswap/sdk';
import { Chain } from 'utils/chains';
import BigNumber from 'bignumber.js';
import { TransactionRequest, TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { useMutation } from '@tanstack/react-query';
import { UseMutationOptions } from '@tanstack/react-query/src/types';
import { constructNftTakerSdk } from 'services/paraswap/constructNftTakerSdk';

interface SwapAndTransferNftParams {
  library: Web3Provider;
  order: NFTOrderFromAPI;
  chain: Chain;
  account: string;
  priceRoute: OptimalRate;
}

export const useCreateSwapAndTransferNftTx = (
  queryKeyIdentifiers: { account?: string; orderHash?: string },
  options?: UseMutationOptions<TransactionResponse, Error, SwapAndTransferNftParams>
) => {
  const swapAndTransfer = async ({ library, chain, account, order, priceRoute }: SwapAndTransferNftParams) => {
    const takerSDK = constructNftTakerSdk(library, chain, account);

    const { gas: payloadGas, ...swapAndNFTPayloadTxParams } = await takerSDK.buildSwapAndNFTOrderTx({
      priceRoute,
      userAddress: account,
      // TODO: Add partner address
      orders: [order],
    });

    const transaction: TransactionRequest = {
      ...swapAndNFTPayloadTxParams,
      gasPrice: '0x' + new BigNumber(swapAndNFTPayloadTxParams.gasPrice).toString(16),
      value: '0x' + new BigNumber(swapAndNFTPayloadTxParams.value).toString(16),
    };
    if (payloadGas) transaction.gasLimit = '0x' + new BigNumber(payloadGas).toString(16);

    return library.getSigner(account).sendTransaction(transaction);
  };

  const { account, orderHash } = queryKeyIdentifiers;
  return useMutation(['createSwapAndTransferNftTx', account, orderHash], swapAndTransfer, options);
};
