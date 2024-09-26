import React from 'react';
import { Button, OutlinedInput, FormHelperTextProps, FormHelperText, styled } from '@mui/material';
import { AssetInputError } from './AssetInput';

export const SMaxButton = styled(Button, {
  name: 'SMaxButton',
})(({ theme }) => ({
  color: theme.palette.text?.secondaryButton,
  backgroundColor: theme.palette.secondaryButton.main,
  '&:hover': {
    backgroundColor: theme.palette.secondaryButton.main,
    opacity: 0.8,
  },
  opacity: 1,
}));

export const SAssetOutlinedInput = styled(OutlinedInput, {
  name: 'SAssetOutlinedInput',
})(({ theme }) => ({
  fontSize: 14,
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  '& input': {
    padding: 0,
    marginRight: theme.spacing(2),
  },
}));

export const STokenImageWrapper = styled('div', {
  name: 'STokenImageWrapper',
})(({ theme }) => ({
  display: 'flex',
  fontWeight: 700,
  fontSize: 16,
  lineHeight: '23px',
  color: theme.palette.text.secondaryButton,
  marginLeft: theme.spacing(0.5),
}));

export const SFormHelperText = styled(
  ({ errorObject, ...props }: FormHelperTextProps & { errorObject?: AssetInputError }) => <FormHelperText {...props} />,
  { name: 'SFormHelperText' }
)(({ theme, errorObject }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  stroke: errorObject?.severity === 'error' ? theme.palette.error.main : theme.palette.warning.light + '!important',
  color: errorObject?.severity === 'error' ? theme.palette.error.main : theme.palette.warning.light + '!important',
  height: '20px',
}));
