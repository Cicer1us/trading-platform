import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { useCallback, useMemo } from 'react';
import { WidgetScreen } from 'redux/app.interface';
import { setCurrentScreen, setSelectedChain, setSelectedWallet } from 'redux/appSlice';
import { useAppDispatch } from 'redux/hooks/reduxHooks';
import { NftWidgetScreen, setNftWidgetScreen } from 'redux/nftWidgetSlice';
import { Chain } from 'utils/chains';
import { Connection, getConnection } from 'utils/connections';

type UseConnectWalletCallbacks = Pick<
  UseMutationOptions<Connector, Error, Connection>,
  'onMutate' | 'onSuccess' | 'onError'
>;

export const constructWalletConnectKey = (): any[] => ['walletConnect'];

export const useConnectWallet = (): UseMutationResult<Connector, Error, Connection> => {
  const dispatch = useAppDispatch();
  const { chainId } = useWeb3React();

  const connectWallet = useCallback(async ({ connector }: { connector: Connector }): Promise<Connector> => {
    await connector.activate();

    return connector;
  }, []);

  const callbacks: UseConnectWalletCallbacks = useMemo(
    () => ({
      onSuccess: (connector: Connector): void => {
        const connection = getConnection(connector);

        dispatch(setSelectedChain(chainId as Chain));
        dispatch(setSelectedWallet(connection?.type));

        // don't know which widget is open now, so reset screens for both of them
        dispatch(setCurrentScreen(WidgetScreen.Default));
        dispatch(setNftWidgetScreen(NftWidgetScreen.DEFAULT));
      },
      onError: (): void => {
        console.error('error connecting wallet');
      },
    }),
    [chainId, dispatch]
  );

  return useMutation<Connector, Error, Connection>(constructWalletConnectKey(), connectWallet, callbacks);
};
