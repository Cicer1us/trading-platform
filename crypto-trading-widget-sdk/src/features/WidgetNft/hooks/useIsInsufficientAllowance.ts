import { useMemo } from 'react';
import { useTokenAllowances } from 'hooks/useTokenAllowances';
import { Chain } from 'utils/chains';
import BigNumber from 'bignumber.js';
import { Token } from 'data/tokens/token.interface';
import { assert } from 'ts-essentials';
import { formatUnits } from '@ethersproject/units';

export const useIsInsufficientAllowance = ({
  account,
  chain,
  token,
  amount,
}: {
  account: string;
  chain: Chain;
  token?: Token;
  amount: string;
}) => {
  const { data: tokeAllowances } = useTokenAllowances(account, chain);

  return useMemo(() => {
    try {
      assert(token, 'token is undefined');
      return tokeAllowances
        ? BigNumber(formatUnits(amount, token.decimals)).gt(tokeAllowances?.[token.address] ?? 0)
        : false;
    } catch {
      return false;
    }
  }, [tokeAllowances, amount, token]);
};
