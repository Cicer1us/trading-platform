import { TransactionResponse } from '@ethersproject/providers';
import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { buildTx } from 'src/api/payment/order';
import { useAppDispatch, useAppSelector } from 'src/store/hooks/reduxHooks';
import { setPaymentScreen, PaymentScreen } from 'src/store/payment/slice';
import { addTransaction, PaymentTransaction } from 'src/store/transactions/slice';
import { assert } from 'ts-essentials';
import { OrderPrice } from './types';
import { constructPaymentPriceCacheKey } from './usePayment';

type UseCompleteOrderInput = Pick<UseMutationOptions<TransactionResponse, Error>, 'onMutate' | 'onSuccess' | 'onError'>;

export const constructCompleteOrderKey = (orderId: string, orderPrice: OrderPrice) => [
  'completeOrder',
  orderId,
  orderPrice
];

export const useCompleteOrder = (): UseMutationResult<TransactionResponse, Error, void> => {
  const { selectedToken, selectedChainId, selectedSlippage } = useAppSelector(({ payment }) => payment);
  const { account, provider } = useWeb3React();
  const { query } = useRouter();
  const orderId = query.orderId as string;

  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const orderPrice = queryClient.getQueryData(
    constructPaymentPriceCacheKey(orderId, selectedToken, selectedSlippage)
  ) as OrderPrice;

  const sendTransaction = useCallback(async (): Promise<TransactionResponse> => {
    assert(account && provider, 'account or provider is undefined');
    const { gas, ...params } = await buildTx(orderPrice, account);
    const txParams = { ...params, gasLimit: gas };

    const signer = provider.getSigner(account);
    const tx = await signer.sendTransaction(txParams);

    return tx;
  }, [account, orderPrice, provider]);

  const callbacks: UseCompleteOrderInput = useMemo(
    () => ({
      onSuccess: (tx: TransactionResponse): void => {
        const txData: PaymentTransaction = {
          type: 'payment',
          paymentId: orderId,
          from: tx.from,
          chainId: Number(selectedChainId),
          hash: tx.hash
        };

        dispatch(addTransaction(txData));
        dispatch(setPaymentScreen(PaymentScreen.PAYMENT_WAITING));
      },
      onError: (error: Error): void => {
        console.error('getTransaction error', error);
        // TODO: add different screens for error on this step and on transaction tracker
        dispatch(setPaymentScreen(PaymentScreen.PAYMENT_ERROR));
      }
    }),
    [dispatch, orderId, selectedChainId]
  );

  return useMutation<TransactionResponse, Error>(
    constructCompleteOrderKey(orderId, orderPrice),
    sendTransaction,
    callbacks
  );
};
