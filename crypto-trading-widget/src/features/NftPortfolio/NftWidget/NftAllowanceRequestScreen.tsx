import React, { useCallback } from 'react';
import { Box, styled, Typography, useTheme } from '@mui/material';
import { Nft } from '../../../services/moralis/nft-api';
import { CustomButton } from '../../../components/Buttons/CustomButton';
import { useNftNormalizedMetadata } from '../hooks/useNftNormalizedMetadata';
import NftPicture from 'components/NftPicture';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { TransactionResponse } from '@ethersproject/providers';

interface NftAllowanceRequestScreenProps {
  nft: Nft;
  allowanceIsLoading: boolean;
  allowanceMutateAsync: UseMutateAsyncFunction<TransactionResponse, Error, void, unknown>;
  allowanceReset: () => void;
}

const SCustomButton = styled(CustomButton)({
  marginTop: 'auto',
});

export const NftAllowanceRequestScreen: React.FC<NftAllowanceRequestScreenProps> = ({
  nft,
  allowanceIsLoading,
  allowanceMutateAsync,
  allowanceReset,
}) => {
  const theme = useTheme();
  const { data: metadata } = useNftNormalizedMetadata(nft);

  const handleAssetAllowanceClick = useCallback(async () => {
    try {
      await allowanceMutateAsync();
    } catch (error) {
      allowanceReset();
    }
  }, [allowanceMutateAsync, allowanceReset]);

  return (
    <Box display="flex" flexDirection="column" height="93%">
      {/* TODO: fix height */}
      <NftPicture url={metadata?.imageUrl || metadata?.animationUrl} width={380} height={250} />
      <Typography variant="subtitle2" color={theme.palette.text.secondary}>
        {'Our smart contract needs your permission in order to move'}
        <Typography
          variant="subtitle2"
          component={'span'}
          color={theme.palette.text.primary}
          fontWeight={700}
        >{` ${metadata?.name} `}</Typography>
        {'on your behalf.'}
      </Typography>
      <SCustomButton isLoading={allowanceIsLoading} onClick={handleAssetAllowanceClick}>
        {'Unlock'}
      </SCustomButton>
    </Box>
  );
};
