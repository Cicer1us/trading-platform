import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { setCurrentScreen } from '../../../../redux/appSlice';
import { useAppSelector } from '../../../../redux/hooks/reduxHooks';
import { WidgetScreen } from '../../../../redux/app.interface';
import { SArrowBackIosNewIcon, SButtonBase, SCard, SPoweredByContainer } from './styled';
import { BITOFTRADE_LOGO_URL } from '../../../../constants';

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const WidgetContainer: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const currentScreen = useAppSelector(({ app }) => app.currentScreen);

  return (
    <SCard>
      {currentScreen !== WidgetScreen.Default && (
        <Box display={'flex'} alignItems={'center'} mb={2}>
          <SButtonBase onClick={() => dispatch(setCurrentScreen(WidgetScreen.Default))}>
            <SArrowBackIosNewIcon fontSize={'small'} />
          </SButtonBase>
          <Typography variant={'h3'}>
            {(currentScreen === WidgetScreen.SearchPayToken || currentScreen === WidgetScreen.SearchReceiveToken) &&
              'Tokens'}
            {currentScreen === WidgetScreen.ConfirmTransaction && 'Transaction Details'}
          </Typography>
        </Box>
      )}
      {children}
      <SPoweredByContainer>
        <Typography variant={'caption'} mr={1}>
          {'Powered by '}
        </Typography>
        <img src={BITOFTRADE_LOGO_URL} alt={'logo'} height={12} />
      </SPoweredByContainer>
    </SCard>
  );
};
