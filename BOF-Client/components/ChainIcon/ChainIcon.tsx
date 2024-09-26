import { Chains } from 'connection/chainConfig';
import React from 'react';
import EthIconNetworkSwitcher from '@/assets/icons/EthIconNetworkSwitcher';
import PolygonNetworkIcon from '@/assets/icons/PolygonNetworkIcon';
import BscLogo from '@/assets/icons/BscLogo';
import AvalancheLogo from '@/assets/icons/AvalancheLogo';
import FantomLogo from '@/assets/icons/FantomLogo';
import ArbitrumLogo from '@/assets/icons/ArbitrumLogo';
import OptimismLogo from '@/assets/icons/OptimismLogo';
import TestnetLogo from '@/assets/icons/TestnetLogo';

interface ChainIconProps {
  chainId: Chains;
}

export const ChainIcon: React.FC<ChainIconProps> = ({ chainId = Chains.MAINNET }: ChainIconProps) => {
  //TODO: can not reproduce the bug with missing icon in network switch
  // // somehow it can help to fix the bug with missing icon in network switch
  // if (isServer()) return null;

  return (
    <>
      {chainId === Chains.MAINNET && <EthIconNetworkSwitcher />}
      {chainId === Chains.POLYGON && <PolygonNetworkIcon />}
      {chainId === Chains.BSC && <BscLogo />}
      {chainId === Chains.AVALANCHE && <AvalancheLogo />}
      {chainId === Chains.FANTOM && <FantomLogo />}
      {chainId === Chains.ARBITRUM && <ArbitrumLogo />}
      {chainId === Chains.OPTIMISM && <OptimismLogo />}
      {chainId === Chains.GOERLI && <TestnetLogo />}
    </>
  );
};
