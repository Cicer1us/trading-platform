import { convertToWei, convertFromWei } from '@/helpers/convertFromToWei';
import { LimitWidgetPrice } from '@/interfaces/LimitWidgetPrice.interface';
import getSwapPrice from 'API/swap/get-swap-price';
import store from '../store';

export async function calcLimitPrice(amount: number, chainId: string): Promise<LimitWidgetPrice> {
  const state = store.getState();
  const tokenA = state.widget.selectedTokenA;
  const tokenB = state.widget.selectedTokenB;
  const partner = state.swap.swapSettings.partnerAddress;
  const decimals = tokenA?.decimals;
  const amountInWei = convertToWei(amount, decimals);

  const dto = {
    srcToken: tokenA?.address,
    destToken: tokenB?.address,
    srcDecimals: String(tokenA?.decimals),
    destDecimals: String(tokenB?.decimals),
    side: 'SELL',
    network: chainId,
    amount: amountInWei,
  };

  const response = await getSwapPrice(dto, partner);
  if (response.error) {
    return {
      value: 0,
      price: 0,
      error: response.error,
    };
  }

  const buyAmount = Number(convertFromWei(+response.priceRoute.destAmount, tokenB.decimals));
  const sellAmount = Number(convertFromWei(+response.priceRoute.srcAmount, tokenA.decimals));
  const price = buyAmount / sellAmount;
  return { value: buyAmount, price: Number(price), error: '' };
}
