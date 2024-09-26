import { initializeConnector } from '@web3-react/core';
import { ChainId, Connection, ConnectionType } from '../types';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { CHAINS_TO_DISPLAY } from '../chains';
import { WALLET_CONNECT_PROJECT_ID } from 'src/common/constants';

export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
  actions =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID ?? '',
        chains: [ChainId.MAINNET].map(Number),
        optionalChains: CHAINS_TO_DISPLAY.map(Number),
        showQrModal: true,
        qrModalOptions: {
          themeVariables: {
            '--wcm-z-index': '1301',
            '--wcm-accent-color': '#38D9C0',
            '--wcm-background-color': '#38D9C0'
          }
        }
      }
    })
);

export const walletConnectV2Connection: Connection = {
  connector: walletConnectV2,
  type: ConnectionType.WALLET_CONNECT_V2
};
