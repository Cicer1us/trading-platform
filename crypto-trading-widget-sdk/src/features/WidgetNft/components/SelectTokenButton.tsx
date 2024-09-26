import ButtonBase from '@mui/material/ButtonBase';
import React from 'react';
import { Token } from '../../../data/tokens/token.interface';
import { TokenImage } from '../../../components/TokenImage';
import { useTheme } from '@mui/material/styles/';
import Box from '@mui/material/Box';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from '../../../redux/hooks/reduxHooks';
import { NftWidgetScreen, setNftWidgetScreen } from '../../../redux/nftWidgetSlice';
import { SxProps, Theme } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import { ErrorIcon } from '../../../components/Icons/ErrorIcon';
import { LockIcon } from '../../../components/Icons/LockIcon';

interface SelectTokenButtonProps {
  token: Token;
  sx?: SxProps<Theme>;
  isInsufficientAllowance?: boolean;
  isInsufficientBalance?: boolean;
}

export const SelectTokenButton: React.FC<SelectTokenButtonProps> = ({
  token,
  sx,
  isInsufficientAllowance,
  isInsufficientBalance,
}) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const insufficientAllowanceWarning = {
    displayLockIcon: true,
    severity: 'warning',
    message: 'Pay attention, your token is locked.',
  };

  const insufficientBalanceError = {
    displayLockIcon: false,
    severity: 'error',
    message: 'Insufficient balance',
  };

  const error = (() => {
    if (isInsufficientBalance) {
      return insufficientBalanceError;
    } else if (isInsufficientAllowance) {
      return insufficientAllowanceWarning;
    }
    return null;
  })();

  return (
    <>
      <ButtonBase
        sx={{
          width: '100%',
          height: 40,
          backgroundColor: theme.palette.secondary.main,
          fontSize: 14,
          fontWeight: 700,
          padding: 1.5,
          borderRadius: 1,
          alignItems: 'center',
          ...sx,
        }}
        onClick={() => dispatch(setNftWidgetScreen(NftWidgetScreen.SEARCH))}
      >
        <TokenImage
          src={token.logoURI}
          alt={'token logo'}
          style={{ width: '20px', height: '20px', marginRight: '5px' }}
        />

        <Typography variant={'subtitle1'} mr={1}>
          {token.symbol}
        </Typography>
        {error?.displayLockIcon && (
          <LockIcon
            sx={{
              fontSize: '10px',
              stroke: theme.palette.warning.light,
            }}
          />
        )}
        <div style={{ flexGrow: 1 }} />
        <Box sx={{ fontSize: 32 }} display={'flex'} alignItems={'center'}>
          <KeyboardArrowDownTwoToneIcon fontSize={'inherit'} sx={{ color: theme.palette.text.secondary }} />
        </Box>
        {error && (
          <FormHelperText
            error
            sx={{
              position: 'absolute',
              bottom: '-22px',
              left: 0,
              display: 'flex',
              stroke: error?.severity === 'error' ? theme.palette.error.main : theme.palette.warning.light,
              color: error?.severity === 'error' ? theme.palette.error.main : theme.palette.warning.light,
              height: '20px',
            }}
          >
            {error && <ErrorIcon />}
            {error?.message}
          </FormHelperText>
        )}
      </ButtonBase>
    </>
  );
};
