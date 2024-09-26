import { Connector } from '@web3-react/types';
import { Connection, gnosisSafeConnection, networkConnection } from '../connection/connectors';
import { getConnection } from 'connection/utils';
import { useEffect } from 'react';
import { updateSelectedWallet } from '@/redux/appSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks/reduxHooks';

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly();
    } else {
      await connector.activate();
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`);
  }
}

export default function useEagerlyConnect() {
  const selectedWallet = useAppSelector(state => state.app.selectedWallet);
  const dispatch = useAppDispatch();

  let selectedConnection: Connection | undefined;
  if (selectedWallet) {
    try {
      selectedConnection = getConnection(selectedWallet);
    } catch {
      dispatch(updateSelectedWallet({ wallet: undefined }));
    }
  }

  useEffect(() => {
    connect(gnosisSafeConnection.connector);
    connect(networkConnection.connector);

    if (selectedConnection) {
      connect(selectedConnection.connector);
    } // The dependency list is empty so this is only run once on mount
  }, []);

  return null;
}
