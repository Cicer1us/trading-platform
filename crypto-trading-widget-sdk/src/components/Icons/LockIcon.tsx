import React from 'react';
import { styled } from '@mui/material/styles';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { ReactComponent as LockSvg } from './locked.svg';

export const LockIcon = styled((props: SvgIconProps) => (
  <SvgIcon viewBox="0 0 16 16" {...props}>
    <LockSvg />
  </SvgIcon>
))({});
