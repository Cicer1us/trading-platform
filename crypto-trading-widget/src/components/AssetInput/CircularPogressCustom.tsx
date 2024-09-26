import React from 'react';
import { Box, CircularProgress, SxProps, Theme, useTheme } from '@mui/material';

export const CircularProgressCustom: React.FC = () => {
  const theme = useTheme();

  const style: SxProps<Theme> = {
    maxHeight: '30px',
    maxWidth: '30px',
    color: theme.palette.action.disabled,
  };

  return (
    <Box textAlign="center" width={'100%'} height={'30px'}>
      <CircularProgress sx={style} />
    </Box>
  );
};
