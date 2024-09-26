import { ReactNode } from 'react';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { Box, Card, styled } from '@mui/material';
import { useAppSelector } from 'src/store/hooks/reduxHooks';
import { PaymentScreen } from 'src/store/payment/slice';
import { PoweredByBitOfTrade } from 'src/pagesComponents/common/PoweredByBitOfTrade';
import { DefaultScreen } from 'src/pagesComponents/payment/widgetScreens/DefaultScreen';
import { PaymentSuccessScreen } from 'src/pagesComponents/payment/widgetScreens/payment/PaymentSuccessScreen';
import { UnlockScreen } from 'src/pagesComponents/payment/widgetScreens/unlock/UnlockScreen';
import { UnlockWaitingScreen } from 'src/pagesComponents/payment/widgetScreens/unlock/UnlockWaitingScreen';
import { UnlockSuccessScreen } from 'src/pagesComponents/payment/widgetScreens/unlock/UnlockSuccessScreen';
import { UnlockErrorScreen } from 'src/pagesComponents/payment/widgetScreens/unlock/UnlockErrorScreen';
import { PaymentWaitingScreen } from 'src/pagesComponents/payment/widgetScreens/payment/PaymentWaitingScreen';
import { PaymentErrorScreen } from 'src/pagesComponents/payment/widgetScreens/payment/PaymentErrorScreen';
import WalletProvider from 'src/providers/WalletProvider';
import { SearchTokenScreen } from 'src/pagesComponents/payment/widgetScreens/SearchTokenScreen';
import { TransactionTracker } from 'src/providers/TransactionTracker';
import { useRouter } from 'next/router';

const StyledWidgetWrapper = styled(Card, {
  name: 'StyledWidgetWrapper'
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 696,
  maxWidth: 522,
  width: '100%',
  padding: theme.spacing(10)
}));

const Payment = () => {
  // todo: consider moving it to custom selector
  const { query } = useRouter();
  const payment = useAppSelector(({ payment }) => payment);
  const screen = payment.screen[query?.orderId as string] ?? PaymentScreen.DEFAULT;

  return (
    <WalletProvider>
      <TransactionTracker>
        <Box className='content-center' position={'relative'}>
          <StyledWidgetWrapper>
            {screen === PaymentScreen.DEFAULT && <DefaultScreen />}

            {screen === PaymentScreen.UNLOCK && <UnlockScreen />}
            {screen === PaymentScreen.UNLOCK_WAITING && <UnlockWaitingScreen />}
            {screen === PaymentScreen.UNLOCK_SUCCESS && <UnlockSuccessScreen />}
            {screen === PaymentScreen.UNLOCK_ERROR && <UnlockErrorScreen />}

            {screen === PaymentScreen.PAYMENT_WAITING && <PaymentWaitingScreen />}
            {screen === PaymentScreen.PAYMENT_SUCCESS && <PaymentSuccessScreen />}
            {screen === PaymentScreen.PAYMENT_ERROR && <PaymentErrorScreen />}
            {screen === PaymentScreen.SEARCH_TOKEN && <SearchTokenScreen />}
          </StyledWidgetWrapper>

          <PoweredByBitOfTrade />
        </Box>
      </TransactionTracker>
    </WalletProvider>
  );
};

Payment.authGuard = false;
Payment.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default Payment;
