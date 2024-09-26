import { FormControlLabel, Radio } from '@mui/material';
import React from 'react';

interface RadioFormControlLabelProps {
  value: string;
  label: string;
}

export const RadioFormControlLabel: React.FC<RadioFormControlLabelProps> = ({ value, label }) => {
  return (
    <FormControlLabel
      control={
        <Radio
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="#151A1D" />
              <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#C5C5C9" />
            </svg>
          }
          checkedIcon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="#255558" />
              <path
                d="M11.125 5.5L6.82812 9.875L4.875 7.88636"
                stroke="#38D9C0"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#38D9C0" />
            </svg>
          }
        />
      }
      sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}
      value={value}
      label={label}
    />
  );
};
