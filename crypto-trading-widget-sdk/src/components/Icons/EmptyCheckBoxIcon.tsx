import React from 'react';
import { useTheme } from '@mui/material/styles';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export const EmptyCheckBoxIcon: React.FC<SvgIconProps> = ({ sx }) => {
  const theme = useTheme();

  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      sx={{ width: '16px', height: '16px', fill: theme.palette.secondary.main, ...sx }}
    >
      <rect width="16" height="16" rx="4" />
    </SvgIcon>
  );
};
