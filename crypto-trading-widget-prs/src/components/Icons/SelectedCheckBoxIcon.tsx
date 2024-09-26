import React from 'react';
import { SvgIcon, SvgIconProps, useTheme } from '@mui/material';

export const SelectedCheckBoxIcon: React.FC<SvgIconProps> = ({ sx }) => {
  const theme = useTheme();

  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      sx={{ width: '16px', height: '16px', fill: 'none', stroke: theme.palette.primary.main, ...sx }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" />
      <path d="M11.75 5L6.59375 10.25L4.25 7.86364" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" />
    </SvgIcon>
  );
};
