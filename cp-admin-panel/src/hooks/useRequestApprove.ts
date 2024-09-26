import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { ChainId } from 'src/connection/types';
import { requestApprove } from 'src/common/bofUtils';
import { PAYMENT_SPENDER } from 'src/common/constants';
import { useCallback, useMemo } from 'react';
import { TransactionResponse } from '@ethersproject/providers';
import { useAppDispatch } from 'src/store/hooks/reduxHooks';
import { PaymentScreen, setPaymentScreen } from 'src/store/payment/slice';
import { addTransaction } from 'src/store/transactions/slice';
import { assert } from 'ts-essentials';
import { useRouter } from 'next/router';

type ApprovalTransactionResponse = TransactionResponse & {
  tokenAddress: string;
  amount: string | undefined;
  spender: string;
};

type UseRequestApproveInput = Pick<
  UseMutationOptions<ApprovalTransactionResponse, Error, string | undefined>,
  'onMutate' | 'onSuccess' | 'onError'
>;

export const constructRequestApproveKey = (chainId: ChainId, tokenAddress: string) => [
  'requestApprove',
  chainId,
  tokenAddress
];

export const useRequestApprove = (chainId: ChainId, tokenAddress: string) => {
  const { query } = useRouter();
  const { account, provider } = useWeb3React();
  const dispatch = useAppDispatch();
  const orderId = query.orderId as string;

  const unlockAsset = useCallback(
    async (amount?: string): Promise<ApprovalTransactionResponse> => {
      const spender = PAYMENT_SPENDER[chainId];
      assert(account && provider && spender, 'one of the param is undefined');

      const tx = await requestApprove(provider, {
        amount,
        chainId: Number(chainId),
        tokenAddress,
        clientAddress: account,
        spender
      });

      return {
        ...tx,
        tokenAddress,
        amount,
        spender
      };
    },
    [account, chainId, provider, tokenAddress]
  );

  const callbacks: UseRequestApproveInput = useMemo(
    () => ({
      onSuccess: async (tx: ApprovalTransactionResponse) => {
        dispatch(
          addTransaction({
            paymentId: orderId,
            type: 'approval',
            chainId: Number(chainId),
            tokenAddress: tx.tokenAddress,
            from: tx.from,
            hash: tx.hash,
            amount: tx.amount,
            spender: tx.spender
          })
        );
        dispatch(setPaymentScreen(PaymentScreen.UNLOCK_WAITING));
      },
      onError: (error: Error) => {
        console.error('unlockAsset error', error);
        dispatch(setPaymentScreen(PaymentScreen.UNLOCK_ERROR));
      }
    }),
    [chainId, dispatch, orderId]
  );

  return useMutation<ApprovalTransactionResponse, Error, string | undefined>(
    constructRequestApproveKey(chainId, tokenAddress),
    unlockAsset,
    callbacks
  );
};
