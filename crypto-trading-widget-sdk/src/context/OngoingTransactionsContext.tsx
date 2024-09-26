import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { TransactionResponse } from '@ethersproject/providers';
import { Chain, chainConfigs } from 'utils/chains';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import toast from 'react-hot-toast';

import { ToastForNftOrder } from 'features/Widget/ToasterAlerts/components/ToastForNftOrder';
import { CustomToast } from 'features/Widget/ToasterAlerts/components/CustomToast';
import { toasterMessages } from 'features/Widget/ToasterAlerts/utils';
import { WalletCtx } from './WalletContext';
import { useQueryClient } from '@tanstack/react-query';
import { constructAllowanceCacheKey } from '../hooks/useTokenAllowances';
import { assert } from 'ts-essentials';

/**
 * Transaction status and details Interfaces
 */
export enum TransactionStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  DONE = 'done',
}

export enum TransactionType {
  Approve = 'approve',
  NftPurchase = 'nftPurchase',
}

interface TransactionInfoBase {
  hash: string;
  status: TransactionStatus;
}

export interface NftPurchaseTransactionDetails {
  transactionType: TransactionType.NftPurchase;
  order: NFTOrderFromAPI;
}

export interface ApproveTransactionDetails {
  transactionType: TransactionType.Approve;
  tokenAddress: string;
}

export type TransactionDetails = NftPurchaseTransactionDetails | ApproveTransactionDetails;
export type TransactionInfo = TransactionDetails & TransactionInfoBase;

export interface OngoingTxCtxInterface {
  pushTransaction: (tx: TransactionResponse, chain: Chain, txInfo: TransactionDetails) => void;
  setOngoingTransactions: React.Dispatch<React.SetStateAction<TransactionInfo[]>>;
  ongoingTransactions: TransactionInfo[];
}

/**
 * OngoingTransactionsContext
 * This context is used to keep track of ongoing transactions
 * And details information about them to display it in the UI
 */
const notInitiatedFunction = () => {
  throw new Error('Context is not initiated');
};
export const OngoingTransactionsCtx = createContext<OngoingTxCtxInterface>({
  pushTransaction: notInitiatedFunction,
  setOngoingTransactions: notInitiatedFunction,
  ongoingTransactions: [],
});

const getToast = (
  status: 'success' | 'error' | 'loading',
  { txType, chain, orderHash }: { txType: TransactionType; chain?: Chain; orderHash?: string },
  hash?: string
) => {
  if (txType === TransactionType.NftPurchase) {
    assert(orderHash, 'hash should be defined for NftPurchase transaction');
    return (
      <ToastForNftOrder
        title={toasterMessages.nftPurchaseTx[status].title}
        description={toasterMessages.nftPurchaseTx[status].description}
        orderHash={orderHash}
      />
    );
  }
  return (
    <CustomToast
      title={toasterMessages.defaultTMessages[status].title}
      description={toasterMessages.defaultTMessages[status].description}
      txHash={hash}
      explorerUrl={chain ? chainConfigs[chain].explorerUrl : undefined}
    />
  );
};

export const OngoingTransactionsContext: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
  const ctx = useContext(WalletCtx);
  const queryClient = useQueryClient();

  const [ongoingTransactions, setOngoingTransactions] = useState<TransactionInfo[]>([]);

  const pushTransaction = useCallback(
    async (transactionResponse: TransactionResponse, chain: Chain, txInfo: TransactionDetails) => {
      setOngoingTransactions(prev => [
        ...prev,
        { ...txInfo, hash: transactionResponse.hash, status: TransactionStatus.PENDING },
      ]);

      const orderHash = txInfo?.transactionType === TransactionType.NftPurchase ? txInfo.order.orderHash : undefined;
      const details = {
        txType: txInfo.transactionType,
        chain,
        orderHash,
      };
      await toast.promise(transactionResponse.wait(), {
        loading: getToast('loading', details),
        success: receipt => {
          setOngoingTransactions(prev =>
            prev.map(tx => (tx.hash === receipt.transactionHash ? { ...tx, status: TransactionStatus.DONE } : tx))
          );
          queryClient.invalidateQueries(constructAllowanceCacheKey(ctx?.account, chain));

          return getToast('success', details, receipt.transactionHash);
        },
        error: () => {
          setOngoingTransactions(prev =>
            prev.map(tx => (tx.hash === tx.hash ? { ...tx, status: TransactionStatus.FAILED } : tx))
          );
          return getToast('error', details);
        },
      });
    },
    [ctx?.account]
  );

  const value = useMemo(
    () => ({ pushTransaction, ongoingTransactions, setOngoingTransactions }),
    [pushTransaction, ongoingTransactions, setOngoingTransactions]
  );

  return <OngoingTransactionsCtx.Provider value={value}>{children}</OngoingTransactionsCtx.Provider>;
};
