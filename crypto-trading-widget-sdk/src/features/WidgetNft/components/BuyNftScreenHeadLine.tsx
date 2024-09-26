import Paper from '@mui/material/Paper';
import { TokenImage } from '../../../components/TokenImage';
import { Chain, chainConfigs } from '../../../utils/chains';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import React from 'react';
import { WalletCtxInterface } from '../../../context/WalletContext';
import { useTheme } from '@mui/material/styles';
import { CopyContentButton } from 'components/Buttons/CopyContentButton';
import { Box, styled } from '@mui/material';
import {
  SLogOutHeadLineButtonBase,
  SConnectWalletHeadlineButtonBase,
} from 'features/Widget/Swap/SwapTokensHeadLine/styled';
import { useAppDispatch } from 'redux/hooks/reduxHooks';
import { setNftWidgetScreen, NftWidgetScreen } from 'redux/nftWidgetSlice';

interface BuyNftScreenHeadProps {
  ctx: WalletCtxInterface;
  chain: Chain;
}

const SNftWidgetHeadLinePaper = styled(Paper, {
  name: 'SNftWidgetHeadLinePaper',
})(({ theme }) => ({
  height: 40,
  width: 140,
  backgroundColor: theme.palette.secondary.main,
  p: 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    width: 60,
  },
}));

const SNftSelectChainTypography = styled(Typography, {
  name: 'STypography',
})(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export const BuyNftScreenHeadLine: React.FC<BuyNftScreenHeadProps> = ({ ctx, chain }) => {
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
    <Box display="flex" width={'100%'} gap={1} justifyContent={'space-between'} mb={3}>
      <SNftWidgetHeadLinePaper>
        <TokenImage
          src={chainConfigs[chain].image}
          alt={'token logo'}
          style={{ width: '20px', height: '20px', marginRight: '5px' }}
        />
        <SNftSelectChainTypography variant="subtitle1">{chainConfigs[chain].name}</SNftSelectChainTypography>
      </SNftWidgetHeadLinePaper>
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
          <SConnectWalletHeadlineButtonBase
            onClick={() => dispatch(setNftWidgetScreen(NftWidgetScreen.CONNECT_WALLET))}
          >
            {'Connect wallet'}
          </SConnectWalletHeadlineButtonBase>
        )}
      </Box>
    </Box>
  );
};
