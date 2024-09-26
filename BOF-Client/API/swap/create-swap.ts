import { SwapTxObjDto } from '@/interfaces/SwapObjectDto';
import { PriceRouteDto } from '@/interfaces/SwapPriceResponse.interface';

export default async function createSwap(
  clientAddress: string,
  destAmount: string,
  srcAmount: string,
  priceRoute: PriceRouteDto,
  eip1559: boolean,
  partner?: string,
  fee?: string
): Promise<SwapTxObjDto> {
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
    const response = await fetch(`https://api.paraswap.io/transactions/${priceRoute.network}?${searchParams}`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  } catch (e) {
    return null;
  }
}
