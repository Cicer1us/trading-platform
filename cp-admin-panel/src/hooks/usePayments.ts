import { useQuery } from '@tanstack/react-query';
import { ONE_MINUTE } from 'src/common/time';
import {Payment, getPayments, GetPaymentsParams } from 'src/api/payment/order';
import { useTokensLists } from './useTokenList';
import { formatUnits } from '@ethersproject/units';
import { Token } from 'src/connection/types';

export type ExtendedPayment = Payment & {
  transaction?: Payment['transaction'] & {
    payInTokenParams?: Token;
    payOutTokenParams?: Token;
    payInHumanAmount?: string;
    payOutHumanAmount?: string;
  };
};

interface UsePaymentsReturn {
  data: ExtendedPayment[];
  total: number;
}

export const constructPaymentsCacheKey = (params: GetPaymentsParams) => ['payments', params.take, params.skip];

export const usePayments = (take: number, skip: number) => {
  const { data: tokensLists } = useTokensLists();

  return useQuery<UsePaymentsReturn>(
    constructPaymentsCacheKey({ take, skip }),
    async (): Promise<UsePaymentsReturn> => {
      const payments = await getPayments({ take, skip });

      const data = payments.data.map(payment => {
        if (!payment.transaction) return payment;

        const payInToken = tokensLists?.[payment.transaction.chainId]?.find(
          token => token.address === payment?.transaction?.payInToken
        );

        const payOutToken = tokensLists?.[payment.transaction.chainId]?.find(
          token => token.address === payment?.transaction?.payOutToken
        );

        if (!payInToken || !payOutToken) return payment;

        const payInHumanAmount = formatUnits(payment.transaction.payInAmount, payInToken.decimals);
        const payOutHumanAmount = formatUnits(payment.transaction.payOutAmount, payOutToken.decimals);

        return {
          ...payment,
          transaction: {
            ...payment.transaction,
            payInTokenParams: payInToken,
            payOutTokenParams: payOutToken,
            payInHumanAmount,
            payOutHumanAmount
          }
        };
      });

      return {
        data: data,
        total: payments.total
      }
    },
    {
      enabled: !!tokensLists,
      cacheTime: ONE_MINUTE,
      staleTime: ONE_MINUTE
    }
  );
};
