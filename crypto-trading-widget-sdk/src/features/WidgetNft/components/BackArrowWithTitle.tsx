import React from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { NftWidgetScreen, setNftWidgetScreen } from '../../../redux/nftWidgetSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks/reduxHooks';

const getBackActionTitle = (nftWidgetScreen: NftWidgetScreen) => {
  if (nftWidgetScreen === NftWidgetScreen.SEARCH) {
    return 'Tokens';
  }
  return '';
};

export const BackArrowWithTitle: React.FC = () => {
  const dispatch = useAppDispatch();
  const nftWidgetScreen = useAppSelector(state => state.nftWidget.nftWidgetScreen);
  const backActionTitle = getBackActionTitle(nftWidgetScreen);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
      <ButtonBase
        sx={{ height: 24, marginRight: 1 }}
        onClick={() => dispatch(setNftWidgetScreen(NftWidgetScreen.DEFAULT))}
      >
        <ArrowBackIosNewIcon
          fontSize={'small'}
          sx={{ fill: theme => theme.palette.text.secondary, fontSize: '20px' }}
        />
      </ButtonBase>
      {backActionTitle && <Typography variant={'h3'}>{backActionTitle}</Typography>}
    </Box>
  );
};
