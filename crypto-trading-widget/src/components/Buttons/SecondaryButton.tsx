import React from 'react';
import { Button, useTheme } from '@mui/material';

interface SecondaryButtonProps {
  children: JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ children, onClick }) => {
  const theme = useTheme();

  const styles = {
    minWidth: 40,
    height: 40,
    padding: 0,
    color: theme.palette.text?.secondary,
    stroke: theme.palette.text?.primary,
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      borderColor: theme.palette.text.primary,
      backgroundColor: theme.palette.primary.dark,
    },
    [theme.breakpoints.down('sm')]: {
      height: 32,
    },
  };

  return (
    <Button variant={'contained'} sx={styles} onClick={onClick}>
      {children}
    </Button>
  );
};
