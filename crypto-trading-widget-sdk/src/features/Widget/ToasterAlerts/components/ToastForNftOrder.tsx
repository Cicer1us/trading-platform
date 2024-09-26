import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import { styled, Typography, ButtonBase } from '@mui/material';

interface ToastForNftOrderProps {
  title: string;
  description: string;
  orderHash: string;
}

const SToastForNftOrderButton = styled(ButtonBase, {
  name: 'SToastForNftOrderButton',
})({
  alignSelf: 'flex-end',
  fontSize: 14,
  fontWeight: 700,
  textDecoration: 'underline',
});

export const ToastForNftOrder: React.FC<ToastForNftOrderProps> = ({ orderHash, title, description }) => {
  const openOrder = useCallback(() => window.CryptoTradingWidget.openOrder(orderHash), [orderHash]);

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
        <SToastForNftOrderButton onClick={openOrder}>{'Check'}</SToastForNftOrderButton>
      </Box>
    </Box>
  );
};
