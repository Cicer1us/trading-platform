import React, { useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Clarification } from 'components/Clarification/Clarification';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useGetNftMetadata, useNftNormalizedMetadata } from 'hooks/useGetNftMetadata';
import { Chain, chainConfigs } from 'utils/chains';
import { OngoingTransactionsCtx, TransactionStatus, TransactionType } from 'context/OngoingTransactionsContext';
import { NFTOrderFromAPI } from '@paraswap/sdk';
import ButtonBase from '@mui/material/ButtonBase';
import Skeleton from '@mui/material/Skeleton';
import { NftPicture } from './NftPicture';
import { cutStringToDisplayOnlyFirstAndLastCharacters } from '../../../utils/common';
import { getExplorerNftUrl } from '../utils';

interface PurchasedTxScreenProps {
  order: NFTOrderFromAPI;
}

export const PurchaseTxStatusScreen: React.FC<PurchasedTxScreenProps> = ({ order }) => {
  const theme = useTheme();
  const { ongoingTransactions } = useContext(OngoingTransactionsCtx);
  const ongoingTx = useMemo(
    () =>
      ongoingTransactions?.filter(
        tx => tx.transactionType === TransactionType.NftPurchase && tx.order.orderHash === order.orderHash
      )[0],
    [ongoingTransactions, order.orderHash]
  );

  const { data: nft } = useGetNftMetadata(order.makerAsset, order.makerAssetId, order.chainId);
  const { data: metadata } = useNftNormalizedMetadata(nft);

  const buttonOptions = {
    title: 'View in explorer',
    url: getExplorerNftUrl(order, order.chainId),
  };

  const txUrl = new URL(`tx/${ongoingTx?.hash}`, chainConfigs[order.chainId as Chain].explorerUrl).toString();

  const titleSx = { mt: 1.5, mb: 2.5 };
  return (
    <Box display={'flex'} flexDirection={'column'} height={'100%'}>
      <NftPicture
        sx={{ width: '100%', height: '238px', borderRadius: 1 }}
        url={metadata?.imageUrl ?? metadata?.animationUrl}
        alt="NFT media content"
      />
      <Typography variant="h5" sx={titleSx}>
        {metadata?.name ?? <Skeleton variant="rounded" sx={titleSx} height={24} />}
      </Typography>
      <Paper
        sx={{
          backgroundColor: theme.palette.paperSecondaryBackground.main,
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          mb: 5,
        }}
      >
        <Box marginBottom={1.5} display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography variant={'body2'} color="text.secondary">
            {`Status`}
          </Typography>
          <Typography
            variant={'subtitle1'}
            color={ongoingTx?.status === TransactionStatus.PENDING ? 'warning.main' : 'primary.main'}
          >
            {ongoingTx?.status === TransactionStatus.PENDING ? 'Pending' : `Purchased`}
          </Typography>
        </Box>

        <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Clarification title={'Transaction hash'} description={'add tooltip'} color={theme.palette.text.secondary} />
          {ongoingTx ? (
            <ButtonBase href={txUrl} target="_blank">
              <Typography variant={'subtitle1'} color="text.main">
                {cutStringToDisplayOnlyFirstAndLastCharacters(ongoingTx?.hash, 5)}
              </Typography>
            </ButtonBase>
          ) : (
            <Skeleton variant="rounded" width="100px" />
          )}
        </Box>
      </Paper>
      <div style={{ flexGrow: 1 }} />
      <Button fullWidth variant="contained" color="primary" size="large" href={buttonOptions?.url} target="_blank">
        {buttonOptions?.title}
      </Button>
    </Box>
  );
};
