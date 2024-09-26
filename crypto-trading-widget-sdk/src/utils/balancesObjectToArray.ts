import { EMPTY_ARRAY } from '../constants';
import BigNumber from 'bignumber.js';

export const balancesObjectToArray = (tokenBalances?: Record<string, string | null>) => {
  if (tokenBalances) {
    const res = [];
    for (const tokenBalancesKey in tokenBalances) {
      res.push();
      if (Number(tokenBalances[tokenBalancesKey]) > 0) {
        res.push(tokenBalancesKey);
      }
    }
    return res;
  } else {
    return EMPTY_ARRAY;
  }
};

export const getTokenBalanceInfo = (
  tokenBalances: Record<string, string | null> | undefined,
  tokenPrices: Record<string, number> | undefined,
  address: string
) => {
  let balance = undefined;
  let usdBalance = undefined;
  let precision = undefined;
  if (tokenBalances) {
    balance = tokenBalances[address] ? BigNumber(tokenBalances[address] ?? 0) : undefined;
    if (balance && tokenPrices) {
      usdBalance = tokenPrices[address] ? BigNumber(tokenPrices[address]).multipliedBy(balance) : undefined;
      precision = tokenPrices[address] ? tokenPrices[address].toFixed(0).length + 3 : undefined;
    }
  }

  return { balance, usdBalance, precision };
};
