import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Token } from '../../data/tokens/token.interface';
import { DropDownIcon } from '../Icons/DropDownIcon';
import { useDispatch } from 'react-redux';
import { setCurrentScreen } from '../../redux/appSlice';
import { WidgetScreen } from '../../redux/app.interface';
import { inputInnerButtonHeight } from '../../theme/components/constants';
import { AllowanceStatus } from './AssetInput';
import { TokenImage } from '../TokenImage';
import { LockIcon } from '../Icons/LockIcon';

interface AssetSelectButtonProps {
  allowanceStatus: AllowanceStatus;
  token: Token;
  search: WidgetScreen.SearchPayToken | WidgetScreen.SearchReceiveToken;
}

export const AssetSelectButton: React.FC<AssetSelectButtonProps> = ({ allowanceStatus, token, search }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const style = {
    marginLeft: 0.5,
    color: theme.palette.text?.secondaryButton,
    stroke: theme.palette.text?.secondaryButton,
    backgroundColor: theme.palette.secondaryButton.main,
    '&:hover': {
      backgroundColor: theme.palette.secondaryButton.main,
      opacity: 0.8,
    },
    height: inputInnerButtonHeight,
    padding: '0 8px',
    borderRadius: '8px',
    alignItems: 'center',
    minWidth: 'fit-content',
  };

  return (
    <Button variant="inputInner" sx={style} onClick={() => dispatch(setCurrentScreen(search))}>
      <Box display={'flex'} alignItems={'center'} fontWeight={'inherit'}>
        <TokenImage
          src={token.logoURI}
          alt={'token logo'}
          style={{ width: '20px', height: '20px', marginRight: '5px', marginLeft: '5px' }}
        />
        <Typography variant={'subtitle1'} component={'p'} width={'fit-content'} mr={'5px'}>
          {token.symbol}
        </Typography>
        {allowanceStatus === 'needed' && (
          <LockIcon
            sx={{
              fontSize: '10px',
              marginLeft: '5px',
              marginRight: '5px',
              stroke: theme.palette.warning.light,
            }}
          />
        )}
        <DropDownIcon />
      </Box>
    </Button>
  );
};
