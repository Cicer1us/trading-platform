import React from 'react';
import SvgIcon, { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface Props {
  props?: OverridableComponent<SvgIconTypeMap>;
}

export const DropDownIcon: React.FC<Props> = props => {
  return (
    <SvgIcon {...props} width="10" height="7" viewBox="0 0 12 7" sx={{ fontSize: 14 }} style={{ fill: 'none' }}>
      <path d="M1 1L6 6L11 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
  );
};
