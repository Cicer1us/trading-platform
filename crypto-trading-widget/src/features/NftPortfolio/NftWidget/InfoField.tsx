import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getShortedAddress } from '../utils/common';
import { CopyContentButton } from '../components/CopyContentButton';

export const InfoField: React.FC<{ label: string; value: string; copy?: boolean }> = ({ label, value, copy }) => {
  return (
    <Box display={'flex'} justifyContent={'space-between'} marginBottom={1.5}>
      <Typography variant="body2" color="text.secondary">
        {label}{' '}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2">{getShortedAddress(value)}</Typography>
        {copy && (
          <CopyContentButton content={value} sx={{ height: 'max-content', minWidth: 'max-content', p: 0, ml: 0.75 }} />
        )}
      </Box>
    </Box>
  );
};
