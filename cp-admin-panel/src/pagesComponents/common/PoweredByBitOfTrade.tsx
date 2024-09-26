import Image from 'next/image';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

export const PoweredByBitOfTrade = () => {
  return (
    <Box display={'flex'} gap={2} position={'absolute'} bottom={30}>
      <Typography variant='body2' color='text.primary'>
        {'Powered by'}
      </Typography>
      <Image src={'/images/bitoftrade_logo.svg'} width={94} height={22} alt={'logo'} priority />
    </Box>
  );
};
