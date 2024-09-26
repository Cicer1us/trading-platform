import React from 'react';
import { Typography, Box, Link } from '@mui/material';

interface CustomToastProps {
  title: string;
  description: string;
  explorerUrl?: string;
  txHash?: string;
}

export const CustomToast: React.FC<CustomToastProps> = ({ title, description, explorerUrl, txHash }) => {
  let link = '';

  if (txHash && explorerUrl) link = new URL(`tx/${txHash}`, explorerUrl).toString();

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      gap={0.5}
      width={'100%'}
      height={'100%'}
    >
      <Typography variant="body1" fontWeight={700}>{`${title}.`}</Typography>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-end'}>
        <Typography variant="body1" fontWeight={500}>
          {description}
        </Typography>
        {link && (
          <Link href={link} target={'_blank'} underline="always" color={'inherit'} fontSize={14}>
            <Typography variant="body1" fontWeight={500} alignSelf={'flex-end'}>
              {'Check'}
            </Typography>
          </Link>
        )}
      </Box>
    </Box>
  );
};
