import { OptimalRate } from '@paraswap/sdk';
import { Chain } from 'src/common/constants';

export interface PaymentPrice extends PaymentTokenPrice {
  paymentId: string;
  fiatPrice: number;
  fiatCurrency: string;
}

export interface PaymentTokenPrice {
  chainId: Chain;
  payInAmount: string;
  payInHumanAmount: string;
  estimatedGasCostUSD: number;
  // price route is null for transfer case
  priceRoute: OptimalRate | null;
}
