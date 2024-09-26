import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const CustomButton = forwardRef<HTMLButtonElement | null, CustomButtonProps>((props, ref) => {
  const { isLoading, ...propsToPass } = props;
  return (
    <Button
      ref={ref}
      {...propsToPass}
      variant={props.variant ?? 'contained'}
      fullWidth={props.fullWidth ?? true}
      disabled={isLoading || props.disabled}
      startIcon={isLoading && <CircularProgress size={32} />}
    >
      {props.children}
    </Button>
  );
});
