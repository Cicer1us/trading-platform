import BigNumber from 'bignumber.js';
import { WalletCtx } from 'context/WalletContext';
import { Token } from 'data/tokens/token.interface';
import { useContext, useMemo } from 'react';
import { balancesObjectToArray, getTokenBalanceInfo } from 'utils/balancesObjectToArray';
import { Chain } from 'utils/chains';
import { useTokenBalances } from './useTokenBalances';
import { useTokenLists } from './useTokenLists';
import { useTokenPrices } from './useTokenPrices';

export const useTokensToDisplay = () => {
  const ctx = useContext(WalletCtx);
  const chain = ctx?.walletChain ?? Chain.Ethereum;

  const { data: tokenList } = useTokenLists(chain);
  const { isLoading: balancesIsLoading, data: tokenBalances } = useTokenBalances(ctx?.account ?? '', chain);
  const tokenBalancesArray = balancesObjectToArray(tokenBalances);
  const { isLoading: pricesIsLoading, data: tokenPrices } = useTokenPrices(tokenBalancesArray, chain);
  const tokensIsLoading = !!ctx?.account && pricesIsLoading && balancesIsLoading;

  const tokens: Token[] = useMemo(() => {
    const tokensMap = tokenList;
    const tokensArray = [];

    for (const tokensKey in tokensMap) {
      const tokenBalanceInfo = getTokenBalanceInfo(tokenBalances, tokenPrices, tokensKey);
      const balance = tokenBalanceInfo.balance;
      const usdBalance = tokenBalanceInfo.usdBalance;
      const precision = tokenBalanceInfo.precision;

      tokensArray.push({ ...tokensMap[tokensKey], balance, usdBalance, precision });
    }
    if (tokenPrices) {
      tokensArray.sort((token, token2) => {
        if (token2.usdBalance) {
          const balance = token2.usdBalance as BigNumber;
          return balance.minus(token.usdBalance ?? BigNumber(0)).toNumber();
        } else {
          return -1;
        }
      });
    }

    if (!tokenPrices && tokenBalances) {
      tokensArray.sort((token, token2) => {
        if (token2.balance) {
          const balance = token2.balance as BigNumber;
          return balance.minus(token.usdBalance ?? BigNumber(0)).toNumber();
        } else {
          return -1;
        }
      });
    }
    return tokensArray;
  }, [tokenBalances, tokenPrices]);

  return { tokens, tokensIsLoading };
};
