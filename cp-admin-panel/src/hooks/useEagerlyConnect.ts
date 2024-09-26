import { Connector } from '@web3-react/types';
import { useEffect } from 'react';
import { networkConnection } from 'src/connection/connectors/network';
import { Connection } from 'src/connection/types';
import { getConnection } from 'src/connection/utils';
import { useAppSelector, useAppDispatch } from 'src/store/hooks/reduxHooks';
import { setSelectedWallet } from 'src/store/payment/slice';

async function connect(connector: Connector): Promise<void> {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly();
    } else {
      await connector.activate();
    }
  } catch (error) {
    console.error('eager connection error', error);
    throw new Error('eager connection failed');
  }
}

export default function useEagerlyConnect(): void {
  const { selectedWallet } = useAppSelector(({ payment }) => payment);
  const dispatch = useAppDispatch();

  let selectedConnection: Connection | undefined;

  if (selectedWallet) {
    try {
      selectedConnection = getConnection(selectedWallet);
    } catch {
      dispatch(setSelectedWallet(undefined));
    }
  }

  useEffect(() => {
    connect(networkConnection.connector);

    if (selectedConnection) {
      connect(selectedConnection.connector);
    }
  }, [selectedConnection]);
}
