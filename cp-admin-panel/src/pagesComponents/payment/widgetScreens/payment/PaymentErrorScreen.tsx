import { useCallback } from 'react';
import { useAppDispatch } from 'src/store/hooks/reduxHooks';
import { setPaymentScreen, PaymentScreen } from 'src/store/payment/slice';
import { ErrorTxContent } from '../txStatusContent/ErrorTxContent';

export const PaymentErrorScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleDismiss = useCallback(() => {
    dispatch(setPaymentScreen(PaymentScreen.DEFAULT));
  }, [dispatch]);

  return <ErrorTxContent title='Reject' description='The transaction was rejected.' onDismiss={handleDismiss} />;
};
