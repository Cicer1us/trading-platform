import axios from 'axios';
import { CrossChainSrcSwapTxInput, CrossChainSwapPriceInput, CrossChainSwapPrice } from './types';
import { TransactionParams } from '@bitoftrade/cross-chain-core';

export function constructCrossChainSdk({ crossChainApiUrl }: { crossChainApiUrl: string }) {
  async function getCrossChainSwapPrice({
    srcChainId,
    srcToken,
    srcTokenDecimals,
    destChainId,
    destToken,
    destTokenDecimals,
    amount,
    slippage
  }: CrossChainSwapPriceInput): Promise<CrossChainSwapPrice> {
    const url = `${crossChainApiUrl}/cross-swap-price?${new URLSearchParams({
      srcChainId: srcChainId.toString(),
      srcToken,
      srcTokenDecimals: srcTokenDecimals.toString(),
      destChainId: destChainId.toString(),
      destToken,
      destTokenDecimals: destTokenDecimals.toString(),
      amount,
      slippage: slippage.toString()
    }).toString()}`;

    const { data: price } = await axios.get<CrossChainSwapPrice>(url);

    return price;
  }

  async function buildCrossSrcTx({
    crossChainSwapPrice,
    userAddress,
    receiverAddress,
    refundAddress
  }: CrossChainSrcSwapTxInput): Promise<TransactionParams> {
    const { data: txParams } = await axios.post<TransactionParams>(`${crossChainApiUrl}/build-cross-src-tx`, {
      crossSwapPrice: crossChainSwapPrice,
      srcUserAddress: userAddress,
      destUserAddress: receiverAddress,
      refundAddress: refundAddress || userAddress
    });

    return txParams;
  }

  return {
    getCrossChainSwapPrice,
    buildCrossSrcTx
  };
}
