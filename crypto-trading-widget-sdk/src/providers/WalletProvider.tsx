import React from 'react';
import { ReactNode } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { CONNECTORS } from 'utils/connections';
import useEagerlyConnect from 'hooks/useEagerlyConnect';

export const WalletProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  useEagerlyConnect();

  return <Web3ReactProvider connectors={CONNECTORS}>{children}</Web3ReactProvider>;
};
