import { useMemo } from 'react';
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import useEagerlyConnect from '@/hooks/useEagerlyConnect';
import useOrderedConnections from '@/hooks/useOrderedConnections';
import { Connector } from '@web3-react/types';
import { getConnectionName } from 'connection/utils';
import { Connection } from 'connection/connectors';

export interface WalletProviderProps {
  children: React.ReactNode;
}

const WalletProvider: React.FC = ({ children }) => {
  useEagerlyConnect();
  const connections = useOrderedConnections();
  const connectors: [Connector, Web3ReactHooks][] = connections.map(({ hooks, connector }) => [connector, hooks]);

  const key = useMemo(
    () => connections.map(({ type }: Connection) => getConnectionName(type)).join('-'),
    [connections]
  );

  return (
    <Web3ReactProvider connectors={connectors} key={key}>
      {children}
    </Web3ReactProvider>
  );
};

export default WalletProvider;
