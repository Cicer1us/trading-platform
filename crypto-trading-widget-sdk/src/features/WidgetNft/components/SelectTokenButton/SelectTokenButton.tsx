import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import { Token } from 'data/tokens/token.interface';
import { TokenImage } from 'components/TokenImage';
import { useAppDispatch } from 'redux/hooks/reduxHooks';
import { NftWidgetScreen, setNftWidgetScreen } from 'redux/nftWidgetSlice';
import { LockIcon } from 'components/Icons/LockIcon';
import { SelectTokenButtonError, SFormHelperText, SSelectTokenButton } from './styled';
import { insufficientAllowanceWarning, insufficientBalanceError } from './errorMessages';

interface SelectTokenButtonProps {
  token: Token;
  isInsufficientAllowance?: boolean;
  isInsufficientBalance?: boolean;
  customError?: SelectTokenButtonError;
}

export const SelectTokenButton: React.FC<SelectTokenButtonProps> = ({
  token,
  isInsufficientAllowance,
  isInsufficientBalance,
  customError,
}) => {
  const dispatch = useAppDispatch();

  const error = ((): SelectTokenButtonError | undefined => {
    if (isInsufficientBalance) {
      return insufficientBalanceError;
    } else if (isInsufficientAllowance) {
      return insufficientAllowanceWarning;
    } else if (customError) {
      return customError;
    }
  })();

  return (
    <>
      <SSelectTokenButton onClick={() => dispatch(setNftWidgetScreen(NftWidgetScreen.SEARCH))}>
        <TokenImage src={token.logoURI ?? ''} alt={'token logo'} width={20} height={20} mr="5px" />
        <Typography variant="subtitle1" mr={1}>
          {token.symbol}
        </Typography>
        {error?.displayLockIcon && <LockIcon fontSize="small" />}
        <div style={{ flexGrow: 1 }} />
        <Box display="flex" alignItems="center" color={'text.secondary'}>
          <KeyboardArrowDownTwoToneIcon fontSize="medium" color={'inherit'} />
        </Box>
        <SFormHelperText errorObject={error} />
      </SSelectTokenButton>
    </>
  );
};
