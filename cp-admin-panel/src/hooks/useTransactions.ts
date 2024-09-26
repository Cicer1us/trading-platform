import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from 'src/store/hooks/reduxHooks';
import { ApprovalTransaction, PaymentTransaction, Transaction } from 'src/store/transactions/slice';
import { useRouter } from 'next/router';

type UsePendingTransactionsByTypeResult = {
  pendingApprovalTxs: ApprovalTransaction[];
  pendingPaymentTxs: PaymentTransaction[];
};

export const usePendingTransactions = (): Transaction[] => {
  // TODO: consider moving orderId getter to separate hook
  const { query } = useRouter();
  const orderId = query.orderId as string;
  // TODO: add eager wallet connect, because now after page reload account is undefined and transactions is empty array
  const { account } = useWeb3React();
  const allTransactions = useAppSelector(({ transactions }) =>
    account ? transactions[account?.toLowerCase()] || [] : []
  );

  return useMemo(
    // added filtering by payment id to prevent screen handling for different payments
    () => allTransactions.filter(tx => !tx.receipt).filter(tx => tx.paymentId === orderId),
    [allTransactions, orderId]
  );
};

export const usePendingTransactionsByType = (): UsePendingTransactionsByTypeResult => {
  const pendingTransactions = usePendingTransactions();

  return useMemo(
    () => ({
      pendingApprovalTxs: pendingTransactions.filter((tx): tx is ApprovalTransaction => tx.type === 'approval'),
      pendingPaymentTxs: pendingTransactions.filter((tx): tx is PaymentTransaction => tx.type === 'payment')
    }),
    [pendingTransactions]
  );
};
