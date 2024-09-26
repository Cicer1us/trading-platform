import React, { useEffect, useState } from 'react';
import { Typography, Box, ButtonBase, useTheme } from '@mui/material';
import { Nft } from 'services/moralis/nft-api';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { SellNftScreen } from './SellNftScreen';
import { NftAllowanceRequestScreen } from './NftAllowanceRequestScreen';
import { TokenSearch } from '../../../components/TokenSearch';
import { useDispatch } from 'react-redux';
import { setYouReceiveTokenAddress } from '../../../redux/nftWidgetSlice';
import { Token } from '../../../data/tokens/token.interface';
import { useNftAssetAllowanceRequest } from '../hooks/useNftAssetAllowanceRequest';
import { useNftsAllowanceForSelectedNft } from '../hooks/useNftsAllowanceForSelectedNft';
interface NftWidgetProps {
  selectedNft: Nft;
  currentPageNfts: (Nft | undefined)[];
}

export enum WidgetScreen {
  Default = 'Default',
  Search = 'Search',
  Unlock = 'Unlock',
}

export const NftWidget: React.FC<NftWidgetProps> = ({ selectedNft, currentPageNfts }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [widgetScreen, setWidgetScreen] = useState<WidgetScreen>(WidgetScreen.Default);

  const {
    mutateAsync: allowanceMutateAsync,
    reset: allowanceReset,
    isLoading: allowanceIsLoading,
    isSuccess: allowanceIsSuccess,
    isIdle: allowanceIsIdle,
  } = useNftAssetAllowanceRequest(selectedNft, setWidgetScreen);

  const nftAllowanceForSelectedNft = useNftsAllowanceForSelectedNft({
    //we could have duplicated token_address in the array, so we need to remove them
    //to prevent long query keys
    addresses: [...new Set(currentPageNfts.map(nft => (nft ? nft.token_address : '')))],
    selectedNft,
  });

  const onYouReceiveTokenSelect = (token: Token) => {
    dispatch(setYouReceiveTokenAddress(token.address));
    setWidgetScreen(WidgetScreen.Default);
  };

  useEffect(() => {
    setWidgetScreen(WidgetScreen.Default);
  }, [selectedNft]);

  return (
    <>
      {widgetScreen !== WidgetScreen.Default && (
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <ButtonBase sx={{ height: 24, marginRight: 1 }} onClick={() => setWidgetScreen(WidgetScreen.Default)}>
            <ArrowBackIosNewIcon fontSize={'small'} sx={{ fill: theme.palette.text.secondary }} />
          </ButtonBase>
          <Typography variant={'h4'}>{'Tokens'}</Typography>
        </Box>
      )}
      {widgetScreen === WidgetScreen.Default && (
        <SellNftScreen
          selectedNft={selectedNft}
          nftAllowanceForSelectedNft={!!nftAllowanceForSelectedNft}
          setWidgetScreen={screen => setWidgetScreen(screen)}
          allowanceIsLoading={allowanceIsLoading}
          allowanceIsSuccess={allowanceIsSuccess}
          allowanceIsIdle={allowanceIsIdle}
        />
      )}
      {widgetScreen === WidgetScreen.Unlock && (
        <NftAllowanceRequestScreen
          nft={selectedNft}
          allowanceIsLoading={allowanceIsLoading}
          allowanceMutateAsync={allowanceMutateAsync}
          allowanceReset={allowanceReset}
        />
      )}
      {widgetScreen === WidgetScreen.Search && (
        <TokenSearch onSelect={onYouReceiveTokenSelect} setWidgetScreen={screen => setWidgetScreen(screen)} />
      )}
    </>
  );
};
