import { Box, CircularProgress, styled, Typography } from '@mui/material';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { DefaultButton } from 'src/@core/components/buttons/DefaultButton';

import { usePayment } from 'src/hooks/usePayment';
import { useTimer } from 'src/hooks/useTimer';
import { ConfirmedTxContent } from 'src/pagesComponents/payment/widgetScreens/txStatusContent/ConfirmedTxContent';

const StyledTimerWrapper = styled(Typography, {
  name: 'StyledTimerWrapper'
})({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
});

const StyledLoaderShadow = styled(CircularProgress, {
  name: 'StyledLoader'
})(({ theme }) => ({
  color: theme.palette.success.light
}));

const StyledLoader = styled(CircularProgress, {
  name: 'StyledLoaderWrapper'
})(({ theme }) => ({
  position: 'absolute',
  left: 0,
  color: theme.palette.success.main
}));

export const PaymentSuccessScreen: React.FC = () => {
  const { data: order } = usePayment();

  const handleRedirect = useCallback(() => {
    if (order?.metadata.redirectUrl) {
      window.location.href = order?.metadata.redirectUrl as string;
    } else {
      toast.error('Failed to redirect back to the site');
    }
  }, [order]);

  const {
    countdown,
    retrigger: triggerCountdown,
    triggered
  } = useTimer({
    autoStart: false,
    secondsToWait: 5,
    callBack: handleRedirect
  });

  useTimer({
    secondsToWait: 8,
    callBack: () => {
      triggerCountdown();
    }
  });

  return (
    <>
      {!triggered ? (
        <ConfirmedTxContent
          title={'Payment is Confirmed'}
          description={'The payment is Confirmed'}
          buttonContent={'Back to the site'}
          onClick={handleRedirect}
        />
      ) : (
        <>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} flexGrow={1}>
            <Box position='relative' mb={6}>
              <StyledTimerWrapper>{countdown}</StyledTimerWrapper>
              <StyledLoaderShadow variant='determinate' size={60} thickness={4} value={100} />
              <StyledLoader size={60} thickness={6} />
            </Box>
            <Typography variant='h5' mb={4}>
              {'Payment is Confirmed'}
            </Typography>
            <Typography variant='subtitle2' textAlign={'center'} mb={10}>
              {'You will be automatically redirected to the site.'}
            </Typography>
            <DefaultButton onClick={handleRedirect}>{'Back to the site'}</DefaultButton>
          </Box>
        </>
      )}
    </>
  );
};
