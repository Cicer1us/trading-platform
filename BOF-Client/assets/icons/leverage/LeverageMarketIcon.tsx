import React from 'react';
import { Icon1INCH } from './1INCH';
import { IconAAVE } from './AAVE';
import { IconBTC } from './BTC';
import { IconCOMP } from './COMP';
import { IconCRV } from './CRV';
import { IconETH } from './ETH';
import { IconLINK } from './LINK';
import { IconMKR } from './MKR';
import { IconSUSHI } from './SUSHI';
import { IconUSDC } from './USDC';
import { IconYFI } from './YFI';
import { IconZRX } from './ZRX';

interface LeverageTokenIconProps {
  market: string;
  size?: number;
}

export const LeverageMarketIcon: React.FC<LeverageTokenIconProps> = ({ size = 40, market }) => {
  if (market === 'BTC') return <IconBTC size={size} />;
  if (market === 'ETH') return <IconETH size={size} />;
  if (market === '1INCH') return <Icon1INCH size={size} />;
  if (market === 'AAVE') return <IconAAVE size={size} />;
  if (market === 'COMP') return <IconCOMP size={size} />;
  if (market === 'CRV') return <IconCRV size={size} />;
  if (market === 'LINK') return <IconLINK size={size} />;
  if (market === 'SUSHI') return <IconSUSHI size={size} />;
  if (market === 'YFI') return <IconYFI size={size} />;
  if (market === 'MKR') return <IconMKR size={size} />;
  if (market === 'ZRX') return <IconZRX size={size} />;
  return <IconUSDC size={size} />;
};
