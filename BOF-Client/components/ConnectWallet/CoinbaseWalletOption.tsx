import { CoinbaseWalletIcon } from '@/assets/icons/CoinbaseWalletIcon';
import { Connector } from '@web3-react/types';
import { coinbaseWalletConnection, ConnectionType } from 'connection/connectors';
import { getConnectionName } from 'connection/utils';

import WalletOption from './WalletOption';

export function OpenCoinbaseWalletOption() {
  const isActive = coinbaseWalletConnection.hooks.useIsActive();
  return (
    <WalletOption
      isActive={isActive}
      link={`https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`}
      title="Open in Coinbase Wallet"
      icon={<CoinbaseWalletIcon />}
    />
  );
}

export function CoinbaseWalletOption({ tryActivation }: { tryActivation: (connector: Connector) => void }) {
  const isActive = coinbaseWalletConnection.hooks.useIsActive();
  return (
    <WalletOption
      isActive={isActive}
      onClick={() => tryActivation(coinbaseWalletConnection.connector)}
      title={getConnectionName(ConnectionType.COINBASE_WALLET)}
      icon={<CoinbaseWalletIcon />}
    />
  );
}
