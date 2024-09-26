import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import BigNumber from 'bignumber.js';
import { OptimalRate, SwappableNFTOrder } from '@paraswap/sdk';
import { Clarification } from 'components/Clarification/Clarification';
import { Chain, chainConfigs } from 'utils/chains';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { WalletCtx } from 'context/WalletContext';
import { useGasPrice } from 'hooks/useGasPrice';
import { useTokenList } from 'hooks/useTokenList';
import { styled, useTheme } from '@mui/material/styles';
import { nftWidgetTooltips } from '../tooltips';
import { formatUnits } from '@ethersproject/units';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { getExplorerNftUrl } from '../utils';

const TxSummaryInfoBox = styled('div', { name: 'TxSummaryInfoBox' })({
  marginBottom: 8,
  display: 'flex',
  justifyContent: 'space-between',
});

// TODO: Add constant for Ethereum chain
const APPROXIMATE_GAS_FOR_LIMIT_TX = '200000';

export const NftTransactionSummary: React.FC<{
  priceRoute?: OptimalRate;
  order: SwappableNFTOrder;
  chain: Chain;
  isLoading: boolean;
}> = ({ priceRoute, order, chain, isLoading }) => {
  const theme = useTheme();
  const ctx = React.useContext(WalletCtx);
  const { data: tokenPrices } = useTokenPrices(
    [priceRoute?.srcToken ?? order.takerAsset, order.makerAsset, chainConfigs[chain].nativeToken.address],
    chain
  );
  const { data: tokenList } = useTokenList(chain);
  const { data: gasPrice } = useGasPrice(chain, ctx?.library);

  const txDetails = useMemo(() => {
    if (!tokenList || !tokenPrices || !gasPrice) return undefined;

    const youPayAmountInWei = priceRoute ? priceRoute.srcAmount : order.takerAmount;
    const youPayToken = priceRoute ? tokenList[priceRoute.srcToken] : tokenList[order.takerAsset];
    const youPayAmount = BigNumber(formatUnits(youPayAmountInWei, youPayToken.decimals));
    const youPayUsd = BigNumber(youPayAmount).multipliedBy(tokenPrices[youPayToken.address]);
    const nativeTokenPrice = tokenPrices[chainConfigs[chain].nativeToken.address];

    const gasCostNative = BigNumber(gasPrice).multipliedBy(
      BigNumber(priceRoute?.gasCost ?? APPROXIMATE_GAS_FOR_LIMIT_TX)
    );
    const gasCostUsd = BigNumber(gasCostNative)
      .multipliedBy(nativeTokenPrice)
      .plus(priceRoute?.gasCostUSD ?? 0);

    const totalTransactionCost = youPayUsd.plus(gasCostUsd);

    return {
      youPayAmount,
      youPayToken,
      youPayUsd,
      gasCostNative,
      gasCostUsd,
      totalTransactionCost,
    };
  }, [priceRoute, order, tokenList, tokenPrices, chain, gasPrice]);

  if (!txDetails || isLoading) return <Skeleton variant="rounded" height={148} />;

  return (
    <Paper variant="info">
      <TxSummaryInfoBox>
        <Clarification {...nftWidgetTooltips.youPay} color={theme.palette.text.secondary} />
        <Typography variant={'subtitle1'}>
          {`${txDetails.youPayAmount.toFixed(4)} ${txDetails.youPayToken.symbol}` +
            ` (${txDetails.youPayUsd.toFixed(2)} $)`}
        </Typography>
      </TxSummaryInfoBox>

      <TxSummaryInfoBox>
        <Clarification {...nftWidgetTooltips.estimatedGasFee} color={theme.palette.text.secondary} />
        <Typography variant={'subtitle1'}>{`${txDetails.gasCostNative.toFixed(4)} ${
          chainConfigs[chain].nativeToken.symbol
        } (${txDetails.gasCostUsd.toFixed(2)} $)`}</Typography>
      </TxSummaryInfoBox>

      <TxSummaryInfoBox>
        <Clarification {...nftWidgetTooltips.totalTxCost} color={theme.palette.text.secondary} />
        <Typography variant={'subtitle1'}>{`${txDetails.totalTransactionCost.toFixed(2)} $`}</Typography>
      </TxSummaryInfoBox>

      <TxSummaryInfoBox>
        <Typography
          component={'a'}
          target={'_blank'}
          href={getExplorerNftUrl(order, chain)}
          color={'text.secondary'}
          display={'flex'}
          alignItems={'center'}
          gap={1}
        >
          {'Information about NFT'}
          <ArrowOutwardIcon fontSize={'medium'} />
        </Typography>
      </TxSummaryInfoBox>
    </Paper>
  );
};
