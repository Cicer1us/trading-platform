import { PriceRoute } from '../interfaces/paraswap';
import Web3 from 'web3';

export function getPriceRouteWithDeviation(priceRoute: PriceRoute): {
  destAmount: string;
  srcAmount: string;
} {
  const [destAmount, srcAmount] =
    priceRoute.side === 'SELL'
      ? [
          Web3.utils
            .toBN(priceRoute.destAmount)
            .mul(Web3.utils.toBN('99'))
            .div(Web3.utils.toBN('100'))
            .toString(),
          priceRoute.srcAmount,
        ]
      : [
          priceRoute.destAmount,
          Web3.utils
            .toBN(priceRoute.destAmount)
            .mul(Web3.utils.toBN('101'))
            .div(Web3.utils.toBN('100'))
            .toString(),
        ];
  return {
    destAmount,
    srcAmount,
  };
}
