import LogoMetaMask from '@/assets/icons/LogoMetaMask';
import { Connector } from '@web3-react/types';
import { injectedConnection, ConnectionType } from 'connection/connectors';
import { getConnectionName } from 'connection/utils';
import WalletOption from './WalletOption';

export function InstallMetaMaskOption() {
  return <WalletOption title={'Install MetaMask'} link="https://metamask.io/" icon={<LogoMetaMask />} />;
}

export function MetaMaskOption({
  tryActivation,
  isLoading,
}: {
  isLoading: boolean;
  tryActivation: (connector: Connector) => void;
}) {
  const isActive = injectedConnection.hooks.useIsActive();
  return (
    <WalletOption
      icon={<LogoMetaMask />}
      isLoading={isLoading}
      isActive={isActive}
      title={getConnectionName(ConnectionType.INJECTED, true)}
      onClick={() => tryActivation(injectedConnection.connector)}
    />
  );
}

export function InjectedOption({
  tryActivation,
  isLoading,
}: {
  isLoading: boolean;
  tryActivation: (connector: Connector) => void;
}) {
  const isActive = injectedConnection.hooks.useIsActive();
  return (
    <WalletOption
      isLoading={isLoading}
      icon={<LogoMetaMask />}
      isActive={isActive}
      title={getConnectionName(ConnectionType.INJECTED, false)}
      onClick={() => tryActivation(injectedConnection.connector)}
    />
  );
}
