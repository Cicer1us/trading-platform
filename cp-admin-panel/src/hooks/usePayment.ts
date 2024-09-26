import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { getOrderById, getPaymentPrice } from 'src/api/payment/order';
import { ONE_MINUTE, TEN_SECONDS } from 'src/common/time';
import { Token } from 'src/connection/types';
import { useAppSelector } from 'src/store/hooks/reduxHooks';
import { Order, OrderPrice } from './types';

export const constructPaymentPriceCacheKey = (orderId: string, selectedToken: Token, selectedSlippage: number) => [
  'orderPrice',
  orderId,
  selectedToken,
  selectedSlippage
];
export const constructPaymentCacheKey = (orderId: string) => ['order', orderId];

export const usePaymentPrice = () => {
  const { selectedToken, selectedSlippage } = useAppSelector(({ payment }) => payment);
  const { query } = useRouter();
  const orderId = query.orderId as string;

  return useQuery<OrderPrice>(
    constructPaymentPriceCacheKey(orderId, selectedToken, selectedSlippage),
    () => getPaymentPrice(orderId, selectedToken, selectedSlippage),
    {
      enabled: !!orderId && !!selectedToken,
      cacheTime: TEN_SECONDS,
      staleTime: TEN_SECONDS
    }
  );
};

export const usePayment = () => {
  const { query } = useRouter();
  const orderId = query.orderId as string;

  return useQuery<Order>(constructPaymentCacheKey(orderId), () => getOrderById(orderId), {
    enabled: !!orderId,
    cacheTime: ONE_MINUTE,
    staleTime: ONE_MINUTE
  });
};
