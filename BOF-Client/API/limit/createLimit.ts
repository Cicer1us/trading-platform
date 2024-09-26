import { SignedLimitOrder } from '@/interfaces/LimitOrder.interface';
import createLimitOrder from './createLimitOrder';
import createZeroXLimitOrder from './createZeroXLimitOrder';
import getZeroXLimitOrders from './getZeroXLimitOrders';

export default async function createLimit(
  signedOrder: SignedLimitOrder,
  clientAddress: string
): Promise<boolean | null> {
  try {
    const orderWasAdded = await createZeroXLimitOrder(signedOrder);
    if (!orderWasAdded) return null;
    const createdOrders = await getZeroXLimitOrders(clientAddress);
    const orderHash = createdOrders?.records?.find(rec => rec.order.salt === signedOrder.salt)?.metaData.orderHash;
    if (!orderHash) return null;
    const orderWithHash = { ...signedOrder, orderHash, feeAmount: signedOrder.takerTokenFeeAmount };
    const limitOrder = await createLimitOrder(orderWithHash);
    if (!limitOrder) return null;
  } catch (error) {
    return null;
  }

  return true;
}
