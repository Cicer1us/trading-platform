import { Web3ReactProvider } from '@web3-react/core';
import { ReactNode } from 'react';
import { connectors } from 'src/connection/connectors';
import useEagerlyConnect from 'src/hooks/useEagerlyConnect';

interface WalletProviderProps {
  children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  useEagerlyConnect();

  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>;
}
