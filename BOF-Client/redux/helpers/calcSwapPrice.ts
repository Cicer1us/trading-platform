import { convertToWei, convertFromWei } from '@/helpers/convertFromToWei';
import { SwapPrice } from '@/interfaces/SwapPrice.interface';
import getSwapPrice from 'API/swap/get-swap-price';
import store from '../store';
import { setPriceRoute } from '../swapSlice';

export async function calcSwapPrice(side: boolean, amount: number): Promise<SwapPrice> {
  const state = store.getState();
  const chainId = state.app.chainId;
  const tokenA = state.widget.selectedTokenA;
  const tokenB = state.widget.selectedTokenB;
  const partner = state.swap.swapSettings.partnerAddress;
  const decimals = side ? tokenB?.decimals : tokenA?.decimals;
  const amountInWei = convertToWei(amount, decimals);

  const dto = {
    srcToken: tokenA?.address,
    destToken: tokenB?.address,
    srcDecimals: String(tokenA?.decimals),
    destDecimals: String(tokenB?.decimals),
    side: side ? 'BUY' : 'SELL',
    network: chainId.toString(),
    excludeDirectContractMethods: 'true',
    amount: amountInWei,
  };

  const response = await getSwapPrice(dto, partner);

  if (response.error) {
    return { value: 0, error: response.error };
  }
  store.dispatch(setPriceRoute(response.priceRoute));
  const value = convertFromWei(
    Number(response.priceRoute[side ? 'srcAmount' : 'destAmount']),
    side ? tokenA.decimals : tokenB.decimals
  );
  return { value: Number(value), error: '' };
}

export async function updatePriceRoute() {
  const state = store.getState();
  const { isLoading, sellAmount, buyAmount, priceRoute, swapSettings } = state.swap;
  if (!isLoading && sellAmount && buyAmount) {
    const partner = swapSettings.partnerAddress;
    const side = priceRoute.side === 'BUY';
    const amountInWei = priceRoute[side ? 'destAmount' : 'srcAmount'];

    const dto = {
      srcToken: priceRoute?.srcToken,
      destToken: priceRoute?.destToken,
      srcDecimals: String(priceRoute?.srcDecimals),
      destDecimals: String(priceRoute?.destDecimals),
      side: priceRoute?.side,
      network: String(priceRoute?.network),
      excludeDirectContractMethods: 'true',
      amount: amountInWei,
    };

    const response = await getSwapPrice(dto, partner);

    if (!response.error) {
      store.dispatch(setPriceRoute(response.priceRoute));
    }
  }
}
