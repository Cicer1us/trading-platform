import React, { HtmlHTMLAttributes, forwardRef } from 'react';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const CircularProgressCustom = forwardRef<HtmlHTMLAttributes<HTMLDivElement>, any>((props, ref) => {
  const theme = useTheme();

  const style: SxProps<Theme> = {
    maxHeight: '30px',
    maxWidth: '30px',
    color: theme.palette.action.disabled,
  };

  return (
    <Box ref={ref} textAlign="center" width={'100%'} height={'30px'}>
      <CircularProgress sx={style} />
    </Box>
  );
});
