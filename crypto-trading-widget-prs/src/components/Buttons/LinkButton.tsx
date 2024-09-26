import React from 'react';
import { Button, useTheme } from '@mui/material';

interface LinkButtonProps {
  name: string;
  url: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ url, name }) => {
  const theme = useTheme();
  return (
    <>
      <Button
        disableElevation
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          fontFamily: theme.typography.fontFamily,
          color: theme.palette.text?.secondary,
          fontSize: 14,
          fontWeight: 400,
          paddingRight: 4,
          '&:hover': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {name}
      </Button>
    </>
  );
};
