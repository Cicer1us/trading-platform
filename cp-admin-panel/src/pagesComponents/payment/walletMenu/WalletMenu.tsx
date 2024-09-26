import { useCallback, useMemo, useState } from 'react';
import { Box, Collapse, Typography } from '@mui/material';
import {
  Logout as LogoutIcon,
  ContentCopy as ContentCopyIcon,
  Percent as PercentIcon,
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useWeb3React } from '@web3-react/core';
import { getEllipsisString } from 'src/@core/utils/getEllipsisString';
import { useQueryClient } from '@tanstack/react-query';
import { constructTokensBalancesCacheKey } from 'src/hooks/useTokensBalances';
import { useAppDispatch, useAppSelector } from 'src/store/hooks/reduxHooks';
import { selectSlippage, setSelectedWallet } from 'src/store/payment/slice';
import { SHelpOutlineIcon, StyledMenu, StyledMenuItem, StyledToggleButton } from './styled';
import { slippageToPercentage } from './utils';
import { SlippageContent } from './slippage-content';

export const WalletMenu: React.FC = () => {
  const { selectedChainId } = useAppSelector(({ payment }) => payment);
  const { account, connector, isActive } = useWeb3React();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const handleToggleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(account ?? '');
    setAnchorEl(null);
  }, [account]);

  const handleDisconnect = useCallback(() => {
    if (connector.deactivate) {
      connector.deactivate();
    }

    dispatch(setSelectedWallet(undefined));

    queryClient.removeQueries({
      queryKey: constructTokensBalancesCacheKey(selectedChainId, account ?? ''),
      exact: true
    });

    connector.resetState();
    setAnchorEl(null);
  }, [connector, queryClient, selectedChainId, account, dispatch]);

  const [isSlipPageOpen, setIsSlipPageOpen] = useState(false);

  const handleSlippageClick = useCallback(() => {
    setIsSlipPageOpen(prev => !prev);
  }, []);

  const selectedSlippage = useAppSelector(selectSlippage);
  const selectedSlippageInPercentage = useMemo(() => slippageToPercentage(selectedSlippage), [selectedSlippage]);

  return (
    <>
      <StyledToggleButton onClick={handleToggleClick}>
        <MenuIcon />
      </StyledToggleButton>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <StyledMenuItem onClick={handleCopyClick} disabled={!isActive}>
          <ContentCopyIcon />
          <Typography variant='body1'>{getEllipsisString(account)}</Typography>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleSlippageClick}>
          <PercentIcon />
          <Box display='flex' gap={1} alignItems='center'>
            <Typography variant='body1'>{'Slippage'}</Typography>
            <SHelpOutlineIcon />
          </Box>
          <Box ml='auto' display='flex' alignItems='center'>
            <Typography variant='body1'>
              {selectedSlippageInPercentage != undefined && `${selectedSlippageInPercentage}%`}
            </Typography>
            {isSlipPageOpen ? <ExpandLessIcon /> : <ChevronRightIcon />}
          </Box>
        </StyledMenuItem>
        <Collapse in={isSlipPageOpen}>
          <Box display='flex' flexDirection='column' gap={1} px={5} py={2}>
            <SlippageContent />
          </Box>
        </Collapse>

        <StyledMenuItem onClick={handleDisconnect} disabled={!isActive}>
          <LogoutIcon />
          <Typography variant='body1'>{'Disconnect'}</Typography>
        </StyledMenuItem>
      </StyledMenu>
    </>
  );
};
