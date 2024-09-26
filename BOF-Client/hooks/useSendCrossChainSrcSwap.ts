import Web3 from 'web3';
import { SDK, buildCrossSwapTx } from '@/common/crossSwapSdk';
import { TransactionResponse } from '@ethersproject/providers';
import { Web3Provider } from '@ethersproject/providers';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { CrossPrice } from 'API/temporary-cross/get-cross-price';

type CrossChainSrcSwapParams = {
  user: string;
  data: CrossPrice;
  srcProvider: Web3Provider;
};

type UseSendCrossChainSrcSwapInput = Pick<
  UseMutationOptions<TransactionResponse, Error, CrossChainSrcSwapParams>,
  'onSuccess' | 'onError'
>;

type UseSendCrossChainSrcSwapOutput = UseMutationResult<TransactionResponse, Error, CrossChainSrcSwapParams>;

export function useSendCrossChainSrcSwap(
  mutationOptions: UseSendCrossChainSrcSwapInput
): UseSendCrossChainSrcSwapOutput {
  return useMutation({
    mutationFn: async (params: CrossChainSrcSwapParams) => {
      const { transaction } = await buildCrossSwapTx({
        user: params.user,
        data: params.data,
      });

      return SDK.sendCrossSrcTx({
        data: transaction.data,
        srcChainId: transaction.chainId,
        value: transaction.value,
        srcProvider: params.srcProvider,
        userAddress: params.user,
        gasPrice: Web3.utils.toHex(transaction.gasPrice),
        gasLimit: Web3.utils.toHex(transaction.gas),
      });
    },
    ...mutationOptions,
  });
}
