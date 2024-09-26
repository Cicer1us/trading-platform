import { useWeb3React } from '@web3-react/core';
import { ReactNode, useEffect } from 'react';
import { isSupportedChain } from 'src/common/helpers';
import { ChainId } from 'src/connection/types';
import { useTransactionsTracker } from 'src/hooks/useTransactionsTracker';
import { useAppDispatch } from 'src/store/hooks/reduxHooks';
import { setSelectedChainId } from 'src/store/payment/slice';

interface TransactionTrackerProps {
  children: ReactNode;
}

export const TransactionTracker = ({ children }: TransactionTrackerProps) => {
  // TODO: consider moving switchChain listener logic to Updater component
  const { chainId } = useWeb3React();
  const dispatch = useAppDispatch();

  useTransactionsTracker();

  useEffect(() => {
    const chain = chainId as ChainId | undefined;
    if (chain && isSupportedChain(chain)) {
      dispatch(setSelectedChainId(chain));
    }
  }, [chainId, dispatch]);

  return <>{children}</>;
};
