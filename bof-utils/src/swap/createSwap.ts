import { PriceRoute } from '../interfaces/paraswap';
import { SwapTxObj } from '../interfaces/swap';
import { PARASWAP_URL } from '../constants';

export async function createSwap(
  clientAddress: string,
  destAmount: string,
  srcAmount: string,
  priceRoute: PriceRoute,
  eip1559: boolean,
  partner?: string,
  fee?: string
): Promise<SwapTxObj> {
  const data = {
    destAmount,
    srcAmount,
    priceRoute,
    userAddress: clientAddress,
    srcToken: priceRoute.srcToken,
    destToken: priceRoute.destToken,
    srcDecimals: priceRoute.srcDecimals,
    destDecimals: priceRoute.destDecimals,
    ...(partner ? { partnerAddress: partner } : {}),
    ...(fee ? { partnerFeeBps: fee } : {}),
  };
  const searchParams = eip1559 ? '&eip1559=true' : '';
  try {
    const response = await fetch(
      `${PARASWAP_URL}/transactions/${priceRoute.network}?${searchParams}`,
      {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return await response.json();
  } catch (e) {
    return null;
  }
}
