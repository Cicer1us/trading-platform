import { SignedLimitOrder } from '@/interfaces/LimitOrder.interface';

export default async function createZeroXLimitOrder(order: SignedLimitOrder): Promise<boolean> {
  const response = await fetch(`https://api.0x.org/orderbook/v1/order`, {
    method: 'post',
    body: JSON.stringify(order),
    headers: { 'Content-Type': 'application/json', '0x-api-key': process.env.NEXT_PUBLIC_0X_API_KEY },
  });
  if (response.status === 200) {
    return true;
  }
  return false;
}
