import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import React from 'react';
import { WalletCtxInterface } from '../../../../context/WalletContext';
import { useTheme } from '@mui/material/styles';
import { CopyContentButton } from 'components/Buttons/CopyContentButton';
import { SelectChain } from '../../components/SelectChain';
import { SLogOutHeadLineButtonBase, SConnectWalletHeadlineButtonBase } from './styled';
import { Box } from '@mui/material';
import { WidgetScreen } from 'redux/app.interface';
import { setCurrentScreen } from 'redux/appSlice';
import { useAppDispatch } from 'redux/hooks/reduxHooks';
interface SwapTokensHeadProps {
  ctx: WalletCtxInterface;
}

export const SwapTokensHeadLine: React.FC<SwapTokensHeadProps> = ({ ctx }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const copyContentButtonStyes = {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 2,
    paddingRight: 1,
    borderRadius: 1,
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.secondary.main,
    '&.MuiButtonBase-root': {
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  };

  return (
    <Box display="flex" width={'100%'} gap={1} justifyContent={'space-between'}>
      <SelectChain />
      <Box display={'flex'} gap={1}>
        {ctx.account ? (
          <>
            {/* TODO: refactor `CopyContentButton` to use it without sx */}
            <CopyContentButton sx={copyContentButtonStyes} content={ctx.account}>
              <Typography variant={'subtitle1'} mr={1}>
                {ctx.account.slice(0, 5) + '...' + ctx.account.slice(ctx.account.length - 5)}
              </Typography>
            </CopyContentButton>
            <SLogOutHeadLineButtonBase focusRipple onClick={() => ctx.disconnect()}>
              <LogoutIcon />
            </SLogOutHeadLineButtonBase>
          </>
        ) : (
          <SConnectWalletHeadlineButtonBase onClick={() => dispatch(setCurrentScreen(WidgetScreen.ConnectWallet))}>
            {'Connect wallet'}
          </SConnectWalletHeadlineButtonBase>
        )}
      </Box>
    </Box>
  );
};
