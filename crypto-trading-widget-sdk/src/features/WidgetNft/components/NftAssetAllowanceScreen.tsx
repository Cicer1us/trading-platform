import BigNumber from 'bignumber.js';
import { AssetAllowance } from 'features/Widget/widget-pages/AssetAllowance';
import React from 'react';
import { useTokenList } from 'hooks/useTokenList';
import { OptimalRate } from '@paraswap/sdk/src/types';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from 'redux/hooks/reduxHooks';
import { formatUnits } from '@ethersproject/units';
import { NFTOrderFromAPI } from '@paraswap/sdk';

export const NftWidgetAssetAllowanceScreen: React.FC<{ order: NFTOrderFromAPI }> = ({ order }) => {
  const takerTokenAddress = useAppSelector(state => state.nftWidget.takerTokenAddress);
  const { data: tokenList } = useTokenList(order.chainId);
  const takerToken = tokenList?.[takerTokenAddress];

  const priceRoute: OptimalRate | undefined = useQueryClient().getQueryData(['nftOrderPriceRoute', takerTokenAddress]);

  if (takerToken) {
    const youPayAmountInWei = priceRoute?.srcAmount ?? order.takerAmount;
    const spenderAmount = BigNumber(formatUnits(youPayAmountInWei, takerToken.decimals)).toString();

    return <AssetAllowance spenderAmount={spenderAmount} spenderToken={takerToken} />;
  }
  return <></>;
};
