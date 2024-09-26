import { Web3Provider, TransactionReceipt } from '@ethersproject/providers';
import { UseQueryOptions, useQueries, useQueryClient } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { assert } from 'ts-essentials';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from 'src/store/hooks/reduxHooks';
import { Transaction, addReceipt } from 'src/store/transactions/slice';
import { usePendingTransactionsByType } from './useTransactions';
import { setPaymentScreen, PaymentScreen } from 'src/store/payment/slice';
import { constructTokenAllowancesCacheKey } from './useTokensAllowances';
import { constructTokensBalancesCacheKey } from './useTokensBalances';
import { ChainId } from 'src/connection/types';

function constructBaseTxQueryOptions(
  tx: Transaction,
  provider?: Web3Provider
): Pick<UseQueryOptions<TransactionReceipt>, 'queryKey' | 'queryFn' | 'staleTime' | 'cacheTime'> {
  assert(provider, 'provider is not defined');

  return {
    queryKey: ['transactionReceipt', `${tx.chainId}-${tx.hash}`],
    queryFn: (): Promise<TransactionReceipt> => provider.waitForTransaction(tx.hash),
    staleTime: Infinity,
    cacheTime: Infinity
  };
}

function constructApprovalTxQueryOptions(
  tx: Transaction,
  dispatch: ReturnType<typeof useAppDispatch>,
  queryClient: ReturnType<typeof useQueryClient>,
  chainId: ChainId,
  account: string
): UseQueryOptions<TransactionReceipt> {
  return {
    onSuccess: (receipt: TransactionReceipt): void => {
      dispatch(
        addReceipt({
          from: tx.from,
          chainId: tx.chainId,
          hash: tx.hash,
          receipt
        })
      );

      dispatch(setPaymentScreen(PaymentScreen.UNLOCK_SUCCESS));
      toast.success('Transaction success!');

      queryClient.invalidateQueries(constructTokenAllowancesCacheKey(chainId, account));
      queryClient.invalidateQueries(constructTokensBalancesCacheKey(chainId, account));
    },
    onError: (): void => {
      dispatch(setPaymentScreen(PaymentScreen.UNLOCK_ERROR));
      toast.error('Transaction failed!');
    }
  };
}

function constructPaymentTxQueryOptions(
  tx: Transaction,
  dispatch: ReturnType<typeof useAppDispatch>,
  queryClient: ReturnType<typeof useQueryClient>,
  chainId: ChainId,
  account: string
): UseQueryOptions<TransactionReceipt> {
  return {
    onSuccess: (receipt: TransactionReceipt): void => {
      dispatch(
        addReceipt({
          from: tx.from,
          chainId: tx.chainId,
          hash: tx.hash,
          receipt
        })
      );

      dispatch(setPaymentScreen(PaymentScreen.PAYMENT_SUCCESS));
      toast.success('Transaction success!');

      queryClient.invalidateQueries(constructTokenAllowancesCacheKey(chainId, account));
      queryClient.invalidateQueries(constructTokensBalancesCacheKey(chainId, account));
    },
    onError: (): void => {
      dispatch(setPaymentScreen(PaymentScreen.PAYMENT_ERROR));
      toast.error('Transaction failed!');
    }
  };
}

export function useTransactionsTracker(): void {
  const { selectedChainId } = useAppSelector(({ payment }) => payment);
  const { pendingApprovalTxs, pendingPaymentTxs } = usePendingTransactionsByType();
  const dispatch = useAppDispatch();
  const { provider, account } = useWeb3React();
  const queryClient = useQueryClient();

  const queriesOptions = useMemo<UseQueryOptions<TransactionReceipt>[]>(() => {
    // TODO: fix the case when tx chainId is not equal to provider chainId
    const approval = pendingApprovalTxs.map<UseQueryOptions<TransactionReceipt>>(tx => ({
      ...constructBaseTxQueryOptions(tx, provider),
      ...constructApprovalTxQueryOptions(tx, dispatch, queryClient, selectedChainId, account ?? '')
    }));
    const payment = pendingPaymentTxs.map<UseQueryOptions<TransactionReceipt>>(tx => ({
      ...constructBaseTxQueryOptions(tx, provider),
      ...constructPaymentTxQueryOptions(tx, dispatch, queryClient, selectedChainId, account ?? '')
    }));

    return [...approval, ...payment];
    // no need to add account as a dependency
    // because pendingApprovalTxs, pendingPaymentTxs and provider changed at the same time as account
  }, [dispatch, pendingApprovalTxs, pendingPaymentTxs, provider, queryClient, selectedChainId]);

  useQueries<UseQueryOptions<TransactionReceipt>[]>({ queries: queriesOptions });
}
