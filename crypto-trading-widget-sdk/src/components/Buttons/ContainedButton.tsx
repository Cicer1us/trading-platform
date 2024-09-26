import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

interface ContainedButtonProps extends ButtonProps {
  customIsLoading?: boolean;
}

const SButton = styled(Button, { name: 'ContainedButton' })(({ theme }) => ({
  color: theme.palette.text.primaryButton,
  '&:disabled': { color: theme.palette.text.primary },
}));

export const ContainedButton: React.FC<ContainedButtonProps> = ({ disabled, customIsLoading, ...props }) => {
  return (
    <SButton
      variant="contained"
      {...props}
      disabled={customIsLoading || disabled}
      endIcon={customIsLoading && <CircularProgress size={32} color="inherit" />}
    />
  );
};
