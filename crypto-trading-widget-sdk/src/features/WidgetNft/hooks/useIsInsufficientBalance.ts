import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { NFTOrderFromAPI, OptimalRate } from '@paraswap/sdk';
import { useTokenBalances } from 'hooks/useTokenBalances';
import { Chain } from 'utils/chains';
import { Token } from 'data/tokens/token.interface';
import { formatUnits } from '@ethersproject/units';

export const useIsInsufficientBalance = ({
  account,
  chain,
  order,
  takerTokenAddress,
  tokenList,
  priceRoute,
}: {
  account: string;
  chain: Chain;
  order: NFTOrderFromAPI;
  takerTokenAddress: string;
  tokenList?: Record<string, Token>;
  priceRoute?: OptimalRate;
}) => {
  const { data: tokenBalances } = useTokenBalances(account, chain);

  return useMemo(() => {
    const isBasicSwap = order.takerAsset === takerTokenAddress;

    // Calculations based on taker asset
    if (isBasicSwap && tokenList && tokenBalances && takerTokenAddress) {
      // Simple swap ERC20 for NFT
      const decimals = tokenList[order.takerAsset].decimals ?? 18;
      const bigNumPrice = formatUnits(order.takerAmount, decimals);
      return BigNumber(tokenBalances[takerTokenAddress] ?? 0).isLessThan(bigNumPrice);
    } else if (!isBasicSwap && tokenList && priceRoute && tokenBalances && takerTokenAddress) {
      // Swap and transfer ERC20 for NFT
      const decimals = tokenList?.[takerTokenAddress].decimals ?? 18;
      const bigNumPrice = formatUnits(priceRoute.srcAmount, decimals);
      return BigNumber(tokenBalances[takerTokenAddress] ?? 0).isLessThan(bigNumPrice);
    }
    return undefined;
  }, [tokenBalances, order, priceRoute?.srcAmount, takerTokenAddress, tokenList]);
};
