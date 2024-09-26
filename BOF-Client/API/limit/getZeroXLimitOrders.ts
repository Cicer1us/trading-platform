import { ZeroXLimitOrdersPaginated } from '@/interfaces/LimitOrder.interface';

export default async function getZeroXLimitOrders(clientAddress: string): Promise<ZeroXLimitOrdersPaginated> {
  const response = await fetch(`https://api.0x.org/orderbook/v1/orders?trader=${clientAddress}`, {
    headers: {
      '0x-api-key': process.env.NEXT_PUBLIC_0X_API_KEY,
    },
  });
  if (response.status === 200) {
    return response.json();
  }
  return null;
}
