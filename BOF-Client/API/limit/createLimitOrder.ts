import { CreatedLimitOrder, LimitOrder } from '@/interfaces/LimitOrder.interface';

export default async function createLimitOrder(order: CreatedLimitOrder): Promise<LimitOrder | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/limit-order`, {
    method: 'post',
    body: JSON.stringify(order),
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.status === 201) {
    return response.json();
  }
  return null;
}
