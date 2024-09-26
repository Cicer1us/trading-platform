import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const NftBookedScreen: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt="40%">
      <Typography mb={2} fontSize={40}>
        {'🥲'}
      </Typography>
      <Typography variant="h3" mb={1}>
        {'Sorry'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {'Sorry, but this NFT isn’t available. '}
      </Typography>
    </Box>
  );
};
