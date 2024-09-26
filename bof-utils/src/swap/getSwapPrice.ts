import { GetSwapPrice, SwapPriceResponse } from '../interfaces/paraswap';
import { PARASWAP_URL } from '../constants';

export async function getSwapPrice(
  swapPriceParams: GetSwapPrice,
  partner?: string
): Promise<SwapPriceResponse> {
  const url = new URL(`${PARASWAP_URL}/prices`);
  url.search = new URLSearchParams(
    Object.entries({ ...swapPriceParams, partnerFeeBps: '1', ...(partner ? { partner } : {}) })
  ).toString();

  const response = await fetch(url.toString());
  return response.json();
}
