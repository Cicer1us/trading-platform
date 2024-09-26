import { LeverageTrade } from './LeverageTrade.interfaces';

export default async function createLeverageTrade(
  fill: Record<string, unknown>,
  clientAddress: string
): Promise<LeverageTrade | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/leverage-trade`, {
    method: 'post',
    body: JSON.stringify({
      userAddress: clientAddress,
      market: fill.market,
      price: Number(fill.price),
      size: Number(fill.size),
      fee: Number(fill.fee),
      transactionId: Number(fill.transactionId),
      orderClientId: Number(fill.orderClientId),
      orderId: fill.orderId,
      side: fill.side,
      liquidity: fill.liquidity,
      type: fill.type,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.status === 201) {
    return response.json();
  }
  return null;
}
