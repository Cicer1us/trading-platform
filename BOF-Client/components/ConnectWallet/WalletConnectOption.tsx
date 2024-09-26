import { WalletConnectIcon } from '@/assets/icons/WalletConnectIcon';
import { Connector } from '@web3-react/types';
import { walletConnectConnection, ConnectionType } from 'connection/connectors';
import { getConnectionName } from 'connection/utils';

import WalletOption from './WalletOption';

export function WalletConnectOption({
  tryActivation,
  isLoading,
}: {
  isLoading: boolean;
  tryActivation: (connector: Connector) => void;
}) {
  const isActive = walletConnectConnection.hooks.useIsActive();
  return (
    <WalletOption
      icon={<WalletConnectIcon />}
      isLoading={isLoading}
      isActive={isActive}
      onClick={() => tryActivation(walletConnectConnection.connector)}
      title={getConnectionName(ConnectionType.WALLET_CONNECT)}
    />
  );
}
