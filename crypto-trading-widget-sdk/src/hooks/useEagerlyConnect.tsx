import { Connector } from '@web3-react/types';
import { useEffect } from 'react';
import { setSelectedWallet } from 'redux/appSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks/reduxHooks';
import { Connection, CONNECTIONS, ConnectionType, getConnection } from 'utils/connections';

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
  const { selectedWallet } = useAppSelector(({ app }) => app);
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
    connect(CONNECTIONS[ConnectionType.NETWORK].connector);

    if (selectedConnection) {
      connect(selectedConnection.connector);
    }
  }, [selectedConnection]);
}
