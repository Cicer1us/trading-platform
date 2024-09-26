import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import FormHelperText, { FormHelperTextProps } from '@mui/material/FormHelperText';
import { ErrorIcon } from '../../../../components/Icons/ErrorIcon';
import React from 'react';

export interface SelectTokenButtonError {
  displayLockIcon?: boolean;
  severity: 'error' | 'warning';
  message: string;
}

interface SFormHelperTextProps extends FormHelperTextProps {
  errorObject?: SelectTokenButtonError;
}

export const SSelectTokenButton = styled(ButtonBase)(({ theme }) => ({
  width: '100%',
  height: 40,
  backgroundColor: theme.palette.secondary.main,
  fontSize: 14,
  fontWeight: 700,
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
}));

export const SFormHelperText = styled(({ errorObject, ...props }: SFormHelperTextProps) => (
  <FormHelperText {...props}>
    {errorObject && <ErrorIcon />}
    {errorObject?.message}
  </FormHelperText>
))(({ theme, errorObject }) => ({
  position: 'absolute',
  bottom: '-22px',
  left: 0,
  display: 'flex',
  stroke: errorObject?.severity === 'error' ? theme.palette.error.main : theme.palette.warning.light + '!important',
  color: errorObject?.severity === 'error' ? theme.palette.error.main : theme.palette.warning.light + '!important',
  height: '20px',
}));
