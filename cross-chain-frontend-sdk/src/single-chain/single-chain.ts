import { OptimalRate, TransactionParams } from '@paraswap/sdk';
import { BuildSwapTx, GetSwapRateInput, SwapSettings } from './types';
import { API_URL } from '../constants';

export function constructSingleChainSdk() {
  async function getSingleChainSwapPrice({
    paraswapSdk,
    srcToken,
    srcDecimals,
    destToken,
    destDecimals,
    side,
    amount,
    partner,
    excludeContractMethods,
    includeContractMethods
  }: GetSwapRateInput): Promise<OptimalRate> {
    return paraswapSdk.swap.getRate({
      srcToken,
      destToken,
      srcDecimals: Number(srcDecimals),
      destDecimals: Number(destDecimals),
      amount,
      side,
      options: {
        partner,
        includeContractMethods,
        excludeContractMethods
      }
    });
  }

  async function buildSingleChainSwapTx({
    paraswapSdk,
    srcToken,
    srcDecimals,
    srcAmount,
    destToken,
    destDecimals,
    destAmount,
    userAddress,
    receiverAddress,
    priceRoute,
    partnerAddress,
    partnerFeeBps
  }: BuildSwapTx): Promise<TransactionParams> {
    return paraswapSdk.swap.buildTx({
      srcToken,
      srcDecimals,
      srcAmount,
      destToken,
      destDecimals,
      destAmount,
      userAddress,
      priceRoute,
      receiver: receiverAddress,
      partnerAddress,
      partnerFeeBps
    });
  }

  async function getSwapSettings(): Promise<SwapSettings> {
    const url = `${API_URL}/swap/settings`;
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    return {};
  }

  return {
    getSingleChainSwapPrice,
    getSwapSettings,
    buildSingleChainSwapTx
  };
}
