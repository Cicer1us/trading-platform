import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { Connector } from '@web3-react/types';
import { useCallback, useMemo } from 'react';
import { Connection } from 'src/connection/types';
import { getConnection } from 'src/connection/utils';
import { useAppDispatch } from 'src/store/hooks/reduxHooks';
import { useModalState } from 'src/store/modal/hooks/useModalState';
import { setSelectedWallet } from 'src/store/payment/slice';

type UseConnectWalletCallbacks = Pick<
  UseMutationOptions<Connector, Error, Connection>,
  'onMutate' | 'onSuccess' | 'onError'
>;

export const constructWalletConnectKey = () => ['walletConnect'];

export const useConnectWallet = (): UseMutationResult<Connector, Error, Connection> => {
  const { closeModal } = useModalState();
  const dispatch = useAppDispatch();

  const connectWallet = useCallback(async ({ connector }: { connector: Connector }): Promise<Connector> => {
    await connector.activate();

    return connector;
  }, []);

  const callbacks: UseConnectWalletCallbacks = useMemo(
    () => ({
      onSuccess: (connector: Connector) => {
        const connection = getConnection(connector);
        dispatch(setSelectedWallet(connection.type));

        closeModal();
      }
    }),
    [closeModal, dispatch]
  );

  return useMutation<Connector, Error, Connection>(constructWalletConnectKey(), connectWallet, callbacks);
};
